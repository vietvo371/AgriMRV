<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\MrvDeclaration;
use App\Models\VerificationRecord;
use App\Models\EvidenceFile;
use App\Traits\ApiResponseTrait;


class VerifierController extends Controller
{
    use ApiResponseTrait;

    /**
     * Constructor - Kiểm tra authentication và role
     */
    public function __construct()
    {
        // Middleware sẽ được xử lý trong từng method
    }

    /**
     * Hiển thị dashboard verifier
     */
    public function dashboard()
    {
        $verifier = Auth::user();

        // Lấy thống kê tổng quan
        $stats = $this->getDashboardStats($verifier->id);

        return view('page.Verifier.index', compact('stats', 'verifier'));
    }

    /**
     * Hiển thị lịch trình verification
     */
    public function schedule()
    {
        $verifier = Auth::user();

        // Lấy các verification records của verifier này
        $myVerifications = VerificationRecord::with([
            'mrvDeclaration.farmProfile.user:id,full_name,email,address',
            'mrvDeclaration.farmProfile:id,user_id,total_area_hectares,rice_area_hectares,agroforestry_area_hectares,primary_crop_type'
        ])
            ->where('verifier_id', $verifier->id)
            ->orderBy('verification_date', 'desc')
            ->get();

        return view('page.Verifier.Schedule.index', compact('myVerifications', 'verifier'));
    }

    /**
     * Hiển thị danh sách requests cần verification
     */
    public function requests()
    {
        // Danh sách các MRV cần xử lý (draft để submit, submitted để verify)
        $requests = MrvDeclaration::with([
            'farmProfile.user:id,full_name,email,address,phone',
            'farmProfile:id,user_id,total_area_hectares,rice_area_hectares,agroforestry_area_hectares,primary_crop_type',
            'plotBoundary:id,farm_profile_id,plot_name,area_hectares,plot_type'
        ])
            ->whereIn('status', ['draft', 'submitted'])
            ->orderBy('created_at', 'desc')
            ->get();

        $requests->each(function ($item) {
            $item->evidence_files_count = EvidenceFile::where('mrv_declaration_id', $item->id)->count();
        });

        return view('page.Verifier.Request.list', compact('requests'));
    }

    public function requestDetail($id)
    {
        // Trả về trang chi tiết; dữ liệu sẽ được JS tải qua API
        return view('page.Verifier.Request.index');
    }

    /**
     * Hiển thị báo cáo verification
     */
    public function reports()
    {
        $verifier = Auth::user();

        // Lấy tất cả verification records của verifier này
        $allVerifications = VerificationRecord::with([
            'mrvDeclaration.farmProfile.user:id,full_name,email,address',
            'mrvDeclaration.farmProfile:id,user_id,total_area_hectares,rice_area_hectares,agroforestry_area_hectares,primary_crop_type',
            'mrvDeclaration.plotBoundary:id,farm_profile_id,plot_name,area_hectares,plot_type'
        ])
            ->where('verifier_id', $verifier->id)
            ->orderBy('verification_date', 'desc')
            ->get();

        // Thống kê verification records
        $verificationStats = [
            'total' => $allVerifications->count(),
            'approved' => $allVerifications->where('verification_status', 'approved')->count(),
            'pending' => $allVerifications->where('verification_status', 'pending')->count(),
            'requires_revision' => $allVerifications->where('verification_status', 'requires_revision')->count(),
            'rejected' => $allVerifications->where('verification_status', 'rejected')->count(),
        ];

        // Tính average verification score
        $verificationStats['average_score'] = $allVerifications->avg('verification_score') ?? 0;

        return view('page.Verifier.Reports.index', compact('allVerifications', 'verificationStats', 'verifier'));
    }

    /**
     * Hiển thị analytics và thống kê
     */
    public function analytics()
    {
        $verifier = Auth::user();

        // Lấy dữ liệu analytics
        $analytics = $this->getAnalyticsData($verifier->id);

        return view('page.Verifier.Analytics.index', compact('analytics', 'verifier'));
    }

    /**
     * Lấy thống kê dashboard
     */
    private function getDashboardStats(int $verifierId): array
    {
        // Tổng số requests đang chờ
        $totalRequests = MrvDeclaration::where('status', 'submitted')->count();

        // Số requests đã được assign cho verifier này
        $myAssignedRequests = VerificationRecord::where('verifier_id', $verifierId)
            ->where('verification_status', 'pending')
            ->count();

        // Số verifications đã hoàn thành
        $completedVerifications = VerificationRecord::where('verifier_id', $verifierId)
            ->whereIn('verification_status', ['approved', 'rejected'])
            ->count();

        // Tổng carbon credits đã verify
        $totalCarbonCredits = VerificationRecord::where('verifier_id', $verifierId)
            ->where('verification_status', 'approved')
            ->with('mrvDeclaration')
            ->get()
            ->sum(function ($verification) {
                return $verification->mrvDeclaration->estimated_carbon_credits ?? 0;
            });

        return [
            'total_requests' => $totalRequests,
            'my_assigned_requests' => $myAssignedRequests,
            'completed_verifications' => $completedVerifications,
            'total_carbon_credits' => round($totalCarbonCredits, 2),
        ];
    }

    /**
     * Lấy dữ liệu analytics
     */
    private function getAnalyticsData(int $verifierId): array
    {
        // Thống kê theo tháng
        $monthlyStats = VerificationRecord::where('verifier_id', $verifierId)
            ->selectRaw('DATE_FORMAT(verification_date, "%Y-%m") as month, COUNT(*) as count, AVG(verification_score) as avg_score')
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit(12)
            ->get();

        // Thống kê theo verification type
        $typeStats = VerificationRecord::where('verifier_id', $verifierId)
            ->selectRaw('verification_type, COUNT(*) as count, AVG(verification_score) as avg_score')
            ->groupBy('verification_type')
            ->get();

        // Thống kê theo status
        $statusStats = VerificationRecord::where('verifier_id', $verifierId)
            ->selectRaw('verification_status, COUNT(*) as count')
            ->groupBy('verification_status')
            ->pluck('count', 'verification_status')
            ->toArray();

        // Top farmers được verify
        $topFarmers = VerificationRecord::where('verifier_id', $verifierId)
            ->where('verification_status', 'approved')
            ->with('mrvDeclaration.farmProfile.user:id,full_name')
            ->get()
            ->groupBy('mrvDeclaration.farmProfile.user.full_name')
            ->map(function ($verifications) {
                return [
                    'count' => $verifications->count(),
                    'total_credits' => $verifications->sum(function ($v) {
                        return $v->mrvDeclaration->estimated_carbon_credits ?? 0;
                    })
                ];
            })
            ->sortByDesc('count')
            ->take(10);

        return [
            'monthly_stats' => $monthlyStats,
            'type_stats' => $typeStats,
            'status_stats' => $statusStats,
            'top_farmers' => $topFarmers,
        ];
    }
}
