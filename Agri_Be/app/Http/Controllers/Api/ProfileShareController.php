<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProfileShare;
use App\Models\User;
use App\Models\FarmProfile;
use App\Models\MrvDeclaration;
use App\Models\EvidenceFile;
use App\Models\PlotBoundary;
use App\Models\BlockchainAnchor;
use App\Models\CarbonCredit;
use App\Models\VerificationRecord;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ProfileShareController extends Controller
{
    use ApiResponseTrait;

    /**
     * Tạo share code mới
     */
    public function generateShareCode(Request $request)
    {
        $user = $request->user();

        // Xóa share code cũ nếu có
        ProfileShare::where('user_id', $user->id)
            ->where('expires_at', '<=', now())
            ->delete();

        // Tạo share code mới
        $shareCode = ProfileShare::generateShareCode();
        $expiresAt = now()->addDays(30); // Hết hạn sau 30 ngày

        $profileShare = ProfileShare::create([
            'share_code' => $shareCode,
            'user_id' => $user->id,
            'expires_at' => $expiresAt,
            'is_active' => true
        ]);

        return $this->success([
            'share_code' => $shareCode,
            'expires_at' => $expiresAt->toISOString(),
            'profile_url' => config('app.url') . '/share/' . $shareCode
        ], 'Share code generated successfully');
    }

    /**
     * Lấy thông tin profile qua share code
     */
    public function getSharedProfile(string $shareCode)
    {
        // Tìm profile share
        $profileShare = ProfileShare::where('share_code', $shareCode)
            ->active()
            ->with('user.farmProfile')
            ->first();

        if (!$profileShare) {
            return $this->error('Share code không hợp lệ hoặc đã hết hạn', 404);
        }

        // Tăng view count
        $profileShare->incrementViewCount();

        $user = $profileShare->user;
        $farmProfile = $user->farmProfile;

        // Tính carbon grade
        $carbonGrade = $this->calculateCarbonGrade($user->id);

        // Tính farm stats (không sử dụng vì đã tính trực tiếp)
        // $farmStats = $this->calculateFarmStats($user->id);

        // Tính credit score
        $creditScore = $this->calculateCreditScore($user->id);

        return $this->success([
            'farmer' => [
                'id' => $user->id,
                'name' => $user->full_name,
                'carbon_grade' => $carbonGrade,
                'location' => $this->getLocationFromCoordinates([
                    'latitude' => $user->gps_latitude,
                    'longitude' => $user->gps_longitude
                ]),
                'mrv_verified' => $this->isMrvVerified($user->id)
            ],
            'farm_stats' => [
                'total_area' => round($farmProfile->total_area_hectares ?? 0, 2),
                'carbon_credits_earned' => $this->getCarbonCreditsEarned($user->id),
                'verification_rate' => $this->calculateVerificationRate($user->id)
            ],
            'credit_score' => $creditScore,
            'share_expires_at' => $profileShare->expires_at->toISOString()
        ], 'Profile data retrieved successfully');
    }

    /**
     * Lấy credit data cho banker (public endpoint)
     */
    public function getCreditData(string $shareCode)
    {
        $profileShare = ProfileShare::where('share_code', $shareCode)
            ->active()
            ->first();

        if (!$profileShare) {
            return $this->error('Share code không hợp lệ hoặc đã hết hạn', 404);
        }

        $user = $profileShare->user;
        $farmProfile = FarmProfile::where('user_id', $user->id)->first();

        if (!$farmProfile) {
            return $this->error('Không tìm thấy farm profile', 404);
        }

        // Tính toán credit data
        $creditScore = $this->calculateCreditScore($user->id);
        $carbonPerformance = $this->calculateCarbonPerformance($user->id);
        $mrvReliability = $this->calculateMRVReliability($user->id);
        $carbonReduction = $this->calculateCarbonReduction($user->id);

        // Lấy MRV data
        $farmProfileId = $farmProfile->id;
        $declarationsQuery = MrvDeclaration::where('farm_profile_id', $farmProfileId);
        $totalDeclarations = (clone $declarationsQuery)->count();
        $verifiedDeclarations = (clone $declarationsQuery)
            ->where('status', 'verified')
            ->count();
        $completionRate = $totalDeclarations > 0 ? ($verifiedDeclarations / $totalDeclarations) * 100 : 0;

        // Lấy evidence count
        $evidenceCount = EvidenceFile::whereHas('mrvDeclaration', function($q) use ($farmProfileId) {
            $q->where('farm_profile_id', $farmProfileId);
        })->count();

        // Tính total trees
        $plots = PlotBoundary::where('farm_profile_id', $farmProfileId)->get();
        $totalTrees = $plots->sum(function($plot) {
            if ($plot->plot_type === 'agroforestry') {
                return ($plot->area_hectares * 200); // 200 cây/ha
            }
            return 0;
        });

        // Transparency: Blockchain anchors and verification summary
        $declarationIds = (clone $declarationsQuery)->pluck('id');
        $verificationIds = VerificationRecord::whereIn('mrv_declaration_id', $declarationIds)->pluck('id');
        $creditIds = CarbonCredit::whereIn('mrv_declaration_id', $declarationIds)
            ->orWhereIn('verification_record_id', $verificationIds)
            ->pluck('id');

        $anchors = BlockchainAnchor::where(function($q) use ($declarationIds, $verificationIds, $creditIds) {
                $q->where(function($q1) use ($declarationIds) {
                        $q1->where('record_type', 'mrv_declaration')
                            ->whereIn('record_id', $declarationIds);
                    })
                  ->orWhere(function($q2) use ($verificationIds) {
                        $q2->where('record_type', 'verification_record')
                            ->whereIn('record_id', $verificationIds);
                    })
                  ->orWhere(function($q3) use ($creditIds) {
                        $q3->where('record_type', 'carbon_credit')
                            ->whereIn('record_id', $creditIds);
                    });
            })
            ->orderByDesc('anchor_timestamp')
            ->limit(5)
            ->get()
            ->map(function ($a) {
                return [
                    'record_type' => $a->record_type,
                    'record_id' => $a->record_id,
                    'network' => $a->blockchain_network,
                    'transaction_hash' => $a->transaction_hash,
                    'block_number' => $a->block_number,
                    'gas_used' => $a->gas_used,
                    'anchor_timestamp' => optional($a->anchor_timestamp)->toISOString(),
                    'verification_url' => $a->verification_url,
                ];
            });

        // Verification summary
        $lastVerification = VerificationRecord::whereIn('mrv_declaration_id', $declarationIds)
            ->orderByDesc('verification_date')
            ->with('verifier')
            ->first();

        // Credits summary
        $issuedCreditsQuery = CarbonCredit::whereIn('mrv_declaration_id', $declarationIds)
            ->where('status', 'issued');
        $totalIssuedCredits = (clone $issuedCreditsQuery)->sum('credit_amount');
        $issuedCount = (clone $issuedCreditsQuery)->count();
        $lastIssued = (clone $issuedCreditsQuery)->orderByDesc('issued_date')->first();
        $standards = (clone $issuedCreditsQuery)->select('certification_standard')->distinct()->pluck('certification_standard')->filter()->values();

        return $this->success([
            'credit_data' => [
                'credit_score' => $creditScore,
                'carbon_performance' => $carbonPerformance,
                'mrv_reliability' => $mrvReliability,
                'carbon_reduction' => $carbonReduction,
                'farm_profile' => [
                    'total_area' => $farmProfile->total_area_hectares,
                    'rice_area' => $farmProfile->rice_area_hectares,
                    'agroforestry_area' => $farmProfile->agroforestry_area_hectares,
                ]
            ],
            'mrv_data' => [
                'total_declarations' => $totalDeclarations,
                'verified_declarations' => $verifiedDeclarations,
                'evidence_count' => $evidenceCount,
                'completion_rate' => $completionRate,
                'total_trees' => $totalTrees
            ],
            'transparency' => [
                'blockchain_anchors' => $anchors,
                'last_verification' => $lastVerification ? [
                    'date' => optional($lastVerification->verification_date)->toDateString(),
                    'status' => $lastVerification->verification_status,
                    'score' => $lastVerification->verification_score,
                    'verifier_name' => optional($lastVerification->verifier)->full_name,
                ] : null,
            ],
            'credits_summary' => [
                'total_issued' => (float) $totalIssuedCredits,
                'issued_count' => $issuedCount,
                'last_issued_date' => optional(optional($lastIssued)->issued_date)->toDateString(),
                'standards' => $standards,
            ]
        ], 'Credit data retrieved successfully');
    }

    /**
     * Copy share link (tăng view count)
     */
    public function copyShareLink(string $shareCode)
    {
        $profileShare = ProfileShare::where('share_code', $shareCode)
            ->active()
            ->first();

        if (!$profileShare) {
            return $this->error('Share code không hợp lệ hoặc đã hết hạn', 404);
        }

        // Tăng view count
        $profileShare->incrementViewCount();

        return $this->success([
            'share_url' => config('app.url') . '/share/' . $shareCode
        ], 'Share link copied to clipboard');
    }

    /**
     * Lấy danh sách share codes của user
     */
    public function getMyShares(Request $request)
    {
        $user = $request->user();

        $shares = ProfileShare::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($share) {
                return [
                    'share_code' => $share->share_code,
                    'created_at' => $share->created_at->toISOString(),
                    'expires_at' => $share->expires_at->toISOString(),
                    'is_active' => $share->is_active && !$share->isExpired(),
                    'view_count' => $share->view_count,
                    'last_viewed_at' => $share->last_viewed_at?->toISOString(),
                    'share_url' => config('app.url') . '/share/' . $share->share_code
                ];
            });

        return $this->success([
            'shares' => $shares
        ], 'My shares retrieved successfully');
    }

    /**
     * Deactivate share code
     */
    public function deactivateShare(Request $request, string $shareCode)
    {
        $user = $request->user();

        $profileShare = ProfileShare::where('share_code', $shareCode)
            ->where('user_id', $user->id)
            ->first();

        if (!$profileShare) {
            return $this->error('Share code không tồn tại', 404);
        }

        $profileShare->update(['is_active' => false]);

        return $this->success([
            'message' => 'Share code deactivated successfully'
        ]);
    }

    /**
     * Helper methods
     */
    private function calculateCarbonGrade(int $userId): string
    {
        $farmProfile = \App\Models\FarmProfile::where('user_id', $userId)->first();
        if (!$farmProfile) {
            return 'N/A';
        }

        // Lấy MRV declarations đã verified
        $declarations = \App\Models\MrvDeclaration::where('farm_profile_id', $farmProfile->id)
            ->where('status', 'verified')
            ->get();

        if ($declarations->isEmpty()) {
            return 'N/A';
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
        return 'D';
    }

    private function calculateFarmStats(int $userId): array
    {
        $farmProfile = \App\Models\FarmProfile::where('user_id', $userId)->first();

        if (!$farmProfile) {
            return [
                'total_area' => 0,
                'carbon_credits_earned' => 0,
                'verification_rate' => 0
            ];
        }

        $totalArea = $farmProfile->total_area_hectares;

        $carbonCreditsEarned = \App\Models\CarbonCredit::whereHas('mrvDeclaration', function($q) use ($farmProfile) {
            $q->where('farm_profile_id', $farmProfile->id);
        })->where('status', 'issued')->sum('credit_amount');

        $verificationRate = $this->calculateVerificationRate($userId);

        return [
            'total_area' => round($totalArea, 2),
            'carbon_credits_earned' => round($carbonCreditsEarned, 2),
            'verification_rate' => round($verificationRate, 2)
        ];
    }

    private function calculateCreditScore(int $userId): int
    {
        // Tính credit score dựa trên các metrics
        $farmProfile = \App\Models\FarmProfile::where('user_id', $userId)->first();

        if (!$farmProfile) {
            return 0;
        }

        $baseScore = 500;

        // Cộng điểm cho area
        $areaScore = min(100, $farmProfile->total_area_hectares * 20);

        // Cộng điểm cho carbon credits
        $carbonCredits = \App\Models\CarbonCredit::whereHas('mrvDeclaration', function($q) use ($farmProfile) {
            $q->where('farm_profile_id', $farmProfile->id);
        })->where('status', 'issued')->sum('credit_amount');
        $carbonScore = min(100, $carbonCredits * 2);

        // Cộng điểm cho verification rate
        $verificationRate = $this->calculateVerificationRate($userId);
        $verificationScore = $verificationRate;

        $totalScore = $baseScore + $areaScore + $carbonScore + $verificationScore;

        return min(1000, max(0, round($totalScore)));
    }

    private function getCarbonCreditsEarned(int $userId): float
    {
        $farmProfile = \App\Models\FarmProfile::where('user_id', $userId)->first();
        if (!$farmProfile) {
            return 0;
        }

        return \App\Models\CarbonCredit::whereHas('mrvDeclaration', function($q) use ($farmProfile) {
            $q->where('farm_profile_id', $farmProfile->id);
        })->where('status', 'issued')->sum('credit_amount');
    }

    private function calculateVerificationRate(int $userId): float
    {
        $farmProfile = \App\Models\FarmProfile::where('user_id', $userId)->first();
        if (!$farmProfile) {
            return 0;
        }

        $total = \App\Models\MrvDeclaration::where('farm_profile_id', $farmProfile->id)->count();
        $verified = \App\Models\MrvDeclaration::where('farm_profile_id', $farmProfile->id)
            ->where('status', 'verified')
            ->count();

        return $total > 0 ? ($verified / $total) * 100 : 0;
    }

    private function isMrvVerified(int $userId): bool
    {
        $farmProfile = \App\Models\FarmProfile::where('user_id', $userId)->first();
        if (!$farmProfile) {
            return false;
        }

        return \App\Models\MrvDeclaration::where('farm_profile_id', $farmProfile->id)
            ->where('status', 'verified')
            ->exists();
    }

    // --- Added lightweight scoring helpers for public credit-data ---
    private function calculateCarbonPerformance(int $userId): float
    {
        $farmProfile = \App\Models\FarmProfile::where('user_id', $userId)->first();
        if (!$farmProfile) return 0.0;
        $avg = \App\Models\MrvDeclaration::where('farm_profile_id', $farmProfile->id)
            ->avg('carbon_performance_score');
        return round((float) ($avg ?? 0), 2);
    }

    private function calculateMRVReliability(int $userId): float
    {
        $farmProfile = \App\Models\FarmProfile::where('user_id', $userId)->first();
        if (!$farmProfile) return 0.0;
        $avg = \App\Models\MrvDeclaration::where('farm_profile_id', $farmProfile->id)
            ->avg('mrv_reliability_score');
        return round((float) ($avg ?? 0), 2);
    }

    private function calculateCarbonReduction(int $userId): float
    {
        $farmProfile = \App\Models\FarmProfile::where('user_id', $userId)->first();
        if (!$farmProfile) return 0.0;
        // Proxy by estimated_carbon_credits normalized to percentage-like scale (cap 100)
        $sum = (float) \App\Models\MrvDeclaration::where('farm_profile_id', $farmProfile->id)
            ->sum('estimated_carbon_credits');
        $scaled = min(100.0, $sum); // Assuming credits already scaled reasonably in mock/demo
        return round($scaled, 2);
    }
    private function getLocationFromCoordinates(array $coordinates): string
    {
        if (empty($coordinates) || !isset($coordinates['latitude']) || !isset($coordinates['longitude'])) {
            return 'Unknown';
        }

        // Giả lập location từ coordinates
        // Trong thực tế, có thể sử dụng reverse geocoding API
        $lat = $coordinates['latitude'];
        $lng = $coordinates['longitude'];

        if ($lat >= 10.0 && $lat <= 11.0 && $lng >= 105.0 && $lng <= 106.0) {
            return 'Ho Chi Minh City';
        } elseif ($lat >= 10.0 && $lat <= 11.0 && $lng >= 106.0 && $lng <= 107.0) {
            return 'Dong Nai Province';
        } elseif ($lat >= 9.0 && $lat <= 10.0 && $lng >= 105.0 && $lng <= 106.0) {
            return 'Tien Giang Province';
        } elseif ($lat >= 10.0 && $lat <= 11.0 && $lng >= 104.0 && $lng <= 105.0) {
            return 'An Giang Province';
        } elseif ($lat >= 10.0 && $lat <= 11.0 && $lng >= 103.0 && $lng <= 104.0) {
            return 'Dong Thap Province';
        }

        return 'Mekong Delta Region';
    }
}
