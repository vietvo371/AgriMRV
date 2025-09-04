<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CarbonCredit;
use App\Models\CooperativeMembership;
use App\Models\FarmProfile;
use App\Models\FinancialRecord;
use App\Models\MrvDeclaration;
use App\Models\PlotBoundary;
use App\Models\TrainingRecord;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    use ApiResponseTrait;

    public function user(Request $request)
    {
        $user = $request->user();

        // Lấy farm profile để tính carbon grade
        $farmProfile = FarmProfile::where('user_id', $user->id)->first();

        // Tính carbon grade dựa trên credit score
        $carbonGrade = $this->calculateCarbonGrade($user->id);

        // Kiểm tra MRV verification status thông qua farm profile
        $mrvVerified = false;
        if ($farmProfile) {
            $mrvVerified = MrvDeclaration::where('farm_profile_id', $farmProfile->id)
                ->where('status', 'verified')
                ->exists();
        }

        return $this->success([
            'farmer' => [
                'id' => $user->id,
                'name' => $user->full_name,
                'avatar' => $user->avatar ?? 'https://example.com/avatar.jpg',
                'carbon_grade' => $carbonGrade,
                'join_date' => $user->created_at->format('Y-m-d'),
                'phone' => $user->phone,
                'email' => $user->email,
                'location' => $user->address ?? 'Unknown',
                'date_of_birth' => $user->date_of_birth?->format('Y-m-d'),
                'mrv_verified' => $mrvVerified
            ]
        ]);
    }

    public function farmStats(Request $request)
    {
        $user = $request->user();

        // Lấy farm profile
        $farmProfile = FarmProfile::where('user_id', $user->id)->first();
        if (!$farmProfile) {
            return $this->error('No farm profile found', 404);
        }

        // Tính toán các stats
        $totalArea = $farmProfile->total_area_hectares;

        $carbonCreditsEarned = CarbonCredit::whereHas('mrvDeclaration', function($q) use ($farmProfile) {
            $q->where('farm_profile_id', $farmProfile->id);
        })->where('status', 'issued')->sum('credit_amount');

        $verificationRate = $this->calculateVerificationRate($user->id);

        $monthlyIncome = FinancialRecord::where('user_id', $user->id)
            ->where('record_type', 'carbon_revenue')
            ->where('status', 'paid')
            ->where('transaction_date', '>=', now()->subMonth())
            ->sum('amount');

        $carbonReduction = MrvDeclaration::where('farm_profile_id', $farmProfile->id)
            ->where('status', 'verified')
            ->sum('estimated_carbon_credits');

        $mrvReliability = MrvDeclaration::where('farm_profile_id', $farmProfile->id)
            ->where('status', 'verified')
            ->avg('mrv_reliability_score') ?? 0;

        return $this->success([
            'farm_stats' => [
                'total_area' => round($totalArea, 2),
                'carbon_credits_earned' => round($carbonCreditsEarned, 2),
                'verification_rate' => round($verificationRate, 2),
                'monthly_income' => round($monthlyIncome, 2),
                'carbon_reduction' => round($carbonReduction, 2),
                'mrv_reliability' => round($mrvReliability, 2)
            ]
        ]);
    }

    public function landPlots(Request $request)
    {
        $user = $request->user();

        // Lấy farm profile
        $farmProfile = FarmProfile::where('user_id', $user->id)->first();
        if (!$farmProfile) {
            return $this->error('No farm profile found', 404);
        }

        // Lấy land plots với relationship đúng
        $plots = PlotBoundary::where('farm_profile_id', $farmProfile->id)
            ->with(['farmProfile'])
            ->latest('id')
            ->get()
            ->map(function (PlotBoundary $plot) {
                $farm = $plot->farmProfile;
                $latestDecl = MrvDeclaration::where('farm_profile_id', $farm->id)->where('plot_boundary_id', $plot->id)->latest('id')->first();
                $status = $latestDecl?->status ?? 'draft';
                $verification = null;
                $verificationDate = null;
                $verificationScore = null;

                if ($latestDecl) {
                    $verification = \App\Models\VerificationRecord::where('mrv_declaration_id', $latestDecl->id)->latest('id')->first();
                    $verificationDate = $verification?->verification_date;
                    $verificationScore = $verification?->verification_score;
                }

                // Sử dụng logic tính toán scores từ PlotController
                [$cp, $rel, $final] = $this->computeScores($farm, $latestDecl, $verification);

                return [
                    'id' => (string) $plot->id,
                    'name' => $plot->plot_name ?? ('Plot #'.$plot->id),
                    'location' => $farm->soil_type ?? 'Unknown',
                    'total_area' => (float) ($plot->area_hectares ?? 0),
                    'plot_type' => $plot->plot_type,
                    'rice_area' => $farm->rice_area_hectares !== null ? (float) $farm->rice_area_hectares : null,
                    'agroforestry_area' => $farm->agroforestry_area_hectares !== null ? (float) $farm->agroforestry_area_hectares : null,
                    'status' => $status,
                    'verification_date' => $this->formatYmd($verificationDate),
                    'carbon_performance_score' => $cp,
                    'mrv_reliability_score' => $rel,
                    'final_score' => $final,
                    'grade' => $this->gradeFromScore($final),
                    'created_at' => $this->formatIso($plot->created_at),
                    'updated_at' => $this->formatIso($plot->updated_at),
                ];
            });

        return $this->success(['land_plots' => $plots]);
    }

    public function yieldHistory(Request $request)
    {
        $user = $request->user();
        $limit = min(20, max(1, (int) $request->input('limit', 5)));

        // Lấy yield history từ financial records (giả lập)
        // Trong thực tế, có thể có bảng yields riêng
        $yields = $this->generateYieldHistory($user->id, $limit);

        return $this->success([
            'yields' => $yields
        ]);
    }

    public function memberships(Request $request)
    {
        $user = $request->user();

        // Lấy cooperative membership
        $membership = CooperativeMembership::where('user_id', $user->id)
            ->with('cooperative')
            ->first();

        // Lấy training records
        $trainingRecords = TrainingRecord::where('user_id', $user->id)
            ->orderBy('completion_date', 'desc')
            ->get()
            ->map(function ($training) {
                return [
                    'name' => $training->training_name,
                    'completion_date' => $training->completion_date->format('Y-m-d'),
                    'score' => $training->score ?? 0
                ];
            });

        $overallTrainingScore = $trainingRecords->count() > 0
            ? round($trainingRecords->avg('score'), 2)
            : 0;

        return $this->success([
            'memberships' => [
                'cooperative' => $membership ? $membership->cooperative->organization_name : 'No Cooperative',
                'cooperative_status' => $membership ? $membership->status : 'inactive',
                'training_completed' => $trainingRecords,
                'overall_training_score' => $overallTrainingScore
            ]
        ]);
    }

    public function loanHistory(Request $request)
    {
        $user = $request->user();

        // Lấy loan history từ financial records
        $loans = FinancialRecord::where('user_id', $user->id)
            ->where('record_type', 'loan')
            ->orderBy('transaction_date', 'desc')
            ->get()
            ->map(function ($loan) {
                return [
                    'id' => $loan->id,
                    'date' => $loan->transaction_date->format('Y-m-d'),
                    'amount' => round($loan->amount, 2),
                    'status' => $loan->status,
                    'purpose' => $loan->description ?? 'Agricultural Loan',
                    'repayment_date' => $loan->status === 'repaid'
                        ? $loan->transaction_date->addMonths(6)->format('Y-m-d')
                        : null,
                    'interest_rate' => 8.5 // Giả lập interest rate
                ];
            });

        $totalBorrowed = $loans->sum('amount');
        $totalRepaid = $loans->where('status', 'repaid')->sum('amount');
        $creditScore = $this->calculateLoanCreditScore($totalBorrowed, $totalRepaid);

        return $this->success([
            'loans' => $loans,
            'total_borrowed' => round($totalBorrowed, 2),
            'total_repaid' => round($totalRepaid, 2),
            'credit_score' => $creditScore
        ]);
    }

    // Helper methods
    private function calculateCarbonGrade(int $userId): string
    {
        $farmProfile = FarmProfile::where('user_id', $userId)->first();
        if (!$farmProfile) {
            return 'F';
        }

        $declarations = MrvDeclaration::where('farm_profile_id', $farmProfile->id)
            ->where('status', 'verified')
            ->get();

        if ($declarations->isEmpty()) {
            return 'F';
        }

        $avgScore = ($declarations->avg('carbon_performance_score') + $declarations->avg('mrv_reliability_score')) / 2;

        if ($avgScore >= 90) return 'A+';
        if ($avgScore >= 85) return 'A';
        if ($avgScore >= 80) return 'A-';
        if ($avgScore >= 75) return 'B+';
        if ($avgScore >= 70) return 'B';
        if ($avgScore >= 65) return 'B-';
        if ($avgScore >= 60) return 'C+';
        if ($avgScore >= 55) return 'C';
        if ($avgScore >= 50) return 'C-';
        if ($avgScore >= 45) return 'D+';
        if ($avgScore >= 40) return 'D';
        return 'F';
    }

    private function calculateVerificationRate(int $userId): float
    {
        $farmProfile = FarmProfile::where('user_id', $userId)->first();
        if (!$farmProfile) {
            return 0;
        }

        $total = MrvDeclaration::where('farm_profile_id', $farmProfile->id)->count();
        $verified = MrvDeclaration::where('farm_profile_id', $farmProfile->id)
            ->where('status', 'verified')
            ->count();

        return $total > 0 ? ($verified / $total) * 100 : 0;
    }

    private function calculateCarbonScore($declaration): string
    {
        if (!$declaration) return 'F';

        // Tính final score từ carbon performance và mrv reliability
        $cp = $declaration->carbon_performance_score ?? 0;
        $mr = $declaration->mrv_reliability_score ?? 0;
        $finalScore = ($cp * 0.7) + ($mr * 0.3);

        // Gán grade dựa trên công thức tính toán
        if ($finalScore >= 75) return 'A'; // Xuất sắc: CP ≥ 75 và MR ≥ 75
        if ($finalScore >= 60) return 'B'; // Tốt: CP ≥ 60 và MR ≥ 60
        if ($finalScore >= 45) return 'C'; // Trung bình: CP ≥ 45 và MR ≥ 45
        if ($finalScore >= 30) return 'D'; // Yếu: CP ≥ 30 và MR ≥ 30
        return 'F'; // Kém: CP < 30 hoặc MR < 30
    }

    private function getLocationFromCoordinates($coordinates): string
    {
        if (!$coordinates || !is_array($coordinates) || empty($coordinates)) {
            return 'Unknown';
        }

        // Giả lập location từ coordinates
        // Trong thực tế, có thể sử dụng reverse geocoding API
        $locations = ['An Giang', 'Dong Thap', 'Can Tho', 'Soc Trang', 'Bac Lieu'];
        return $locations[array_rand($locations)];
    }

    private function generateYieldHistory(int $userId, int $limit): array
    {
        // Giả lập yield history vì không có bảng yields thật
        $seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
        $crops = ['Rice', 'Corn', 'Vegetables'];
        $yields = [];

        for ($i = 0; $i < $limit; $i++) {
            $year = 2024 - floor($i / 4);
            $season = $seasons[$i % 4];
            $crop = $crops[$i % 3];

            $yields[] = [
                'id' => $i + 1,
                'season' => $season . ' ' . $year,
                'crop' => $crop,
                'yield' => round(4 + (rand(0, 30) / 10), 1),
                'price' => 8000 + (rand(0, 2000)),
                'harvest_date' => date('Y-m-d', strtotime("-$i months")),
                'is_highlight' => $i === 0
            ];
        }

        return $yields;
    }

    private function calculateLoanCreditScore(float $totalBorrowed, float $totalRepaid): string
    {
        if ($totalBorrowed <= 0) return 'excellent';

        $repaymentRate = ($totalRepaid / $totalBorrowed) * 100;

        if ($repaymentRate >= 100) return 'excellent';
        if ($repaymentRate >= 90) return 'good';
        if ($repaymentRate >= 80) return 'fair';
        if ($repaymentRate >= 70) return 'poor';
        return 'very_poor';
    }

    /**
     * Tính toán scores cho Carbon Performance, MRV Reliability và Final Score
     * Dựa trên công thức carbon reduction/sequestration thực tế
     */
    private function computeScores(FarmProfile $farm = null, MrvDeclaration $decl = null, \App\Models\VerificationRecord $ver = null): array
    {
        if (!$farm || !$decl) {
            return [0, 0, 0];
        }

        $riceArea = $farm->rice_area_hectares ?? 0;
        $agroArea = $farm->agroforestry_area_hectares ?? 0;
        $treeDensity = $decl->tree_density_per_hectare ?? 0;

        // === BƯỚC 1: TÍNH CARBON REDUCTION/SEQUESTRATION (tCO₂e) ===

        // Lúa AWD: Giảm methane và không đốt rơm rạ
        $baselineCH4 = 1.2; // tCO₂e/ha/season (methane từ ruộng ngập nước truyền thống)
        $awdReduction = $baselineCH4 * 0.3; // 30% giảm methane từ AWD = 0.36 tCO₂e/ha/season
        $strawAvoidance = 0.3; // tCO₂e/ha/season (không đốt rơm rạ)
        $ricePerHa = $awdReduction + $strawAvoidance; // Tổng = 0.66 tCO₂e/ha/season
        $riceTotalReduction = $ricePerHa * $riceArea; // Tổng carbon reduction cho toàn bộ diện tích lúa

        // Nông lâm kết hợp: Cây hấp thụ CO2 từ khí quyển
        $carbonPerTree = 0.022; // tCO₂/cây/năm (theo nghiên cứu thực tế)
        $treesTotal = $treeDensity * $agroArea; // Tổng số cây trên toàn bộ diện tích
        $agroTotalSequestration = $treesTotal * $carbonPerTree * 0.5; // Nửa năm demo

        // === BƯỚC 2: TÍNH ĐIỂM CARBON PERFORMANCE (CP) ===

        // Mục tiêu để đạt 100 điểm
        $riceTarget = 0.8; // tCO₂e/ha/season (mục tiêu cho lúa)
        $agroTarget = 1.5; // tCO₂e/ha/năm (mục tiêu cho nông lâm)

        // Tính điểm từng loại (tối đa 100 điểm)
        $cpRice = min(100, ($ricePerHa / $riceTarget) * 100); // Điểm lúa
        $cpAgro = min(100, ($agroTotalSequestration / $agroArea / $agroTarget) * 100); // Điểm nông lâm

        // Điểm tổng hợp: 60% lúa + 40% nông lâm (weighted average)
        $cpTotal = $cpRice * 0.6 + $cpAgro * 0.4;

        // === BƯỚC 3: TÍNH ĐIỂM MRV RELIABILITY (MR) ===

        // Lấy AI confidence score từ evidence files
        $aiConfidence = 0.0;
        if ($decl) {
            $evidenceIds = $decl->evidenceFiles()->pluck('id');
            $aiConfidence = (float) (\App\Models\AiAnalysisResult::whereIn('evidence_file_id', $evidenceIds)->max('confidence_score') ?? 0);
        }

        $verScore = (float) ($ver?->verification_score ?? 0); // Điểm verification
        $declReliability = (float) ($decl?->mrv_reliability_score ?? 0); // Điểm reliability từ declaration

        // Tính MRV Reliability: 50% lúa + 50% nông lâm
        $mrRice = 75 + ($aiConfidence * 0.2); // Base 75 + ảnh hưởng AI (0-20 điểm)
        $mrAgro = 70 + ($verScore * 0.3); // Base 70 + ảnh hưởng verification (0-30 điểm)
        $mrTotal = $mrRice * 0.5 + $mrAgro * 0.5;

        // === BƯỚC 4: TÍNH FINAL SCORE ===
        // 70% Carbon Performance + 30% MRV Reliability
        $final = round(min(100, $cpTotal * 0.7 + $mrTotal * 0.3), 2);

        return [round($cpTotal, 2), round($mrTotal, 2), $final];
    }

    /**
     * Gán grade (A/B/C/D/F) dựa trên final score
     * Dựa trên công thức: CP ≥ 75 và MR ≥ 75 thì grade A
     */
    public function gradeFromScore($score): string
    {
        // Gán grade dựa trên công thức tính toán
        if ($score >= 75) return 'A'; // Xuất sắc: CP ≥ 75 và MR ≥ 75
        if ($score >= 60) return 'B'; // Tốt: CP ≥ 60 và MR ≥ 60
        if ($score >= 45) return 'C'; // Trung bình: CP ≥ 45 và MR ≥ 45
        if ($score >= 30) return 'D'; // Yếu: CP ≥ 30 và MR ≥ 30
        return 'F'; // Kém: CP < 30 hoặc MR < 30
    }

    private function formatIso($value): ?string
    {
        if (empty($value)) return null;
        if ($value instanceof \DateTimeInterface) {
            return $value->format(DATE_ATOM);
        }
        try {
            return \Illuminate\Support\Carbon::parse($value)->toIso8601String();
        } catch (\Exception $e) {
            return null;
        }
    }

    private function formatYmd($value): ?string
    {
        if (empty($value)) return null;
        if ($value instanceof \DateTimeInterface) {
            return $value->format('Y-m-d');
        }
        try {
            return \Illuminate\Support\Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }
}
