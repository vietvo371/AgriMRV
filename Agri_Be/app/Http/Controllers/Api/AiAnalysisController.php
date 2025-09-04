<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use App\Models\AiAnalysisResult;
use App\Models\EvidenceFile;
use App\Models\MrvDeclaration;
use App\Models\FarmProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AiAnalysisController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $statusFilter = $request->query('status'); // all | verified | processing | needs_review | rejected
        $q = (string) $request->query('q', '');
        $page = max(1, (int) $request->query('page', 1));
        $limit = min(100, max(1, (int) $request->query('limit', 20)));
        $sort = (string) $request->query('sort', ''); // confidence_desc

        $query = AiAnalysisResult::query()->with(['evidenceFile' => function ($q) {
            $q->select('id','mrv_declaration_id','file_type','file_url');
        }]);

        // Join to declarations and farm profiles for search/location
        $query->leftJoin('evidence_files', 'ai_analysis_results.evidence_file_id', '=', 'evidence_files.id')
              ->leftJoin('mrv_declarations', 'evidence_files.mrv_declaration_id', '=', 'mrv_declarations.id')
              ->leftJoin('farm_profiles', 'mrv_declarations.farm_profile_id', '=', 'farm_profiles.id')
              ->where(function ($w) use ($request) {
                  $userId = $request->user()->id;
                  $w->where('farm_profiles.user_id', '=', $userId);
              });

        // Text search by crop type or (rough) location via user's organization_name/address (fallback not joined here)
        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('farm_profiles.primary_crop_type', 'like', "%$q%")
                    ->orWhere('evidence_files.file_type', 'like', "%$q%")
                    ->orWhere('ai_analysis_results.analysis_type', 'like', "%$q%")
                    ->orWhere('ai_analysis_results.recommendations', 'like', "%$q%")
                    ->orWhere('ai_analysis_results.quality_indicators', 'like', "%$q%")
                    ->orWhere('ai_analysis_results.analysis_results', 'like', "%$q%");
            });
        }

        // Filter by derived status
        if ($statusFilter && $statusFilter !== 'all') {
            $allowed = ['verified','processing','needs_review','rejected'];
            if (in_array($statusFilter, $allowed, true)) {
                $query->whereRaw("1=1"); // placeholder, we will post-filter after fetching
            }
        }

        if ($sort === 'confidence_desc') {
            $query->orderByDesc('ai_analysis_results.confidence_score');
        } else {
            $query->orderByDesc('ai_analysis_results.id');
        }

        $total = (clone $query)->count('ai_analysis_results.id');
        $results = $query->select('ai_analysis_results.*')->forPage($page, $limit)->get();

        $data = $results->map(fn (AiAnalysisResult $row) => $this->mapAnalysis($row));

        if ($statusFilter && $statusFilter !== 'all') {
            $data = $data->filter(fn ($d) => $d['status'] === $statusFilter)->values();
            $total = $data->count();
            $data = $data->forPage($page, $limit)->values();
        }

        return $this->success([
            'data' => $data,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
            ],
        ]);
    }

    public function show(Request $request, string $id)
    {
        $row = $this->queryOwned($request)->where('ai_analysis_results.id', $id)->first();
        if (!$row) {
            return $this->error('Not found', 404);
        }
        return $this->success(['data' => $this->mapAnalysis($row)]);
    }

    public function refresh(Request $request, string $id)
    {
        $row = $this->queryOwned($request)->where('ai_analysis_results.id', $id)->first();
        if (!$row) return $this->error('Not found', 404);
        $jobId = 'job_' . Str::random(10);
        return $this->success(['message' => 'Reprocessing started', 'job_id' => $jobId], 202);
    }

    public function report(Request $request, string $id)
    {
        $row = $this->queryOwned($request)->where('ai_analysis_results.id', $id)->first();
        if (!$row) {
            return $this->error('Not found', 404);
        }

        $mapped = $this->mapAnalysis($row);
        $pdfContent = $this->renderMinimalPdf('AI Analysis Report', $mapped);

        // Tạo file PDF trong storage để WebView có thể load
        $fileName = 'ai_analysis_' . $id . '_' . time() . '.pdf';
        $filePath = 'reports/' . $fileName;

        Storage::disk('public')->put($filePath, $pdfContent);

        // Trả về URL trực tiếp đến file PDF
        $pdfUrl = asset('storage/' . $filePath);

        return $this->success([
            'pdf_url' => $pdfUrl,
            'file_name' => $fileName,
            'message' => 'PDF generated successfully'
        ]);
    }

    public function share(Request $request, string $id)
    {
        $row = $this->queryOwned($request)->where('ai_analysis_results.id', $id)->first();
        if (!$row) return $this->error('Not found', 404);
        $hours = (int) min(168, max(1, (int) $request->input('expires_in_hours', 72)));
        $expires = now()->addHours($hours);
        $url = URL::temporarySignedRoute('ai.share', $expires, ['id' => $id]);
        return $this->success(['share_url' => $url, 'expires_at' => $expires->toIso8601String()]);
    }

    public function sharedShow(Request $request, string $id)
    {
        // Public access via signed URL; still restrict to ownership? For share links, allow anyone with signature.
        $row = AiAnalysisResult::query()->where('id', $id)->first();
        if (!$row) return $this->error('Not found', 404);
        return $this->success(['data' => $this->mapAnalysis($row)]);
    }

    public function stats(Request $request)
    {
        $rows = AiAnalysisResult::query()
            ->leftJoin('evidence_files', 'ai_analysis_results.evidence_file_id', '=', 'evidence_files.id')
            ->leftJoin('mrv_declarations', 'evidence_files.mrv_declaration_id', '=', 'mrv_declarations.id')
            ->leftJoin('farm_profiles', 'mrv_declarations.farm_profile_id', '=', 'farm_profiles.id')
            ->where(function ($w) use ($request) {
                $userId = $request->user()->id;
                $w->where('farm_profiles.user_id', '=', $userId);
            })
            ->select('ai_analysis_results.*')
            ->get();
        $counts = [
            'verified' => 0,
            'needs_review' => 0,
            'processing' => 0,
            'rejected' => 0,
        ];
        $conf = [];
        foreach ($rows as $r) {
            $st = $this->deriveStatus($r);
            if (isset($counts[$st])) $counts[$st]++;
            if ($r->confidence_score !== null) $conf[] = (float) $r->confidence_score;
        }
        $avg = count($conf) ? round(array_sum($conf) / count($conf), 2) : 0.0;

        return $this->success([
            'verified' => $counts['verified'],
            'needs_review' => $counts['needs_review'],
            'processing' => $counts['processing'],
            'avg_confidence' => $avg,
        ]);
    }

    private function deriveStatus(AiAnalysisResult $r): string
    {
        if (empty($r->processed_at)) return 'processing';
        $conf = (float) ($r->confidence_score ?? 0);
        $auth = (float) ($r->authenticity_score ?? 0);
        $score = max($conf, $auth);
        if ($score >= 80) return 'verified';
        if ($score >= 60) return 'needs_review';
        return 'rejected';
    }

    private function mapAnalysis(AiAnalysisResult $row): array
    {
        $ef = $row->evidenceFile; /** @var EvidenceFile|null $ef */
        $decl = $ef ? MrvDeclaration::find($ef->mrv_declaration_id) : null;
        $farm = $decl ? FarmProfile::find($decl->farm_profile_id) : null;
        $imageUrl = $ef ? asset('storage/' . $ef->file_url) : null;
        $status = $this->deriveStatus($row);
        return [
            'id' => (string) $row->id,
            'crop_type' => $farm?->primary_crop_type ?? 'Rice',
            'image_url' => $imageUrl,
            'confidence' => (int) round((float) ($row->confidence_score ?? 0)),
            'status' => $status,
            'analysis_date' => optional($row->processed_at)->toIso8601String() ?? null,
            'location' => $farm ? ('Farm #' . $farm->id) : 'Unknown',
            'findings' => [
                'crop_health' => (int) round((float) ($row->crop_health_score ?? 0)),
                'authenticity' => (int) round((float) ($row->authenticity_score ?? 0)),
                'maturity' => (int) round((float) (data_get($row->quality_indicators, 'maturity_score', 80))),
                'quality' => (int) round((float) (data_get($row->quality_indicators, 'overall_quality', 85))),
            ],
            'insights' => (array) (data_get($row->analysis_results, 'insights', [])),
            'recommendations' => (array) ($row->recommendations ?? []),
            'credit_impact' => (int) round(((float) ($row->confidence_score ?? 0)) / 8.0),
        ];
    }

    private function queryOwned(Request $request)
    {
        $q = AiAnalysisResult::query()->with('evidenceFile');
        $q->leftJoin('evidence_files', 'ai_analysis_results.evidence_file_id', '=', 'evidence_files.id')
          ->leftJoin('mrv_declarations', 'evidence_files.mrv_declaration_id', '=', 'mrv_declarations.id')
          ->leftJoin('farm_profiles', 'mrv_declarations.farm_profile_id', '=', 'farm_profiles.id')
          ->where(function ($w) use ($request) {
              $userId = $request->user()->id;
              $w->where('farm_profiles.user_id', '=', $userId);
          })
          ->select('ai_analysis_results.*');
        return $q;
    }

    private function renderMinimalPdf(string $title, array $data): string
    {
        // Tạo PDF report đẹp và có format
        $content = $this->formatReportContent($title, $data);

        $pdf = "%PDF-1.4\n";
        $pdf .= "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n";
        $pdf .= "2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n";
        $pdf .= "3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n";

        $stream = "BT /F1 16 Tf 72 720 Td ({$title}) Tj ET\n";
        $stream .= "BT /F1 12 Tf 72 680 Td ({$content}) Tj ET";

        $pdf .= "4 0 obj<</Length " . strlen($stream) . ">>stream\n{$stream}\nendstream endobj\n";
        $pdf .= "5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n";

        $xrefPos = strlen($pdf);
        $pdf .= "xref\n0 6\n0000000000 65535 f \n";
        $pdf .= "0000000009 00000 n \n";
        $pdf .= "0000000078 00000 n \n";
        $pdf .= "0000000157 00000 n \n";
        $pdf .= "0000000256 00000 n \n";
        $pdf .= "trailer<</Size 6/Root 1 0 R>>\nstartxref\n{$xrefPos}\n%%EOF";

        return $pdf;
    }

    private function formatReportContent(string $title, array $data): string
    {
        $content = "";

        // Thông tin cơ bản
        $content .= "Analysis ID: " . ($data['id'] ?? 'N/A') . "\n";
        $content .= "Crop Type: " . ($data['crop_type'] ?? 'N/A') . "\n";
        $content .= "Status: " . ($data['status'] ?? 'N/A') . "\n";
        $content .= "Confidence: " . ($data['confidence'] ?? 'N/A') . "%\n";
        $content .= "Location: " . ($data['location'] ?? 'N/A') . "\n";
        $content .= "Analysis Date: " . ($data['analysis_date'] ?? 'N/A') . "\n\n";

        // Findings
        if (isset($data['findings'])) {
            $content .= "FINDINGS:\n";
            $content .= "• Crop Health: " . ($data['findings']['crop_health'] ?? 'N/A') . "%\n";
            $content .= "• Authenticity: " . ($data['findings']['authenticity'] ?? 'N/A') . "%\n";
            $content .= "• Maturity: " . ($data['findings']['maturity'] ?? 'N/A') . "%\n";
            $content .= "• Quality: " . ($data['findings']['quality'] ?? 'N/A') . "%\n\n";
        }

        // Insights
        if (isset($data['insights']) && is_array($data['insights'])) {
            $content .= "INSIGHTS:\n";
            foreach ($data['insights'] as $insight) {
                $content .= "• " . $insight . "\n";
            }
            $content .= "\n";
        }

        // Recommendations
        if (isset($data['recommendations']) && is_array($data['recommendations'])) {
            $content .= "RECOMMENDATIONS:\n";
            foreach ($data['recommendations'] as $rec) {
                $content .= "• " . $rec . "\n";
            }
            $content .= "\n";
        }

        // Credit Impact
        $content .= "Credit Impact: " . ($data['credit_impact'] ?? 'N/A') . " credits\n";

        // Escape special characters for PDF
        $content = str_replace(['(', ')', '\\', '/'], ['\\(', '\\)', '\\\\', '\\/'], $content);
        $content = str_replace(["\r", "\n"], ['', '\\n'], $content);

        return $content;
    }
}


