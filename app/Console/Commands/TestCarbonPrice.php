<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\CarbonPriceService;

class TestCarbonPrice extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'carbon:test-price';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test Carbon Price Service với external API';

    /**
     * Execute the console command.
     */
    public function handle(CarbonPriceService $carbonPriceService)
    {
        $this->info('🧪 Testing Carbon Price Service...');
        
        try {
            // Test current price
            $this->info('📊 Lấy giá hiện tại...');
            $currentPrice = $carbonPriceService->getCurrentPrice();
            $this->info("✅ Giá hiện tại: $${currentPrice} USD/credit");
            
            // Test market info
            $this->info('📈 Lấy thông tin thị trường...');
            $marketInfo = $carbonPriceService->getMarketInfo();
            $this->info("✅ Market Trend: {$marketInfo['trend']}");
            $this->info("✅ 24h Change: {$marketInfo['change_24h']}%");
            $this->info("✅ Volume: {$marketInfo['volume']}");
            $this->info("✅ Market Cap: $${marketInfo['market_cap']}");
            
            // Test historical price
            $this->info('📅 Lấy giá lịch sử...');
            $yesterday = now()->subDay()->format('Y-m-d');
            $historicalPrice = $carbonPriceService->getPriceByDate($yesterday);
            $this->info("✅ Giá ngày {$yesterday}: $${historicalPrice} USD/credit");
            
            // Test average price
            $this->info('📊 Lấy giá trung bình...');
            $startDate = now()->subWeek()->format('Y-m-d');
            $endDate = now()->format('Y-m-d');
            $averagePrice = $carbonPriceService->getAveragePrice($startDate, $endDate);
            $this->info("✅ Giá trung bình từ {$startDate} đến {$endDate}: $${averagePrice} USD/credit");
            
            $this->info('🎉 Tất cả tests đều thành công!');
            
        } catch (\Exception $e) {
            $this->error('❌ Error: ' . $e->getMessage());
            $this->warn('⚠️  Có thể external API không hoạt động, sử dụng giá fallback');
        }
    }
}
