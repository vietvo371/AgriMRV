<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\CarbonPriceService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class CarbonPriceController extends Controller
{
    use ApiResponseTrait;

    protected $carbonPriceService;

    public function __construct(CarbonPriceService $carbonPriceService)
    {
        $this->carbonPriceService = $carbonPriceService;
    }

    /**
     * Lấy thông tin giá carbon credit hiện tại
     */
    public function getCurrentPrice()
    {
        try {
            $currentPrice = $this->carbonPriceService->getCurrentPrice();
            $marketInfo = $this->carbonPriceService->getMarketInfo();

            return $this->success([
                'current_price' => $currentPrice,
                'market_info' => $marketInfo,
                'last_updated' => now()->toISOString(),
                'source' => 'external_api'
            ]);
        } catch (\Exception $e) {
            return $this->error('Failed to fetch carbon price: ' . $e->getMessage());
        }
    }

    /**
     * Cập nhật giá carbon credit thủ công
     */
    public function updatePrice(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'price' => 'required|numeric|min:0|max:1000',
            'reason' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', $validator->errors()->toArray());
        }

        try {
            $price = $request->input('price');
            $reason = $request->input('reason', 'Manual update by admin');

            $success = $this->carbonPriceService->updatePrice($price);

            if ($success) {
                            // Log the update
            Log::info("Carbon price updated by admin: $${price} - Reason: {$reason}");

                return $this->success([
                    'message' => 'Carbon price updated successfully',
                    'new_price' => $price,
                    'updated_at' => now()->toISOString()
                ]);
            } else {
                return $this->error('Failed to update carbon price');
            }
        } catch (\Exception $e) {
            return $this->error('Failed to update carbon price: ' . $e->getMessage());
        }
    }

    /**
     * Lấy lịch sử giá carbon credit
     */
    public function getPriceHistory(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', $validator->errors()->toArray());
        }

        try {
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            $averagePrice = $this->carbonPriceService->getAveragePrice($startDate, $endDate);

            return $this->success([
                'start_date' => $startDate,
                'end_date' => $endDate,
                'average_price' => $averagePrice,
                'period' => 'custom'
            ]);
        } catch (\Exception $e) {
            return $this->error('Failed to fetch price history: ' . $e->getMessage());
        }
    }

    /**
     * Refresh giá từ external API
     */
    public function refreshPrice()
    {
        try {
            // Clear cache để force refresh
            Cache::forget('carbon_credit_price');

            $newPrice = $this->carbonPriceService->getCurrentPrice();
            $marketInfo = $this->carbonPriceService->getMarketInfo();

            return $this->success([
                'message' => 'Price refreshed successfully',
                'new_price' => $newPrice,
                'market_info' => $marketInfo,
                'refreshed_at' => now()->toISOString()
            ]);
        } catch (\Exception $e) {
            return $this->error('Failed to refresh price: ' . $e->getMessage());
        }
    }

    /**
     * Lấy thống kê giá carbon credit
     */
    public function getPriceStats()
    {
        try {
            $currentPrice = $this->carbonPriceService->getCurrentPrice();
            $yesterdayPrice = $this->carbonPriceService->getPriceByDate(now()->subDay()->format('Y-m-d'));
            $weekAgoPrice = $this->carbonPriceService->getPriceByDate(now()->subWeek()->format('Y-m-d'));
            $monthAgoPrice = $this->carbonPriceService->getPriceByDate(now()->subMonth()->format('Y-m-d'));

            $dailyChange = $yesterdayPrice > 0 ? (($currentPrice - $yesterdayPrice) / $yesterdayPrice) * 100 : 0;
            $weeklyChange = $weekAgoPrice > 0 ? (($currentPrice - $weekAgoPrice) / $weekAgoPrice) * 100 : 0;
            $monthlyChange = $monthAgoPrice > 0 ? (($currentPrice - $monthAgoPrice) / $monthAgoPrice) * 100 : 0;

            return $this->success([
                'current_price' => $currentPrice,
                'changes' => [
                    'daily' => round($dailyChange, 2),
                    'weekly' => round($weeklyChange, 2),
                    'monthly' => round($monthlyChange, 2)
                ],
                'historical_prices' => [
                    'yesterday' => $yesterdayPrice,
                    'week_ago' => $weekAgoPrice,
                    'month_ago' => $monthAgoPrice
                ]
            ]);
        } catch (\Exception $e) {
            return $this->error('Failed to fetch price stats: ' . $e->getMessage());
        }
    }
}
