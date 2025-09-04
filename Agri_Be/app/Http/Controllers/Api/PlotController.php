<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use App\Models\PlotBoundary;
use App\Models\FarmProfile;
use App\Models\MrvDeclaration;
use App\Models\VerificationRecord;
use App\Models\CarbonCredit;
use App\Models\AiAnalysisResult;
use App\Models\EvidenceFile;
use App\Models\BlockchainAnchor;
use App\Http\Requests\CreatePlotRequest;
use App\Services\AiAnalysisSimulatorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class PlotController extends Controller
{
    use ApiResponseTrait;

    public function mrvOverview(Request $request)
    {
        $totalDeclarations = MrvDeclaration::count();
        $submitted = MrvDeclaration::where('status', 'submitted')->count();
        $withEvidence = MrvDeclaration::has('evidenceFiles')->count();
        $verified = MrvDeclaration::where('status', 'verified')->count();
        $credits = CarbonCredit::count();

        $stages = [
            ['name' => 'Registration & MRV Declaration', 'value' => $totalDeclarations],
            ['name' => 'Evidence Collection', 'value' => $withEvidence],
            ['name' => 'Verification & Scoring', 'value' => $verified],
            ['name' => 'Carbon Credits & Trading', 'value' => $credits],
        ];

        $currentStage = $credits > 0 ? 4 : ($verified > 0 ? 3 : ($withEvidence > 0 ? 2 : ($submitted > 0 ? 1 : 0)));
        $completion = $totalDeclarations > 0 ? round(min(100, (($verified + $credits) / max(1, $totalDeclarations)) * 100), 2) : 0;

        return $this->success([
            'stages' => $stages,
            'current_stage' => $currentStage,
            'completion_percentage' => $completion,
        ]);
    }

    public function summary(Request $request)
    {
        $user = $request->user();
        $farm = FarmProfile::where('user_id', $user->id)->first();
        $latestDecl = $farm ? MrvDeclaration::where('farm_profile_id', $farm->id)->latest('id')->first() : null;

        // Rice group
        $rice = [
            'area' => $farm?->rice_area_hectares !== null ? (float) $farm->rice_area_hectares : 0.0,
            'awdCycle' => $latestDecl?->awd_cycles_per_season,
            'strawManagement' => $latestDecl?->straw_management,
        ];

        // Agroforestry group
        $agro = [
            'area' => $farm?->agroforestry_area_hectares !== null ? (float) $farm->agroforestry_area_hectares : 0.0,
            'treeDensity' => $latestDecl?->tree_density_per_hectare,
            'species' => $latestDecl?->tree_species ?? [],
        ];

        // AI aggregates over user's declarations' evidence
        $declIds = MrvDeclaration::where('user_id', $user->id)->pluck('id');
        $evidenceIds = EvidenceFile::whereIn('mrv_declaration_id', $declIds)->pluck('id');
        $avgAuth = (float) (AiAnalysisResult::whereIn('evidence_file_id', $evidenceIds)->avg('authenticity_score') ?? 0);
        $avgHealth = (float) (AiAnalysisResult::whereIn('evidence_file_id', $evidenceIds)->avg('crop_health_score') ?? 0);
        $practiceMatch = (float) (AiAnalysisResult::whereIn('evidence_file_id', $evidenceIds)->avg('confidence_score') ?? 0);

        $ai = [
            'avgAuthenticity' => round($avgAuth, 2),
            'avgHealth' => round($avgHealth, 2),
            'practiceMatch' => round($practiceMatch, 2),
        ];

        return $this->success([
            'rice' => $rice,
            'agroforestry' => $agro,
            'aiResults' => $ai,
        ]);
    }

    public function landPlots(Request $request)
    {
        $user = $request->user();
        $farm = FarmProfile::where('user_id', $user->id)->first();
        $plots = PlotBoundary::query()
            ->with(['farmProfile'])
            ->latest('id')
            // ->where('farm_profile_id', $farm->id)
            ->get()
            ->map(function (PlotBoundary $plot) {
                $farm = $plot->farmProfile;
                $latestDecl = MrvDeclaration::where('farm_profile_id', $farm->id)->latest('id')->first();
                $status = $latestDecl?->status ?? 'draft';
                $verification = null;
                $verificationDate = null;
                $verificationScore = null;
                if ($latestDecl) {
                    $verification = VerificationRecord::where('mrv_declaration_id', $latestDecl->id)->latest('id')->first();
                    $verificationDate = $verification?->verification_date;
                    $verificationScore = $verification?->verification_score;
                }

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
                    'created_at' => $this->formatIso($plot->created_at),
                    'updated_at' => $this->formatIso($plot->updated_at),
                ];
            });

        return $this->success(['plots' => $plots]);
    }

    public function landPlotDetail(Request $request, PlotBoundary $plot)
    {
        $plot->load('farmProfile');
        $farm = $plot->farmProfile;
        $user = $farm?->user ?: \App\Models\User::find($farm?->user_id);
        $latestDecl = $farm ? MrvDeclaration::where('farm_profile_id', $farm->id)->where('plot_boundary_id', $plot->id)->latest('id')->first() : null;
        $verification = $latestDecl ? VerificationRecord::where('mrv_declaration_id', $latestDecl->id)->latest('id')->first() : null;
        [$cp, $rel, $final] = $this->computeScores($farm, $latestDecl, $verification);

        $evidenceList = [];
        $ai = null;
        if ($latestDecl) {
            $evidence = $latestDecl->evidenceFiles()->latest('id')->get();
            $evidenceIds = $evidence->pluck('id');
            $ai = AiAnalysisResult::whereIn('evidence_file_id', $evidenceIds)->latest('id')->first();
            $evidenceList = $evidence->map(function($e){
                return [
                    'id' => $e->id,
                    'type' => $e->file_type,
                    'url' => asset('storage/' . $e->file_url),
                    'uploadDate' => $this->formatYmd($e->capture_timestamp),
                ];
            })->values();
        }

        $anchor = null;
        if ($latestDecl) {
            $ba = \App\Models\BlockchainAnchor::where('record_type', 'mrv_declaration')
                ->where('record_id', $latestDecl->id)->latest('id')->first();
            if ($ba) {
                $anchor = [
                    'hash' => $ba->transaction_hash,
                    'timestamp' => $this->formatIso($ba->anchor_timestamp),
                    'reportUrl' => $ba->verification_url,
                ];
            }
        }

        $cooperativeName = null;
        if ($user) {
            $member = \App\Models\CooperativeMembership::where('user_id', $user->id)->latest('id')->first();
            if ($member) {
                $coop = \App\Models\User::find($member->cooperative_id);
                $cooperativeName = $coop?->organization_name ?? $coop?->full_name;
            }
        }

        // $statusRaw = $latestDecl?->status ?? 'draft';
        // $status = $statusRaw === 'submitted' ? 'pending' : $statusRaw;
        // if ($statusRaw === 'submitted' && $verification && $verification->verification_status === 'pending') {
        //     $status = 'processing';
        // }

        $detail = [
            'id' => (string) $plot->id,
            'plot_name' => $plot->plot_name ?? ('Plot #'.$plot->id),
            'location' => $user?->address ?? ($farm?->soil_type ?? 'Unknown'),
            'status' => $latestDecl?->status ?? 'draft',
            'mrvData' => [
                'plotBoundaries' => [
                    'coordinates' => $plot->boundary_coordinates ?? [],
                    'verified' => ($verification?->verification_status === 'approved'),
                    'area' => (float) ($farm?->total_area_hectares ?? 0),
                ],
                'ricePractices' => [
                    'area' => $farm?->rice_area_hectares !== null ? (float) $farm->rice_area_hectares : 0.0,
                    'awdCycle' => $latestDecl?->awd_cycles_per_season ?? 'Unknown',
                    'strawManagement' => $latestDecl?->straw_management ?? 'Unknown',
                    'sowingDate' => $this->formatYmd($latestDecl?->rice_sowing_date) ?? '',
                ],
                'agroforestrySystem' => [
                    'area' => $farm?->agroforestry_area_hectares !== null ? (float) $farm->agroforestry_area_hectares : 0.0,
                    'treeDensity' => (float) ($latestDecl?->tree_density_per_hectare ?? 0),
                    'species' => $latestDecl?->tree_species ?? [],
                    'intercropping' => $latestDecl?->intercrop_species ?? [],
                ],
                'evidencePhotos' => $evidenceList,
                'mrvScores' => [
                    'carbonPerformance' => $cp,
                    'mrvReliability' => $rel,
                    'grade' => $this->gradeFromScore($final),
                ],
                'blockchainAnchor' => $anchor ?? [
                    'hash' => '',
                    'timestamp' => '',
                    'reportUrl' => '',
                ],
            ],
            'farmer' => [
                'name' => $user?->full_name ?? 'Unknown',
                'phone' => $user?->phone ?? '',
                'email' => $user?->email ?? '',
                'avatar' => $user?->avatar ?? '',
                'cooperative' => $cooperativeName ?? 'Unknown',
            ],
        ];

        return $this->success($detail);
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

    public function statistics(Request $request)
    {
        $totalPlots = PlotBoundary::count();
        $totalArea = (float) PlotBoundary::sum('area_hectares');
        $latestDeclIds = MrvDeclaration::select(DB::raw('MAX(id) as id'))
            ->groupBy('farm_profile_id')->pluck('id');
        $verifiedPlots = MrvDeclaration::whereIn('id', $latestDeclIds)->where('status', 'verified')->count();
        $pendingPlots = MrvDeclaration::whereIn('id', $latestDeclIds)->where('status', 'submitted')->count();
        $totalCredits = (float) CarbonCredit::sum('credit_amount');
        $totalValue = (float) CarbonCredit::sum(DB::raw('credit_amount * COALESCE(price_per_credit,0)'));

        // Average final score over plots
        $finalScores = PlotBoundary::with('farmProfile')->get()->map(function ($plot) {
            $decl = MrvDeclaration::where('farm_profile_id', $plot->farm_profile_id)->latest('id')->first();
            $ver = $decl ? VerificationRecord::where('mrv_declaration_id', $decl->id)->latest('id')->first() : null;
            [$cp, $rel, $final] = $this->computeScores($plot->farmProfile, $decl, $ver);
            return $final;
        })->filter()->values();
        $avgFinal = $finalScores->count() ? round($finalScores->avg(), 2) : 0.0;

        // Simple monthly progress (last 6 months)
        $monthly = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i)->format('Y-m');
            $plotsAdded = PlotBoundary::whereBetween('created_at', [now()->subMonths($i)->startOfMonth(), now()->subMonths($i)->endOfMonth()])->count();
            $creditsEarned = (float) CarbonCredit::whereBetween('issued_date', [now()->subMonths($i)->startOfMonth(), now()->subMonths($i)->endOfMonth()])->sum('credit_amount');
            $verCompleted = VerificationRecord::whereBetween('verification_date', [now()->subMonths($i)->startOfMonth(), now()->subMonths($i)->endOfMonth()])->count();
            $monthly[] = [
                'month' => $month,
                'plots_added' => $plotsAdded,
                'carbon_credits_earned' => $creditsEarned,
                'verification_completed' => $verCompleted,
            ];
        }

        return $this->success([
            'total_plots' => $totalPlots,
            'total_area' => $totalArea,
            'verified_plots' => $verifiedPlots,
            'pending_plots' => $pendingPlots,
            'total_carbon_credits' => $totalCredits,
            'total_carbon_value' => $totalValue,
            'average_final_score' => $avgFinal,
            'monthly_progress' => $monthly,
        ]);
    }

    public function createPlot(CreatePlotRequest $request)
    {
        try {
            DB::beginTransaction();

            // Tìm hoặc tạo FarmProfile nếu không truyền farm_profile_id
            $farmProfileId = (int) ($request->input('farm_profile_id') ?? 0);
            if (!$farmProfileId) {
                $area = (float) ($request->input('area_hectares') ?? $request->input('total_area') ?? 0);
                $farm = FarmProfile::firstOrCreate(
                    ['user_id' => $request->user()->id],
                    [
                        'total_area_hectares' => $area,
                        'rice_area_hectares' => max(0, $area * 0.6),
                        'agroforestry_area_hectares' => max(0, $area * 0.3),
                        'primary_crop_type' => 'Rice',
                        'farming_experience_years' => 1,
                        'irrigation_type' => 'AWD',
                        'soil_type' => 'Sandy loam',
                    ]
                );
                $farmProfileId = $farm->id;
            }

            // Accept both alias fields from FE
            $plotName = $request->input('plot_name') ?? $request->input('name');
            $area = (float) ($request->input('area_hectares') ?? $request->input('total_area'));

            $plot = PlotBoundary::create([
                'farm_profile_id' => $farmProfileId,
                'plot_name' => (string) $plotName,
                'boundary_coordinates' => $request->input('boundary_coordinates', []),
                'area_hectares' => $area,
                'plot_type' => (string) $request->input('plot_type'),
            ]);

            $cp = $this->calculateCarbonPerformanceForRequest($request);
            $mr = $this->calculateMRVReliabilityForRequest($request);
            $est = $this->calculateEstimatedCreditsForRequest($request);

            $decl = MrvDeclaration::create([
                'plot_boundary_id' => $plot->id,
                'farm_profile_id' => $farmProfileId,
                'declaration_period' => now()->format('Y') . '-Q' . ceil(now()->format('n') / 3),
                'rice_sowing_date' => $request->input('rice_sowing_date'),
                'awd_cycles_per_season' => $request->input('awd_cycles_per_season'),
                'water_management_method' => $request->input('water_management_method'),
                'straw_management' => $request->input('straw_management'),
                'tree_density_per_hectare' => $request->input('tree_density_per_hectare'),
                'tree_species' => $request->input('tree_species', []),
                'intercrop_species' => $request->input('intercrop_species', []),
                'planting_date' => $request->input('planting_date'),
                'carbon_performance_score' => $cp,
                'mrv_reliability_score' => $mr,
                'estimated_carbon_credits' => $est,
                'status' => 'submitted',
            ]);

            if ($request->hasFile('evidence_files')) {
                $ai = new AiAnalysisSimulatorService();
                foreach ($request->file('evidence_files') as $file) {
                    $e = EvidenceFile::create([
                        'mrv_declaration_id' => $decl->id,
                        'file_type' => $this->determineFileTypeFromMime($file->getMimeType()),
                        'file_url' => $file->store('uploads/evidence', 'public'),
                        'file_name' => $file->getClientOriginalName(),
                        'file_size_bytes' => $file->getSize(),
                        'gps_latitude' => $request->input('gps_latitude'),
                        'gps_longitude' => $request->input('gps_longitude'),
                        'capture_timestamp' => now(),
                        'description' => 'Uploaded during land record creation',
                    ]);
                    $ai->simulateAnalysis($e);
                }
            }

            BlockchainAnchor::create([
                'record_type' => 'mrv_declaration',
                'record_id' => $decl->id,
                'blockchain_network' => 'Ethereum',
                'transaction_hash' => '0x' . substr(sha1('decl' . $decl->id), 0, 40),
                'block_number' => 18000000 + $decl->id,
                'gas_used' => 21000 + ($decl->id % 100),
                'anchor_data' => [
                    'declaration_hash' => substr(sha1(json_encode($decl->toArray())), 0, 40),
                    'period' => $decl->declaration_period,
                    'status' => $decl->status,
                ],
                'anchor_timestamp' => now(),
                'verification_url' => 'https://etherscan.io/tx/0x' . substr(sha1('decl' . $decl->id), 0, 40),
            ]);

            DB::commit();

            return $this->success([
                'plot' => $plot,
                'declaration' => $decl,
            ], 'Created', 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->error('Create plot failed: ' . $e->getMessage(), 500);
        }
    }

    private function determineFileTypeFromMime(?string $mime): string
    {
        if (!$mime) return 'field_photo';
        if (str_contains($mime, 'image')) return 'field_photo';
        if (str_contains($mime, 'pdf')) return 'document';
        return 'other';
    }

    private function calculateCarbonPerformanceForRequest(Request $request): float
    {
        $area = (float) $request->input('area_hectares', 0);
        $treeDensity = (int) ($request->input('tree_density_per_hectare') ?? 0);

        $ricePerHa = 0.66; // tCO2e/ha/season
        $riceTarget = 0.8; // target
        $cpRice = $area > 0 ? min(100, ($ricePerHa / $riceTarget) * 100) : 0;

        $agroTarget = 1.5; // tCO2e/ha/year
        $agroPerHa = ($treeDensity * 0.022 * 0.5); // per ha if density provided
        $cpAgro = $area > 0 ? min(100, (($agroPerHa) / $agroTarget) * 100) : 0;

        return round($cpRice * 0.6 + $cpAgro * 0.4, 2);
    }

    private function calculateMRVReliabilityForRequest(Request $request): float
    {
        $score = 50.0;
        if ($request->filled('gps_latitude') && $request->filled('gps_longitude')) $score += 10;
        if ($request->hasFile('evidence_files')) $score += 10;
        if ($request->filled('awd_cycles_per_season')) $score += 5;
        return (float) min(100, $score);
    }

    private function calculateEstimatedCreditsForRequest(Request $request): float
    {
        $area = (float) $request->input('area_hectares', 0);
        $treeDensity = (int) ($request->input('tree_density_per_hectare') ?? 0);
        $riceTotalReduction = 0.66 * $area;
        $agroTotalSequestration = ($treeDensity * $area) * 0.022 * 0.5;
        return round($riceTotalReduction + $agroTotalSequestration, 2);
    }

    public function updatePlot(Request $request, PlotBoundary $plot)
    {
        $validated = $request->validate([
            'name' => ['sometimes','string','max:100'],
            'plot_type' => ['sometimes','string','max:50'],
            'total_area' => ['sometimes','numeric'],
            'boundary_coordinates' => ['nullable','array'],
        ]);

        $plot->update([
            'plot_name' => $validated['name'] ?? $plot->plot_name,
            'boundary_coordinates' => $validated['boundary_coordinates'] ?? $plot->boundary_coordinates,
            'area_hectares' => $validated['total_area'] ?? $plot->area_hectares,
            'plot_type' => $validated['plot_type'] ?? $plot->plot_type,
        ]);

        return $this->success(['plot' => $plot], 'Updated');
    }

    public function deletePlot(Request $request, PlotBoundary $plot)
    {
        $id = (string) $plot->id;
        $plot->delete();
        return $this->success(['message' => 'Deleted', 'deleted_plot_id' => $id]);
    }

        /**
     * Tính toán scores cho Carbon Performance, MRV Reliability và Final Score
     * Dựa trên công thức carbon reduction/sequestration thực tế
     */
    private function computeScores(FarmProfile $farm = null, MrvDeclaration $decl = null, VerificationRecord $ver = null): array
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
            $aiConfidence = (float) (AiAnalysisResult::whereIn('evidence_file_id', $evidenceIds)->max('confidence_score') ?? 0);
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

    private function carbonCreditsSummary(?MrvDeclaration $decl): ?array
    {
        if (!$decl) return null;
        $issued = (float) CarbonCredit::where('mrv_declaration_id', $decl->id)->sum('credit_amount');
        $price = (float) (CarbonCredit::where('mrv_declaration_id', $decl->id)->avg('price_per_credit') ?? 0);
        return [
            'estimated_amount' => $decl->estimated_carbon_credits !== null ? (float) $decl->estimated_carbon_credits : null,
            'issued_amount' => $issued,
            'price_per_credit' => $price,
            'total_value' => round($issued * $price, 2),
        ];
    }
}


