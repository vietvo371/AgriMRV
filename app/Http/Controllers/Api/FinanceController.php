<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CarbonCredit;
use App\Models\FinancialRecord;
use App\Models\MrvDeclaration;
use App\Models\VerificationRecord;
use App\Traits\ApiResponseTrait;
use App\Services\CarbonPriceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FinanceController extends Controller
{
    use ApiResponseTrait;

    protected $carbonPriceService;

    public function __construct(CarbonPriceService $carbonPriceService)
    {
        $this->carbonPriceService = $carbonPriceService;
    }

    public function portfolio(Request $request)
    {
        $user = $request->user();

        // Lấy carbon credits của user thông qua mrv_declarations
        $verifiedCredits = CarbonCredit::whereHas('mrvDeclaration', function($q) use ($user) {
            $q->where('farm_profile_id', $user->id);
        })->where('status', 'verified')->sum('credit_amount');

        $pendingCredits = CarbonCredit::whereHas('mrvDeclaration', function($q) use ($user) {
            $q->where('farm_profile_id', $user->id);
        })->where('status', 'pending')->sum('credit_amount');

        $totalCredits = $verifiedCredits + $pendingCredits;

        // Lấy giá carbon credit thực tế từ external API
        $pricePerCredit = $this->carbonPriceService->getCurrentPrice();

        $totalValue = $verifiedCredits * $pricePerCredit;

        // Tính monthly change
        $lastMonthCredits = CarbonCredit::whereHas('mrvDeclaration', function($q) use ($user) {
            $q->where('farm_profile_id', $user->id);
        })->where('status', 'verified')
            ->whereMonth('issued_date', now()->subMonth()->month)
            ->sum('credit_amount');

        $monthlyChange = $lastMonthCredits > 0 ? (($verifiedCredits - $lastMonthCredits) / $lastMonthCredits) * 100 : 0;

        // Tính success rate
        $totalDeclarations = MrvDeclaration::where('farm_profile_id', $user->id)->count();
        $verifiedDeclarations = MrvDeclaration::where('farm_profile_id', $user->id)
            ->where('status', 'verified')
            ->count();
        $successRate = $totalDeclarations > 0 ? ($verifiedDeclarations / $totalDeclarations) * 100 : 0;

        return $this->success([
            'carbon_credits' => [
                'verified' => round($verifiedCredits, 2),
                'pending' => round($pendingCredits, 2),
                'total_value' => round($totalValue, 2),
                'price_per_credit' => $pricePerCredit,
                'total_credits' => round($totalCredits, 2)
            ],
            'monthly_change' => round($monthlyChange, 2),
            'success_rate' => round($successRate, 2)
        ]);
    }

    public function verificationPipeline(Request $request)
    {
        $user = $request->user();

        // Lấy MRV declarations của user
        $declarations = MrvDeclaration::where('farm_profile_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $stages = [];
        $overallProgress = 0;

        if ($declarations->count() > 0) {
            // Lấy declaration mới nhất để tính progress
            $latestDeclaration = $declarations->first();
            $stages = $this->calculateStageProgress($latestDeclaration);
            $overallProgress = array_sum(array_column($stages, 'progress')) / count($stages);
        } else {
            // Nếu không có declarations, tạo stages mặc định
            $stages = [
                [
                    'stage' => 'MRV Declaration',
                    'status' => 'pending',
                    'date' => null,
                    'progress' => 0
                ],
                [
                    'stage' => 'Field Verification',
                    'status' => 'pending',
                    'date' => null,
                    'progress' => 0
                ],
                [
                    'stage' => 'Third-party Audit',
                    'status' => 'pending',
                    'date' => null,
                    'progress' => 0
                ],
                [
                    'stage' => 'Credit Issuance',
                    'status' => 'pending',
                    'date' => null,
                    'progress' => 0
                ],
                [
                    'stage' => 'Market Trading',
                    'status' => 'pending',
                    'date' => null,
                    'progress' => 0
                ]
            ];
            $overallProgress = 0;
        }

        return $this->success([
            'stages' => $stages,
            'overall_progress' => round($overallProgress, 2)
        ]);
    }

    public function paymentHistory(Request $request)
    {
        $user = $request->user();
        $limit = min(50, max(1, (int) $request->input('limit', 10)));

                // Lấy payment history từ financial records
        $payments = FinancialRecord::where('user_id', $user->id)
            ->where('record_type', 'carbon_revenue')
            ->orderBy('transaction_date', 'desc')
            ->take($limit)
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'date' => $payment->transaction_date->format('Y-m-d'),
                    'amount' => round($payment->amount, 2),
                    'credits' => 0, // financial_records không có credit_amount
                    'status' => $payment->status ?? 'paid',
                    'transaction_id' => 'TXN_' . str_pad($payment->id, 3, '0', STR_PAD_LEFT)
                ];
            });

        // Tính tổng
        $totalEarned = FinancialRecord::where('user_id', $user->id)
            ->where('record_type', 'carbon_revenue')
            ->where('status', 'paid')
            ->sum('amount');

        $totalCreditsSold = 0; // Không có credit_amount trong financial_records

        return $this->success([
            'payments' => $payments,
            'total_earned' => round($totalEarned, 2),
            'total_credits_sold' => round($totalCreditsSold, 2)
        ]);
    }

    public function projectedEarnings(Request $request)
    {
        $user = $request->user();

                // Lấy historical data
        $last3Months = FinancialRecord::where('user_id', $user->id)
            ->where('record_type', 'carbon_revenue')
            ->where('status', 'paid')
            ->where('transaction_date', '>=', now()->subMonths(3))
            ->sum('amount');

        $lastYear = FinancialRecord::where('user_id', $user->id)
            ->where('record_type', 'carbon_revenue')
            ->where('status', 'paid')
            ->where('transaction_date', '>=', now()->subYear())
            ->sum('amount');

        $lastMonth = FinancialRecord::where('user_id', $user->id)
            ->where('record_type', 'carbon_revenue')
            ->where('status', 'paid')
            ->where('transaction_date', '>=', now()->subMonth())
            ->sum('amount');

        // Tính projections dựa trên historical data và growth rate
        $growthRate = 15.5; // % growth per quarter

        $nextMonth = $lastMonth * (1 + ($growthRate / 100 / 3));
        $nextQuarter = $last3Months * (1 + ($growthRate / 100));
        $nextYear = $lastYear * (1 + ($growthRate / 100));

        // Lấy market trend từ external API
        $marketInfo = $this->carbonPriceService->getMarketInfo();
        $marketTrend = $marketInfo['trend'];

        // Tính growth rate dựa trên market info
        if ($marketInfo['change_24h'] > 0) {
            $growthRate = min(25, $growthRate + 5); // Tăng growth rate nếu market up
        } elseif ($marketInfo['change_24h'] < 0) {
            $growthRate = max(5, $growthRate - 5); // Giảm growth rate nếu market down
        }

        return $this->success([
            'projections' => [
                'next_month' => round($nextMonth, 2),
                'next_quarter' => round($nextQuarter, 2),
                'next_year' => round($nextYear, 2)
            ],
            'growth_rate' => $growthRate,
            'market_trend' => $marketTrend
        ]);
    }

    public function performanceMetrics(Request $request)
    {
        $user = $request->user();

                // Lấy performance metrics
        $creditsSold = 0; // Không có credit_amount trong financial_records

        $totalRevenue = FinancialRecord::where('user_id', $user->id)
            ->where('record_type', 'carbon_revenue')
            ->where('status', 'paid')
            ->sum('amount');

        // Lấy giá carbon credit thực tế để tính average price
        $currentPrice = $this->carbonPriceService->getCurrentPrice();
        $averagePrice = $currentPrice; // Sử dụng giá hiện tại làm average

        // Verification success rate
        $totalDeclarations = MrvDeclaration::where('farm_profile_id', $user->id)->count();
        $verifiedDeclarations = MrvDeclaration::where('farm_profile_id', $user->id)
            ->where('status', 'verified')
            ->count();
        $verificationSuccessRate = $totalDeclarations > 0 ? ($verifiedDeclarations / $totalDeclarations) * 100 : 0;

        // Market demand assessment
        $recentCredits = CarbonCredit::whereHas('mrvDeclaration', function($q) use ($user) {
            $q->where('farm_profile_id', $user->id);
        })->where('status', 'verified')
            ->where('issued_date', '>=', now()->subMonths(3))
            ->sum('credit_amount');

        $marketDemand = 'medium';
        if ($recentCredits > 20) {
            $marketDemand = 'high';
        } elseif ($recentCredits < 5) {
            $marketDemand = 'low';
        }

        // Lấy price trend từ external API
        $marketInfo = $this->carbonPriceService->getMarketInfo();
        $priceTrend = $marketInfo['change_24h'] > 0 ? 'up' : ($marketInfo['change_24h'] < 0 ? 'down' : 'stable');

        return $this->success([
            'metrics' => [
                'credits_sold' => round($creditsSold, 2),
                'average_price' => round($averagePrice, 2),
                'verification_success_rate' => round($verificationSuccessRate, 2),
                'market_demand' => $marketDemand,
                'price_trend' => $priceTrend
            ]
        ]);
    }

    // Helper methods
    private function calculateStageProgress(MrvDeclaration $declaration): array
    {
        $stages = [
            'MRV Declaration' => [
                'status' => 'completed',
                'date' => $declaration->created_at->format('Y-m-d'),
                'progress' => 100
            ],
            'Field Verification' => [
                'status' => 'pending',
                'date' => null,
                'progress' => 0
            ],
            'Third-party Audit' => [
                'status' => 'pending',
                'date' => null,
                'progress' => 0
            ],
            'Credit Issuance' => [
                'status' => 'pending',
                'date' => null,
                'progress' => 0
            ],
            'Market Trading' => [
                'status' => 'pending',
                'date' => null,
                'progress' => 0
            ]
        ];

        // Cập nhật status dựa trên declaration status
        if ($declaration->status === 'verified') {
            $stages['Field Verification'] = [
                'status' => 'completed',
                'date' => $declaration->updated_at->format('Y-m-d'),
                'progress' => 100
            ];
            $stages['Third-party Audit'] = [
                'status' => 'completed',
                'date' => $declaration->updated_at->format('Y-m-d'),
                'progress' => 100
            ];
            $stages['Credit Issuance'] = [
                'status' => 'completed',
                'date' => $declaration->updated_at->format('Y-m-d'),
                'progress' => 100
            ];
        } elseif ($declaration->status === 'pending_verification') {
            $stages['Field Verification'] = [
                'status' => 'in_progress',
                'date' => $declaration->updated_at->format('Y-m-d'),
                'progress' => 75
            ];
        }

        // Kiểm tra xem có carbon credits được tạo chưa
        $carbonCredits = CarbonCredit::where('mrv_declaration_id', $declaration->id)->first();
        if ($carbonCredits) {
            $stages['Market Trading'] = [
                'status' => 'completed',
                'date' => $carbonCredits->issued_date->format('Y-m-d'),
                'progress' => 100
            ];
        }

        return array_values(array_map(function($stage, $stageName) {
            return [
                'stage' => $stageName,
                'status' => $stage['status'],
                'date' => $stage['date'],
                'progress' => $stage['progress']
            ];
        }, $stages, array_keys($stages)));
    }
}
