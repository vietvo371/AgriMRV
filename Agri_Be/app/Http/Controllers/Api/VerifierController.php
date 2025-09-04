<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MrvDeclaration;
use App\Models\VerificationRecord;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use App\Models\User;
use App\Models\FarmProfile;
use App\Models\EvidenceFile;
use App\Models\AiAnalysisResult;
use App\Models\CarbonCredit;
use App\Models\CarbonTransaction;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class VerifierController extends Controller
{
    use ApiResponseTrait;

    public function queue(Request $request)
    {
        // Danh sách MRV declarations đang chờ xác minh
        $pending = MrvDeclaration::with(['farmProfile.user:id,full_name,email,address', 'farmProfile:id,user_id,total_area_hectares,rice_area_hectares,agroforestry_area_hectares,primary_crop_type'])
            ->where('status', 'submitted')
            ->orderBy('created_at', 'asc')
            ->take(50)
            ->get();

                // Add evidence files count and format data
        $pending->each(function ($declaration) {
            $declaration->evidence_files_count = EvidenceFile::where('mrv_declaration_id', $declaration->id)->count();
            $declaration->estimated_carbon_credits = $declaration->estimated_carbon_credits ?? 0;

            // Add user data for easier access
            $declaration->user = $declaration->farmProfile->user ?? null;

            // Enrich farm_profile with location for frontend convenience
            if ($declaration->farmProfile) {
                $declaration->farmProfile->location = optional($declaration->farmProfile->user)->address;
            }

            // Derive priority from seeder business signals
            $declaration->priority = $this->derivePriority(
                (float) ($declaration->carbon_performance_score ?? 0),
                (float) ($declaration->mrv_reliability_score ?? 0),
                (int) ($declaration->evidence_files_count ?? 0),
                (float) ($declaration->estimated_carbon_credits ?? 0)
            );
        });

        return $this->success(['queue' => $pending]);
    }

    public function myVerifications(Request $request)
    {
        $verifier = $request->user();

        // Get filters from request
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');
        $verificationType = $request->get('verification_type');
        $verificationStatus = $request->get('verification_status');

        $query = VerificationRecord::with(['mrvDeclaration.farmProfile.user:id,full_name,email,address', 'mrvDeclaration.farmProfile:id,user_id,primary_crop_type'])
            ->where('verifier_id', $verifier->id);

        // Apply filters
        if ($startDate && $endDate) {
            $query->whereBetween('verification_date', [$startDate, $endDate]);
        }

        if ($verificationType) {
            $query->where('verification_type', $verificationType);
        }

        if ($verificationStatus) {
            $query->where('verification_status', $verificationStatus);
        }

        $records = $query->orderBy('verification_date', 'desc')->get();

        // Add additional data
        $records->each(function ($record) {
            $record->farmer_name = $record->mrvDeclaration->farmProfile->user->full_name ?? 'Unknown';
            $record->location = $record->mrvDeclaration->farmProfile->user->address ?? 'N/A';
            $record->carbon_claims = $record->mrvDeclaration->estimated_carbon_credits ?? 0;
        });

        return $this->success(['verifications' => $records]);
    }

    /**
     * Ưu tiên hóa yêu cầu dựa trên logic seeding: hiệu suất carbon (CP), độ tin cậy MRV (MR),
     * số lượng evidence và ước tính tín chỉ carbon.
     */
    private function derivePriority(float $carbonPerformanceScore, float $mrvReliabilityScore, int $evidenceCount, float $estimatedCredits): string
    {
        // Chuẩn hóa điểm theo trọng số (gần với logic tổng hợp trong seeder: CP và MR ~ 50/50)
        $scoreComponent = ($carbonPerformanceScore * 0.5) + ($mrvReliabilityScore * 0.5); // 0..100

        // Tăng ưu tiên nếu có nhiều bằng chứng và tín chỉ cao
        $evidenceBoost = min(15, $evidenceCount * 2.5); // tối đa ~15 điểm
        $creditsBoost = min(20, $estimatedCredits * 0.8); // tối đa ~20 điểm

        $composite = $scoreComponent + $evidenceBoost + $creditsBoost; // thang ~0..135

        if ($composite >= 95) return 'high';
        if ($composite >= 70) return 'medium';
        return 'low';
    }

    public function analytics(Request $request)
    {
        $verifier = $request->user();

        // Get filters
        $timePeriod = $request->get('time_period', 30);
        $region = $request->get('region');
        $farmSize = $request->get('farm_size');
        $cropType = $request->get('crop_type');
        $verificationMethod = $request->get('verification_method');

        // Calculate date range
        $endDate = now();
        $startDate = now()->subDays($timePeriod);

        // Get verifications for the period
        $verifications = VerificationRecord::with(['mrvDeclaration.farmProfile.user', 'mrvDeclaration.farmProfile'])
            ->where('verifier_id', $verifier->id)
            ->whereBetween('verification_date', [$startDate, $endDate])
            ->get();

        // Apply additional filters
        if ($region) {
            $verifications = $verifications->filter(function ($v) use ($region) {
                return str_contains(strtolower($v->mrvDeclaration->farmProfile->user->address ?? ''), strtolower($region));
            });
        }

        // Calculate summary metrics
        $totalVerifications = $verifications->count();
        $approvedCount = $verifications->where('verification_status', 'approved')->count();
        $performanceScore = $totalVerifications > 0 ? ($approvedCount / $totalVerifications) * 100 : 0;

        // Calculate efficiency rate (simplified)
        $efficiencyRate = 85; // Placeholder

        // Determine risk level
        $riskLevel = 'Low'; // Placeholder

        // Calculate carbon impact
        $carbonImpact = $verifications->sum(function ($v) {
            return $v->mrvDeclaration->estimated_carbon_credits ?? 0;
        });

        // Generate performance trends (last 7 days)
        $trendLabels = [];
        $trendValues = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $trendLabels[] = $date->format('M d');
            $trendValues[] = $verifications->where('verification_date', $date->format('Y-m-d'))->count();
        }

        // Generate risk matrix data
        $riskMatrix = [
            'low_risk' => [],
            'medium_risk' => [],
            'high_risk' => []
        ];

        // Regional performance
        $regionalPerformance = [
            'north' => 75,
            'central' => 82,
            'south' => 78
        ];

        // Carbon distribution
        $carbonDistribution = [
            'small_farms' => 25,
            'medium_farms' => 45,
            'large_farms' => 30
        ];

        // Forecast data
        $forecast = [
            'labels' => $trendLabels,
            'historical' => $trendValues,
            'predicted' => array_map(function ($val) {
                return $val + rand(-2, 2);
            }, $trendValues)
        ];

        // Benchmarks
        $benchmarks = [
            [
                'metric' => 'Verification Accuracy',
                'your_performance' => $performanceScore,
                'industry_average' => 78,
                'top_performers' => 95,
                'recommendations' => 'Focus on evidence quality review'
            ],
            [
                'metric' => 'Processing Speed',
                'your_performance' => $efficiencyRate,
                'industry_average' => 72,
                'top_performers' => 88,
                'recommendations' => 'Optimize field visit scheduling'
            ]
        ];

        return $this->success([
            'summary' => [
                'performance_score' => round($performanceScore, 1),
                'efficiency_rate' => $efficiencyRate,
                'risk_level' => $riskLevel,
                'carbon_impact' => round($carbonImpact, 1)
            ],
            'performance_trends' => [
                'labels' => $trendLabels,
                'values' => $trendValues
            ],
            'risk_matrix' => $riskMatrix,
            'regional_performance' => $regionalPerformance,
            'carbon_distribution' => $carbonDistribution,
            'forecast' => $forecast,
            'benchmarks' => $benchmarks
        ]);
    }

    public function aiInsights(Request $request)
    {
        $verifier = $request->user();

        // Get recent verifications for AI insights
        $recentVerifications = VerificationRecord::with(['mrvDeclaration'])
            ->where('verifier_id', $verifier->id)
            ->orderBy('verification_date', 'desc')
            ->take(10)
            ->get();

        // Generate AI insights based on verification patterns
        $insights = [];

        if ($recentVerifications->count() > 0) {
            $approvalRate = $recentVerifications->where('verification_status', 'approved')->count() / $recentVerifications->count();

            if ($approvalRate < 0.7) {
                $insights[] = [
                    'title' => 'Low Approval Rate Detected',
                    'description' => 'Your recent verification approval rate is below average. Consider reviewing your verification criteria.',
                    'confidence' => 85
                ];
            }

            $insights[] = [
                'title' => 'Performance Optimization',
                'description' => 'Based on your verification patterns, consider using hybrid verification methods for better efficiency.',
                'confidence' => 78
            ];

            $insights[] = [
                'title' => 'Risk Assessment',
                'description' => 'Your verification portfolio shows balanced risk distribution across different farm sizes.',
                'confidence' => 92
            ];
        }

        return $this->success(['insights' => $insights]);
    }

    /**
     * Aggregate request detail for web view (session auth):
     * - declaration
     * - farmer (user)
     * - farmProfile
     * - evidenceFiles
     * - aiResults
     */
    public function requestDetail(Request $request, int $id)
    {
        $declaration = MrvDeclaration::with(['farmProfile.user','farmProfile'])
            ->findOrFail($id);

        $farmer = optional($declaration->farmProfile)->user;
        $farmProfile = $declaration->farmProfile;
        $evidenceFiles = EvidenceFile::where('mrv_declaration_id', $id)
            ->orderBy('capture_timestamp','desc')->get();
        $aiResults = AiAnalysisResult::whereHas('evidenceFile', function ($q) use ($id) {
                $q->where('mrv_declaration_id', $id);
            })
            ->orderBy('processed_at','desc')->get();

        return $this->success([
            'declaration' => $declaration,
            'farmer' => $farmer,
            'farmProfile' => $farmProfile,
            'evidenceFiles' => $evidenceFiles,
            'aiResults' => $aiResults,
        ]);
    }

    /**
     * VERIFIER ACTIONS - drive MRV workflow transitions
     */
    public function submitDeclaration(Request $request, int $id)
    {
        $declaration = MrvDeclaration::findOrFail($id);
        if ($declaration->status !== 'draft') {
            return $this->error('Only draft declarations can be submitted', 422);
        }
        $declaration->update(['status' => 'submitted']);
        return $this->success($declaration, 'Declaration submitted');
    }

    public function scheduleFieldVisit(Request $request, int $id)
    {
        $request->validate([
            'verification_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $declaration = MrvDeclaration::findOrFail($id);
        if (!in_array($declaration->status, ['submitted'])) {
            return $this->error('Only submitted declarations can be scheduled for visit', 422);
        }

        $record = VerificationRecord::create([
            'mrv_declaration_id' => $declaration->id,
            'verifier_id' => Auth::id(),
            'verification_type' => $request->get('verification_type', 'field'),
            'verification_date' => $request->get('verification_date'),
            'verification_status' => 'pending',
            'field_visit_notes' => $request->get('notes'),
        ]);

        return $this->success($record, 'Field visit scheduled');
    }

    public function requestRevision(Request $request, int $id)
    {
        $request->validate(['comments' => 'required|string']);
        $declaration = MrvDeclaration::findOrFail($id);
        if ($declaration->status !== 'submitted') {
            return $this->error('Only submitted declarations can be marked as requires revision', 422);
        }

        $record = VerificationRecord::create([
            'mrv_declaration_id' => $declaration->id,
            'verifier_id' => Auth::id(),
            'verification_type' => $request->get('verification_type', 'remote'),
            'verification_date' => Carbon::now()->toDateString(),
            'verification_status' => 'requires_revision',
            'verifier_comments' => $request->get('comments'),
        ]);

        return $this->success($record, 'Revision requested');
    }

    public function approveDeclaration(Request $request, int $id)
    {
        $request->validate(['score' => 'nullable|numeric|min:0|max:100']);
        $declaration = MrvDeclaration::findOrFail($id);
        if ($declaration->status !== 'submitted') {
            return $this->error('Only submitted declarations can be approved', 422);
        }

        // Create verification record
        $record = VerificationRecord::create([
            'mrv_declaration_id' => $declaration->id,
            'verifier_id' => Auth::id(),
            'verification_type' => $request->get('verification_type', 'remote'),
            'verification_date' => Carbon::now()->toDateString(),
            'verification_status' => 'approved',
            'verification_score' => $request->get('score', 85),
            'verifier_comments' => $request->get('comments'),
        ]);

        // Move MRV to verified
        $declaration->update(['status' => 'verified']);

        // === Create Carbon Credit using business logic similar to seeder ===
        $declaration->loadMissing('farmProfile');
        $farmProfile = $declaration->farmProfile;

        // Determine credit type based on farm profile ratios
        $creditType = 'mixed_farming';
        if ($farmProfile && $farmProfile->total_area_hectares > 0) {
            $riceRatio = ($farmProfile->rice_area_hectares ?? 0) / $farmProfile->total_area_hectares;
            $agroRatio = ($farmProfile->agroforestry_area_hectares ?? 0) / $farmProfile->total_area_hectares;
            if ($riceRatio > 0.7) {
                $creditType = 'rice_cultivation';
            } elseif ($agroRatio > 0.5) {
                $creditType = 'agroforestry';
            }
        }

        // Determine credit status distribution: 75% issued, 20% sold, 4% retired, 1% cancelled
        $rand = rand(1, 100);
        if ($rand <= 75) {
            $creditStatus = 'issued';
        } elseif ($rand <= 95) {
            $creditStatus = 'sold';
        } elseif ($rand <= 99) {
            $creditStatus = 'retired';
        } else {
            $creditStatus = 'cancelled';
        }

        // Amount scales with verification score
        $baseAmount = (float) ($declaration->estimated_carbon_credits ?? 0);
        $verificationMultiplier = max(0, min(1, ((float) $record->verification_score) / 100));
        $finalAmount = round($baseAmount * $verificationMultiplier, 2);

        // Base price by type
        $basePrices = [
            'rice_cultivation' => 15,
            'agroforestry' => 25,
            'mixed_farming' => 20,
        ];
        $pricePerCredit = $basePrices[$creditType] ?? 18;

        $carbonCredit = CarbonCredit::create([
            'mrv_declaration_id' => $declaration->id,
            'verification_record_id' => $record->id,
            'credit_amount' => $finalAmount,
            'credit_type' => $creditType,
            'vintage_year' => (int) date('Y'),
            'certification_standard' => $creditType === 'agroforestry' ? 'VCS' : ($creditType === 'mixed_farming' ? 'CAR' : 'Gold Standard'),
            'serial_number' => 'CC-' . date('Y') . '-' . strtoupper(substr(sha1($declaration->id . '|' . $record->id . '|' . microtime(true)), 0, 8)),
            'status' => $creditStatus,
            'price_per_credit' => $pricePerCredit,
            'issued_date' => Carbon::now()->toDateString(),
            'expiry_date' => Carbon::now()->addYears(10)->toDateString(),
        ]);

        // If credit is sold, immediately create a transaction record (assign a buyer)
        $transaction = null;
        if ($carbonCredit->status === 'sold' && $carbonCredit->credit_amount > 0) {
            $buyerId = \App\Models\User::where('user_type', 'buyer')->inRandomOrder()->value('id');
            $sellerId = optional($farmProfile)->user_id;

            if ($buyerId && $sellerId) {
                $quantity = min($carbonCredit->credit_amount, 10); // simple cap for immediate sale
                $transaction = CarbonTransaction::create([
                    'carbon_credit_id' => $carbonCredit->id,
                    'seller_id' => $sellerId,
                    'buyer_id' => $buyerId,
                    'quantity' => $quantity,
                    'price_per_credit' => $carbonCredit->price_per_credit,
                    'total_amount' => round($quantity * $carbonCredit->price_per_credit, 2),
                    'transaction_date' => Carbon::now()->toDateString(),
                    'payment_status' => 'completed',
                    'transaction_hash' => '0x' . substr(md5('transaction|' . $carbonCredit->id . '|' . microtime(true)), 0, 40),
                ]);
            } else {
                // No buyer or seller available; keep credit as issued instead of sold
                $carbonCredit->update(['status' => 'issued']);
            }
        }

        return $this->success([
            'declaration' => $declaration,
            'verification' => $record,
            'carbon_credit' => isset($carbonCredit) ? $carbonCredit : null,
            'transaction' => $transaction,
        ], 'Declaration approved & verified');
    }

    public function rejectDeclaration(Request $request, int $id)
    {
        $request->validate(['reason' => 'required|string']);
        $declaration = MrvDeclaration::findOrFail($id);
        if (!in_array($declaration->status, ['submitted', 'draft'])) {
            return $this->error('Only draft/submitted declarations can be rejected', 422);
        }

        $record = VerificationRecord::create([
            'mrv_declaration_id' => $declaration->id,
            'verifier_id' => Auth::id(),
            'verification_type' => $request->get('verification_type', 'remote'),
            'verification_date' => Carbon::now()->toDateString(),
            'verification_status' => 'rejected',
            'verifier_comments' => $request->get('reason'),
        ]);

        $declaration->update(['status' => 'rejected']);

        return $this->success([
            'declaration' => $declaration,
            'verification' => $record,
        ], 'Declaration rejected');
    }
}
