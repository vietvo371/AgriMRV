<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiAnalysisResult;
use App\Models\CarbonCredit;
use App\Models\EvidenceFile;
use App\Models\FarmProfile;
use App\Models\MrvDeclaration;
use App\Models\PlotBoundary;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CreditController extends Controller
{
    use ApiResponseTrait;

    public function profile(Request $request)
    {
        $user = $request->user();

        // Lấy farm profile của user
        $farmProfile = FarmProfile::where('user_id', $user->id)->first();
        if (!$farmProfile) {
            return $this->error('No farm profile found', 404);
        }

        // Tính toán credit score
        $creditScore = $this->calculateCreditScore($user->id);

        // Tính toán carbon performance
        $carbonPerformance = $this->calculateCarbonPerformance($user->id);

        // Tính toán MRV reliability
        $mrvReliability = $this->calculateMRVReliability($user->id);

        // Tính toán carbon reduction
        $carbonReduction = $this->calculateCarbonReduction($user->id);

        return $this->success([
            'credit_score' => $creditScore,
            'carbon_performance' => $carbonPerformance,
            'mrv_reliability' => $mrvReliability,
            'carbon_reduction' => $carbonReduction,
            'farm_profile' => [
                'id' => $farmProfile->id,
                'total_area' => $farmProfile->total_area_hectares,
                'rice_area' => $farmProfile->rice_area_hectares,
                'agroforestry_area' => $farmProfile->agroforestry_area_hectares,
            ]
        ]);
    }

    public function mrvData(Request $request)
    {
        $user = $request->user();

        // Lấy farm profile
        $farmProfile = FarmProfile::where('user_id', $user->id)->first();
        if (!$farmProfile) {
            return $this->error('No farm profile found', 404);
        }

        // Lấy plots
        $plots = PlotBoundary::where('farm_profile_id', $farmProfile->id)->get();

        // Lấy MRV declarations
        $declarations = MrvDeclaration::where('farm_profile_id', $user->id)
            ->where('status', 'verified')
            ->get();

        // Tính toán tổng số cây
        $totalTrees = $plots->sum(function($plot) {
            if ($plot->plot_type === 'agroforestry') {
                return ($plot->area_hectares * 200); // Giả sử 200 cây/ha
            }
            return 0;
        });

        // Lấy evidence photos
        $evidenceCount = EvidenceFile::whereHas('mrvDeclaration', function($q) use ($user) {
            $q->where('farm_profile_id', $user->id);
        })->count();

        // Tính completion rate
        $totalDeclarations = MrvDeclaration::where('farm_profile_id', $user->id)->count();
        $verifiedDeclarations = MrvDeclaration::where('farm_profile_id', $user->id)
            ->where('status', 'verified')
            ->count();
        $completionRate = $totalDeclarations > 0 ? ($verifiedDeclarations / $totalDeclarations) * 100 : 0;

        return $this->success([
            'rice_area' => $farmProfile->rice_area_hectares,
            'agroforestry_area' => $farmProfile->agroforestry_area_hectares,
            'tree_count' => (int) $totalTrees,
            'awd_cycles' => $declarations->avg('awd_cycles_per_season') ?? 0,
            'straw_management' => $declarations->whereNotNull('straw_management')->count(),
            'evidence_photos' => $evidenceCount,
            'gps_verification' => $declarations->whereNotNull('gps_latitude')->count(),
            'diary_completion' => round($completionRate, 2),
            'total_plots' => $plots->count(),
            'verified_declarations' => $verifiedDeclarations,
        ]);
    }

    public function scoreHistory(Request $request)
    {
        $user = $request->user();
        $period = $request->input('period', '6months');

        // Tính số tháng
        $months = match($period) {
            '3months' => 3,
            '6months' => 6,
            '12months' => 12,
            default => 6
        };

        $startDate = now()->subMonths($months);

        // Lấy lịch sử score theo tháng
        $history = [];
        for ($i = 0; $i < $months; $i++) {
            $date = $startDate->copy()->addMonths($i);
            $score = $this->calculateCreditScoreForMonth($user->id, $date);

            $history[] = [
                'date' => $date->format('Y-m'),
                'score' => $score,
                'change' => $i > 0 ? $score - $history[$i-1]['score'] : 0,
            ];
        }

        return $this->success([
            'period' => $period,
            'history' => $history,
            'trend' => $this->calculateTrend($history),
        ]);
    }

    public function scoreBreakdown(Request $request)
    {
        $user = $request->user();

        $categories = [
            'rice_farming' => $this->calculateRiceFarmingScore($user->id),
            'agroforestry' => $this->calculateAgroforestryScore($user->id),
            'evidence_quality' => $this->calculateEvidenceQualityScore($user->id),
            'gps_verification' => $this->calculateGPSVerificationScore($user->id),
            'declaration_completion' => $this->calculateDeclarationCompletionScore($user->id),
        ];

        return $this->success([
            'categories' => $categories,
            'total_score' => array_sum(array_column($categories, 'score')),
            'overall_trend' => $this->calculateOverallTrend($categories),
        ]);
    }

    public function monthlyChange(Request $request)
    {
        $user = $request->user();

        $currentMonth = now()->format('Y-m');
        $lastMonth = now()->subMonth()->format('Y-m');

        $currentScore = $this->calculateCreditScoreForMonth($user->id, now());
        $lastMonthScore = $this->calculateCreditScoreForMonth($user->id, now()->subMonth());

        $change = $currentScore - $lastMonthScore;

        $trend = match(true) {
            $change > 5 => 'up',
            $change < -5 => 'down',
            default => 'stable'
        };

        return $this->success([
            'change' => $change,
            'trend' => $trend,
            'current_month' => $currentMonth,
            'last_month' => $lastMonth,
            'current_score' => $currentScore,
            'last_month_score' => $lastMonthScore,
        ]);
    }

    // Helper methods
    private function calculateCreditScore(int $userId): float
    {
        $carbonPerformance = $this->calculateCarbonPerformance($userId);
        $mrvReliability = $this->calculateMRVReliability($userId);

        // Credit score = (CP * 0.6) + (MR * 0.4)
        return round(($carbonPerformance * 0.6) + ($mrvReliability * 0.4), 2);
    }

    private function calculateCarbonPerformance(int $userId): float
    {
        $declarations = MrvDeclaration::where('farm_profile_id', $userId)
            ->where('status', 'verified')
            ->get();

        if ($declarations->isEmpty()) {
            return 0.0;
        }

        $totalScore = $declarations->sum('carbon_performance_score');
        return round($totalScore / $declarations->count(), 2);
    }

    private function calculateMRVReliability(int $userId): float
    {
        $declarations = MrvDeclaration::where('farm_profile_id', $userId)
            ->where('status', 'verified')
            ->get();

        if ($declarations->isEmpty()) {
            return 0.0;
        }

        $totalScore = $declarations->sum('mrv_reliability_score');
        return round($totalScore / $declarations->count(), 2);
    }

    private function calculateCarbonReduction(int $userId): float
    {
        $declarations = MrvDeclaration::where('farm_profile_id', $userId)
            ->where('status', 'verified')
            ->get();

        return round($declarations->sum('estimated_carbon_credits'), 2);
    }

    private function calculateCreditScoreForMonth(int $userId, $date): float
    {
        $startOfMonth = $date->copy()->startOfMonth();
        $endOfMonth = $date->copy()->endOfMonth();

        $declarations = MrvDeclaration::where('farm_profile_id', $userId)
            ->where('status', 'verified')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->get();

        if ($declarations->isEmpty()) {
            return 0.0;
        }

        $carbonPerformance = $declarations->avg('carbon_performance_score') ?? 0;
        $mrvReliability = $declarations->avg('mrv_reliability_score') ?? 0;

        return round(($carbonPerformance * 0.6) + ($mrvReliability * 0.4), 2);
    }

    private function calculateRiceFarmingScore(int $userId): array
    {
        $declarations = MrvDeclaration::where('farm_profile_id', $userId)
            ->where('status', 'verified')
            ->get();

        $score = 0;
        $impact = 0;
        $area = 0;
        $carbonReduction = 0;

        foreach ($declarations as $decl) {
            $score += $decl->carbon_performance_score ?? 0;
            $impact += ($decl->awd_cycles_per_season ?? 0) * 2; // AWD cycles impact
            $area += $decl->farmProfile->rice_area_hectares ?? 0;
            $carbonReduction += $decl->estimated_carbon_credits ?? 0;
        }

        $avgScore = $declarations->count() > 0 ? $score / $declarations->count() : 0;

        return [
            'score' => round($avgScore, 2),
            'impact' => $impact,
            'trend' => $this->getTrend($avgScore),
            'carbon_reduction' => round($carbonReduction, 2),
            'area' => round($area, 2),
        ];
    }

    private function calculateAgroforestryScore(int $userId): array
    {
        $declarations = MrvDeclaration::where('farm_profile_id', $userId)
            ->where('status', 'verified')
            ->get();

        $score = 0;
        $impact = 0;
        $area = 0;
        $carbonReduction = 0;

        foreach ($declarations as $decl) {
            $score += $decl->carbon_performance_score ?? 0;
            $impact += count($decl->tree_species ?? []) * 5; // Tree species impact
            $area += $decl->farmProfile->agroforestry_area_hectares ?? 0;
            $carbonReduction += $decl->estimated_carbon_credits ?? 0;
        }

        $avgScore = $declarations->count() > 0 ? $score / $declarations->count() : 0;

        return [
            'score' => round($avgScore, 2),
            'impact' => $impact,
            'trend' => $this->getTrend($avgScore),
            'carbon_reduction' => round($carbonReduction, 2),
            'area' => round($area, 2),
        ];
    }

    private function calculateEvidenceQualityScore(int $userId): array
    {
        $evidenceFiles = EvidenceFile::whereHas('mrvDeclaration', function($q) use ($userId) {
            $q->where('farm_profile_id', $userId);
        })->get();

        $score = 0;
        $impact = 0;
        $area = 0;
        $carbonReduction = 0;

        foreach ($evidenceFiles as $evidence) {
            $aiResult = $evidence->aiAnalysisResult;
            if ($aiResult) {
                $score += $aiResult->confidence_score ?? 0;
                $impact += ($aiResult->authenticity_score ?? 0) / 10;
            }
        }

        $avgScore = $evidenceFiles->count() > 0 ? $score / $evidenceFiles->count() : 0;

        return [
            'score' => round($avgScore, 2),
            'impact' => round($impact, 2),
            'trend' => $this->getTrend($avgScore),
            'carbon_reduction' => 0, // Evidence quality doesn't directly affect carbon
            'area' => 0,
        ];
    }

    private function calculateGPSVerificationScore(int $userId): array
    {
        $declarations = MrvDeclaration::where('farm_profile_id', $userId)
            ->where('status', 'verified')
            ->get();

        $gpsVerified = $declarations->whereNotNull('gps_latitude')->count();
        $total = $declarations->count();

        $score = $total > 0 ? ($gpsVerified / $total) * 100 : 0;
        $impact = $gpsVerified * 10; // GPS verification impact

        return [
            'score' => round($score, 2),
            'impact' => $impact,
            'trend' => $this->getTrend($score),
            'carbon_reduction' => 0, // GPS doesn't directly affect carbon
            'area' => 0,
        ];
    }

    private function calculateDeclarationCompletionScore(int $userId): array
    {
        $total = MrvDeclaration::where('farm_profile_id', $userId)->count();
        $verified = MrvDeclaration::where('farm_profile_id', $userId)
            ->where('status', 'verified')
            ->count();

        $score = $total > 0 ? ($verified / $total) * 100 : 0;
        $impact = $verified * 5; // Completion impact

        return [
            'score' => round($score, 2),
            'impact' => $impact,
            'trend' => $this->getTrend($score),
            'carbon_reduction' => 0, // Completion doesn't directly affect carbon
            'area' => 0,
        ];
    }

    private function getTrend(float $score): string
    {
        if ($score >= 80) return 'excellent';
        if ($score >= 60) return 'good';
        if ($score >= 40) return 'fair';
        return 'poor';
    }

    private function calculateTrend(array $history): string
    {
        if (count($history) < 2) return 'stable';

        $first = $history[0]['score'];
        $last = end($history)['score'];
        $change = $last - $first;

        if ($change > 10) return 'up';
        if ($change < -10) return 'down';
        return 'stable';
    }

    private function calculateOverallTrend(array $categories): string
    {
        $scores = array_column($categories, 'score');
        $avgScore = array_sum($scores) / count($scores);

        return $this->getTrend($avgScore);
    }
}
