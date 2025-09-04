<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\AiAnalysisSimulatorService;
use App\Models\EvidenceFile;

/**
 * Command để test AI Simulator Service
 * php artisan test:ai-simulator
 */
class TestAiSimulatorCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'test:ai-simulator {--count=5 : Số lượng evidence files để test}';

    /**
     * The console command description.
     */
    protected $description = 'Test AI Simulator Service để tạo dữ liệu giả lập';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = (int) $this->option('count');
        $this->info("🧪 Bắt đầu test AI Simulator Service với {$count} evidence files...");

        // Lấy evidence files để test
        $evidenceFiles = EvidenceFile::take($count)->get();

        if ($evidenceFiles->isEmpty()) {
            $this->error('❌ Không có evidence files nào để test. Hãy chạy seeder trước.');
            return 1;
        }

        $aiSimulator = new AiAnalysisSimulatorService();
        $createdResults = [];

        $this->info("\n📊 Tạo AI analysis results giả lập:");
        $progressBar = $this->output->createProgressBar($evidenceFiles->count());
        $progressBar->start();

        foreach ($evidenceFiles as $evidenceFile) {
            try {
                $result = $aiSimulator->simulateAnalysis($evidenceFile);
                $createdResults[] = $result;
                $progressBar->advance();
            } catch (\Exception $e) {
                $this->error("\n❌ Lỗi khi tạo AI analysis cho file {$evidenceFile->id}: " . $e->getMessage());
            }
        }

        $progressBar->finish();
        $this->newLine(2);

        // Hiển thị kết quả
        $this->info("✅ Đã tạo thành công " . count($createdResults) . " AI analysis results");

        if (!empty($createdResults)) {
            $this->showSampleResults($createdResults[0]);
        }

        $this->info("\n🎯 AI Simulator Service hoạt động bình thường!");
        return 0;
    }

    /**
     * Hiển thị mẫu kết quả AI analysis
     */
    private function showSampleResults($result)
    {
        $this->info("\n📋 Mẫu AI Analysis Result:");
        $this->line("ID: {$result->id}");
        $this->line("Evidence File ID: {$result->evidence_file_id}");
        $this->line("Analysis Type: {$result->analysis_type}");
        $this->line("Confidence Score: {$result->confidence_score}");
        $this->line("Crop Health Score: {$result->crop_health_score}");
        $this->line("Authenticity Score: {$result->authenticity_score}");

        $this->info("\n🔍 Analysis Results:");
        foreach ($result->analysis_results as $key => $value) {
            if (is_array($value)) {
                $this->line("  {$key}: " . json_encode($value, JSON_UNESCAPED_UNICODE));
            } else {
                $this->line("  {$key}: {$value}");
            }
        }

        $this->info("\n📊 Quality Indicators:");
        foreach ($result->quality_indicators as $key => $value) {
            $this->line("  {$key}: {$value}");
        }

        $this->info("\n💡 Recommendations:");
        $this->line("  {$result->recommendations}");
    }
}
