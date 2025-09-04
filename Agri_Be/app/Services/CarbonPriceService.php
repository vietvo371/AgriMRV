<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CarbonPriceService
{
    /**
     * Lấy giá carbon credit hiện tại
     * Sử dụng cache để tránh gọi API quá nhiều
     */
    public function getCurrentPrice(): float
    {
        // Cache trong 1 giờ để tránh gọi API liên tục
        return Cache::remember('carbon_credit_price', 3600, function () {
            return $this->fetchPriceFromAPI();
        });
    }

    /**
     * Lấy giá carbon credit theo ngày cụ thể
     */
    public function getPriceByDate(string $date): float
    {
        $cacheKey = "carbon_credit_price_{$date}";

        return Cache::remember($cacheKey, 86400, function () use ($date) {
            return $this->fetchHistoricalPriceFromAPI($date);
        });
    }

    /**
     * Lấy giá trung bình trong khoảng thời gian
     */
    public function getAveragePrice(string $startDate, string $endDate): float
    {
        $cacheKey = "carbon_credit_avg_{$startDate}_{$endDate}";

        return Cache::remember($cacheKey, 86400, function () use ($startDate, $endDate) {
            return $this->fetchAveragePriceFromAPI($startDate, $endDate);
        });
    }

    /**
     * Lấy giá từ external API
     * Sử dụng Carbon Credit Price API thực tế
     */
    private function fetchPriceFromAPI(): float
    {
        try {
            // API 1: Carbon Credit Price API (miễn phí)
            $response = Http::timeout(10)->get('https://api.carboncreditprice.com/v1/current');

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['price_usd'])) {
                    return (float) $data['price_usd'];
                }
            }

            // API 2: Alternative API nếu API 1 fail
            $response = Http::timeout(10)->get('https://carbonpriceapi.com/current');

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['price'])) {
                    return (float) $data['price'];
                }
            }

            // Fallback: Sử dụng giá từ config hoặc database
            return $this->getFallbackPrice();

        } catch (\Exception $e) {
            Log::warning('Failed to fetch carbon credit price from API: ' . $e->getMessage());
            return $this->getFallbackPrice();
        }
    }

    /**
     * Lấy giá lịch sử từ API
     */
    private function fetchHistoricalPriceFromAPI(string $date): float
    {
        try {
            $response = Http::timeout(10)->get("https://api.carboncreditprice.com/v1/historical/{$date}");

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['price_usd'])) {
                    return (float) $data['price_usd'];
                }
            }

            return $this->getFallbackPrice();

        } catch (\Exception $e) {
            Log::warning("Failed to fetch historical carbon credit price for {$date}: " . $e->getMessage());
            return $this->getFallbackPrice();
        }
    }

    /**
     * Lấy giá trung bình từ API
     */
    private function fetchAveragePriceFromAPI(string $startDate, string $endDate): float
    {
        try {
            $response = Http::timeout(15)->get("https://api.carboncreditprice.com/v1/average", [
                'start_date' => $startDate,
                'end_date' => $endDate
            ]);

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['average_price_usd'])) {
                    return (float) $data['average_price_usd'];
                }
            }

            return $this->getFallbackPrice();

        } catch (\Exception $e) {
            Log::warning("Failed to fetch average carbon credit price from {$startDate} to {$endDate}: " . $e->getMessage());
            return $this->getFallbackPrice();
        }
    }

    /**
     * Giá fallback khi API không hoạt động
     */
    private function getFallbackPrice(): float
    {
        // Có thể lấy từ config, database, hoặc giá cố định
        return config('carbon.price_fallback', 52.5);
    }

    /**
     * Cập nhật giá từ admin panel
     */
    public function updatePrice(float $price): bool
    {
        try {
            // Lưu vào cache
            Cache::put('carbon_credit_price', $price, 3600);

            // Có thể lưu vào database để backup
            // CarbonPriceHistory::create(['price' => $price, 'date' => now()]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to update carbon credit price: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Lấy thông tin thị trường carbon credit
     */
    public function getMarketInfo(): array
    {
        try {
            $response = Http::timeout(10)->get('https://api.carboncreditprice.com/v1/market-info');

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'trend' => $data['trend'] ?? 'stable',
                    'volume' => $data['volume'] ?? 0,
                    'change_24h' => $data['change_24h'] ?? 0,
                    'market_cap' => $data['market_cap'] ?? 0,
                ];
            }

            return [
                'trend' => 'stable',
                'volume' => 0,
                'change_24h' => 0,
                'market_cap' => 0,
            ];

        } catch (\Exception $e) {
            Log::warning('Failed to fetch market info: ' . $e->getMessage());
            return [
                'trend' => 'stable',
                'volume' => 0,
                'change_24h' => 0,
                'market_cap' => 0,
            ];
        }
    }
}
