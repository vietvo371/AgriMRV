<?php

namespace App\Services;

use App\Models\EvidenceFile;
use App\Models\AiAnalysisResult;
use Illuminate\Support\Facades\DB;

/**
 * Service giả lập AI Analysis để test mà không cần phát triển AI thực tế
 * Tạo ra các kết quả phân tích giống như AI thật
 */
class AiAnalysisSimulatorService
{
    /**
     * Giả lập AI analysis cho một evidence file
     */
    public function simulateAnalysis(EvidenceFile $evidenceFile): AiAnalysisResult
    {
        // Xác định loại phân tích dựa trên file type
        $analysisType = $this->determineAnalysisType($evidenceFile->file_type);

        // Tạo dữ liệu giả lập dựa trên loại file và metadata
        $analysisData = $this->generateAnalysisData($evidenceFile, $analysisType);

        // Tạo AiAnalysisResult với dữ liệu giả lập
        return AiAnalysisResult::create([
            'evidence_file_id' => $evidenceFile->id,
            'analysis_type' => $analysisType,
            'confidence_score' => $analysisData['confidence_score'],
            'analysis_results' => $analysisData['analysis_results'],
            'crop_health_score' => $analysisData['crop_health_score'],
            'authenticity_score' => $analysisData['authenticity_score'],
            'quality_indicators' => $analysisData['quality_indicators'],
            'recommendations' => $analysisData['recommendations'],
            'processed_at' => now(),
        ]);
    }

    /**
     * Xác định loại phân tích dựa trên file type
     */
    private function determineAnalysisType(string $fileType): string
    {
        $typeMap = [
            'satellite_image' => 'crop_health_analysis',
            'field_photo' => 'crop_health_analysis',
            'drone_image' => 'crop_health_analysis',
            'soil_sample' => 'soil_analysis',
            'water_sample' => 'water_quality_analysis',
            'yield_photo' => 'yield_prediction',
            'irrigation_photo' => 'water_management_analysis',
        ];

        return $typeMap[$fileType] ?? 'general_analysis';
    }

    /**
     * Tạo dữ liệu phân tích giả lập
     */
    private function generateAnalysisData(EvidenceFile $evidenceFile, string $analysisType): array
    {
        $baseScore = $this->calculateBaseScore($evidenceFile);

        switch ($analysisType) {
            case 'crop_health_analysis':
                return $this->generateCropHealthData($evidenceFile, $baseScore);
            case 'soil_analysis':
                return $this->generateSoilAnalysisData($evidenceFile, $baseScore);
            case 'water_quality_analysis':
                return $this->generateWaterQualityData($evidenceFile, $baseScore);
            case 'yield_prediction':
                return $this->generateYieldPredictionData($evidenceFile, $baseScore);
            case 'water_management_analysis':
                return $this->generateWaterManagementData($evidenceFile, $baseScore);
            default:
                return $this->generateGeneralAnalysisData($evidenceFile, $baseScore);
        }
    }

    /**
     * Tính điểm cơ bản dựa trên metadata của file
     */
    private function calculateBaseScore(EvidenceFile $evidenceFile): float
    {
        $score = 85.0; // Điểm cơ bản

        // Tăng điểm dựa trên file size (file lớn hơn = chất lượng tốt hơn)
        if ($evidenceFile->file_size_bytes > 2 * 1024 * 1024) { // > 2MB
            $score += 5;
        }

        // Tăng điểm dựa trên GPS accuracy (nếu có)
        if ($evidenceFile->gps_latitude && $evidenceFile->gps_longitude) {
            $score += 3;
        }

        // Tăng điểm dựa trên timestamp (file mới hơn = chất lượng tốt hơn)
        $daysOld = now()->diffInDays($evidenceFile->capture_timestamp);
        if ($daysOld <= 7) {
            $score += 2;
        } elseif ($daysOld <= 30) {
            $score += 1;
        }

        return min(100, $score);
    }

    /**
     * Tạo dữ liệu phân tích sức khỏe cây trồng
     */
    private function generateCropHealthData(EvidenceFile $evidenceFile, float $baseScore): array
    {
        $cropHealth = $this->getRandomCropHealth($baseScore);
        $growthStage = $this->getRandomGrowthStage();
        $estimatedYield = $this->getRandomYield($baseScore);

        return [
            'confidence_score' => $baseScore + rand(-3, 3),
            'analysis_results' => [
                'crop_health' => $cropHealth,
                'growth_stage' => $growthStage,
                'estimated_yield' => $estimatedYield,
                'disease_detection' => $this->getRandomDiseaseStatus($baseScore),
                'nutrient_deficiency' => $this->getRandomNutrientStatus($baseScore),
                'stress_factors' => $this->getRandomStressFactors(),
            ],
            'crop_health_score' => $this->getCropHealthScore($cropHealth),
            'authenticity_score' => $baseScore + rand(-2, 2),
            'quality_indicators' => [
                'image_quality' => $this->getImageQuality($baseScore),
                'gps_accuracy' => $this->getGpsAccuracy($evidenceFile),
                'timestamp_validity' => 'valid',
                'file_integrity' => 'verified',
                'resolution_quality' => $this->getResolutionQuality($baseScore),
            ],
            'recommendations' => $this->getCropHealthRecommendations($cropHealth, $growthStage),
        ];
    }

    /**
     * Tạo dữ liệu phân tích đất
     */
    private function generateSoilAnalysisData(EvidenceFile $evidenceFile, float $baseScore): array
    {
        $soilQuality = $this->getRandomSoilQuality($baseScore);

        return [
            'confidence_score' => $baseScore + rand(-2, 2),
            'analysis_results' => [
                'soil_type' => $this->getRandomSoilType(),
                'soil_quality' => $soilQuality,
                'ph_level' => $this->getRandomPhLevel(),
                'organic_matter' => $this->getRandomOrganicMatter(),
                'moisture_content' => $this->getRandomMoistureContent(),
                'compaction_level' => $this->getRandomCompactionLevel(),
            ],
            'crop_health_score' => $baseScore + rand(-5, 5),
            'authenticity_score' => $baseScore + rand(-3, 3),
            'quality_indicators' => [
                'sample_quality' => $this->getSampleQuality($baseScore),
                'collection_method' => 'standard',
                'preservation_status' => 'good',
                'analysis_method' => 'laboratory',
            ],
            'recommendations' => $this->getSoilRecommendations($soilQuality),
        ];
    }

    /**
     * Tạo dữ liệu phân tích chất lượng nước
     */
    private function generateWaterQualityData(EvidenceFile $evidenceFile, float $baseScore): array
    {
        $waterQuality = $this->getRandomWaterQuality($baseScore);

        return [
            'confidence_score' => $baseScore + rand(-2, 2),
            'analysis_results' => [
                'water_quality' => $waterQuality,
                'ph_level' => $this->getRandomWaterPh(),
                'turbidity' => $this->getRandomTurbidity(),
                'dissolved_oxygen' => $this->getRandomDissolvedOxygen(),
                'nutrient_levels' => $this->getRandomNutrientLevels(),
                'contamination_risk' => $this->getRandomContaminationRisk($baseScore),
            ],
            'crop_health_score' => $baseScore + rand(-5, 5),
            'authenticity_score' => $baseScore + rand(-3, 3),
            'quality_indicators' => [
                'sample_collection' => 'proper',
                'preservation_method' => 'adequate',
                'analysis_accuracy' => 'high',
                'calibration_status' => 'verified',
            ],
            'recommendations' => $this->getWaterQualityRecommendations($waterQuality),
        ];
    }

    /**
     * Tạo dữ liệu dự đoán năng suất
     */
    private function generateYieldPredictionData(EvidenceFile $evidenceFile, float $baseScore): array
    {
        $yieldPrediction = $this->getRandomYieldPrediction($baseScore);

        return [
            'confidence_score' => $baseScore + rand(-3, 3),
            'analysis_results' => [
                'yield_prediction' => $yieldPrediction,
                'confidence_interval' => $this->getConfidenceInterval($baseScore),
                'growth_trends' => $this->getRandomGrowthTrends(),
                'risk_factors' => $this->getRandomRiskFactors(),
                'optimization_potential' => $this->getRandomOptimizationPotential(),
            ],
            'crop_health_score' => $baseScore + rand(-5, 5),
            'authenticity_score' => $baseScore + rand(-2, 2),
            'quality_indicators' => [
                'prediction_model' => 'advanced_ml',
                'data_quality' => 'high',
                'historical_accuracy' => '85%',
                'update_frequency' => 'daily',
            ],
            'recommendations' => $this->getYieldOptimizationRecommendations($yieldPrediction),
        ];
    }

    /**
     * Tạo dữ liệu phân tích quản lý nước
     */
    private function generateWaterManagementData(EvidenceFile $evidenceFile, float $baseScore): array
    {
        $waterEfficiency = $this->getRandomWaterEfficiency($baseScore);

        return [
            'confidence_score' => $baseScore + rand(-2, 2),
            'analysis_results' => [
                'water_efficiency' => $waterEfficiency,
                'irrigation_schedule' => $this->getRandomIrrigationSchedule(),
                'water_distribution' => $this->getRandomWaterDistribution(),
                'drainage_quality' => $this->getRandomDrainageQuality(),
                'water_savings' => $this->getRandomWaterSavings(),
            ],
            'crop_health_score' => $baseScore + rand(-5, 5),
            'authenticity_score' => $baseScore + rand(-3, 3),
            'quality_indicators' => [
                'monitoring_system' => 'automated',
                'sensor_accuracy' => 'high',
                'data_frequency' => 'real_time',
                'calibration_status' => 'verified',
            ],
            'recommendations' => $this->getWaterManagementRecommendations($waterEfficiency),
        ];
    }

    /**
     * Tạo dữ liệu phân tích tổng quát
     */
    private function generateGeneralAnalysisData(EvidenceFile $evidenceFile, float $baseScore): array
    {
        return [
            'confidence_score' => $baseScore + rand(-5, 5),
            'analysis_results' => [
                'overall_quality' => $this->getRandomOverallQuality($baseScore),
                'data_reliability' => $this->getRandomDataReliability($baseScore),
                'processing_status' => 'completed',
                'analysis_version' => '1.0',
            ],
            'crop_health_score' => $baseScore + rand(-5, 5),
            'authenticity_score' => $baseScore + rand(-3, 3),
            'quality_indicators' => [
                'general_quality' => 'good',
                'processing_efficiency' => 'high',
                'error_rate' => 'low',
            ],
            'recommendations' => 'Continue monitoring and maintain current practices.',
        ];
    }

    // === HELPER METHODS ===

    private function getRandomCropHealth(float $baseScore): string
    {
        if ($baseScore >= 90) return 'excellent';
        if ($baseScore >= 80) return 'good';
        if ($baseScore >= 70) return 'fair';
        return 'poor';
    }

    private function getRandomGrowthStage(): string
    {
        $stages = ['seedling', 'vegetative', 'flowering', 'fruiting', 'mature'];
        return $stages[array_rand($stages)];
    }

    private function getRandomYield(float $baseScore): string
    {
        if ($baseScore >= 85) return 'high';
        if ($baseScore >= 70) return 'medium';
        return 'low';
    }

    private function getRandomDiseaseStatus(float $baseScore): string
    {
        if ($baseScore >= 90) return 'none_detected';
        if ($baseScore >= 80) return 'minor_risk';
        if ($baseScore >= 70) return 'moderate_risk';
        return 'high_risk';
    }

    private function getRandomNutrientStatus(float $baseScore): string
    {
        if ($baseScore >= 85) return 'optimal';
        if ($baseScore >= 75) return 'adequate';
        if ($baseScore >= 65) return 'deficient';
        return 'severely_deficient';
    }

    private function getRandomStressFactors(): array
    {
        $factors = ['drought', 'flooding', 'heat', 'cold', 'pests', 'diseases'];
        $numFactors = rand(0, 2);
        return array_slice($factors, 0, $numFactors);
    }

    private function getCropHealthScore(string $cropHealth): float
    {
        $scores = [
            'excellent' => 95,
            'good' => 85,
            'fair' => 75,
            'poor' => 60
        ];
        return $scores[$cropHealth] ?? 75;
    }

    private function getImageQuality(float $baseScore): string
    {
        if ($baseScore >= 90) return 'high';
        if ($baseScore >= 80) return 'medium';
        return 'low';
    }

    private function getGpsAccuracy(EvidenceFile $evidenceFile): string
    {
        if ($evidenceFile->gps_latitude && $evidenceFile->gps_longitude) {
            return 'excellent';
        }
        return 'unknown';
    }

    private function getResolutionQuality(float $baseScore): string
    {
        if ($baseScore >= 90) return 'ultra_hd';
        if ($baseScore >= 80) return 'high';
        if ($baseScore >= 70) return 'standard';
        return 'low';
    }

    private function getCropHealthRecommendations(string $cropHealth, string $growthStage): string
    {
        if ($cropHealth === 'excellent') {
            return 'Tree is healthy and growing well.';
        } elseif ($cropHealth === 'good') {
            return 'Tree is healthy and growing well. You can optimize it to achieve higher efficiency.';
        } elseif ($cropHealth === 'fair') {
            return 'Tree needs more care. Check nutrient levels and irrigation.';
        } else {
            return 'Tree needs immediate intervention. Check pests and environmental conditions.';
        }
    }

    private function getRandomSoilQuality(float $baseScore): string
    {
        if ($baseScore >= 85) return 'excellent';
        if ($baseScore >= 75) return 'good';
        if ($baseScore >= 65) return 'fair';
        return 'poor';
    }

    private function getRandomSoilType(): string
    {
        $types = ['sandy_loam', 'clay_loam', 'silt_loam', 'sandy_clay', 'loamy_sand'];
        return $types[array_rand($types)];
    }

    private function getRandomPhLevel(): float
    {
        return round(5.5 + (rand(0, 40) / 10), 1); // 5.5 - 9.5
    }

    private function getRandomOrganicMatter(): float
    {
        return round(1.0 + (rand(0, 50) / 10), 1); // 1.0 - 6.0%
    }

    private function getRandomMoistureContent(): float
    {
        return round(15.0 + (rand(0, 30)), 1); // 15.0 - 45.0%
    }

    private function getRandomCompactionLevel(): string
    {
        $levels = ['low', 'moderate', 'high'];
        return $levels[array_rand($levels)];
    }

    private function getSampleQuality(float $baseScore): string
    {
        if ($baseScore >= 85) return 'excellent';
        if ($baseScore >= 75) return 'good';
        return 'adequate';
    }

    private function getSoilRecommendations(string $soilQuality): string
    {
        if ($soilQuality === 'excellent') {
            return 'Đất có chất lượng rất tốt. Duy trì các biện pháp bảo vệ đất hiện tại.';
        } elseif ($soilQuality === 'good') {
            return 'Đất có chất lượng tốt. Có thể cải thiện thêm bằng phân bón hữu cơ.';
        } elseif ($soilQuality === 'fair') {
            return 'Đất cần được cải thiện. Bổ sung phân bón và chất hữu cơ.';
        } else {
            return 'Đất cần được cải tạo. Thực hiện các biện pháp cải thiện đất ngay lập tức.';
        }
    }

    private function getRandomWaterQuality(float $baseScore): string
    {
        if ($baseScore >= 85) return 'excellent';
        if ($baseScore >= 75) return 'good';
        if ($baseScore >= 65) return 'fair';
        return 'poor';
    }

    private function getRandomWaterPh(): float
    {
        return round(6.5 + (rand(0, 30) / 10), 1); // 6.5 - 9.5
    }

    private function getRandomTurbidity(): float
    {
        return round(1.0 + (rand(0, 20)), 1); // 1.0 - 21.0 NTU
    }

    private function getRandomDissolvedOxygen(): float
    {
        return round(6.0 + (rand(0, 40) / 10), 1); // 6.0 - 10.0 mg/L
    }

    private function getRandomNutrientLevels(): array
    {
        return [
            'nitrogen' => rand(5, 25) . ' mg/L',
            'phosphorus' => rand(0.1, 2.0) . ' mg/L',
            'potassium' => rand(2, 15) . ' mg/L'
        ];
    }

    private function getRandomContaminationRisk(float $baseScore): string
    {
        if ($baseScore >= 85) return 'very_low';
        if ($baseScore >= 75) return 'low';
        if ($baseScore >= 65) return 'moderate';
        return 'high';
    }

    private function getWaterQualityRecommendations(string $waterQuality): string
    {
        if ($waterQuality === 'excellent') {
            return 'Chất lượng nước rất tốt. Phù hợp cho tưới tiêu và nuôi trồng.';
        } elseif ($waterQuality === 'good') {
            return 'Chất lượng nước tốt. Có thể sử dụng cho tưới tiêu.';
        } elseif ($waterQuality === 'fair') {
            return 'Chất lượng nước trung bình. Cần xử lý trước khi sử dụng.';
        } else {
            return 'Chất lượng nước kém. Không nên sử dụng cho tưới tiêu.';
        }
    }

    private function getRandomYieldPrediction(float $baseScore): string
    {
        if ($baseScore >= 85) return 'very_high';
        if ($baseScore >= 75) return 'high';
        if ($baseScore >= 65) return 'medium';
        return 'low';
    }

    private function getConfidenceInterval(float $baseScore): string
    {
        if ($baseScore >= 90) return '±5%';
        if ($baseScore >= 80) return '±10%';
        if ($baseScore >= 70) return '±15%';
        return '±20%';
    }

    private function getRandomGrowthTrends(): array
    {
        $trends = ['accelerating', 'steady', 'decelerating'];
        return [$trends[array_rand($trends)]];
    }

    private function getRandomRiskFactors(): array
    {
        $factors = ['weather', 'pests', 'diseases', 'nutrient_deficiency'];
        $numFactors = rand(1, 3);
        return array_slice($factors, 0, $numFactors);
    }

    private function getRandomOptimizationPotential(): string
    {
        $potentials = ['high', 'medium', 'low'];
        return $potentials[array_rand($potentials)];
    }

    private function getYieldOptimizationRecommendations(string $yieldPrediction): string
    {
        if ($yieldPrediction === 'very_high') {
            return 'Năng suất dự kiến rất cao. Duy trì các biện pháp tối ưu hiện tại.';
        } elseif ($yieldPrediction === 'high') {
            return 'Năng suất dự kiến cao. Có thể tối ưu hóa thêm để đạt mức cao hơn.';
        } elseif ($yieldPrediction === 'medium') {
            return 'Năng suất dự kiến trung bình. Cần cải thiện các biện pháp canh tác.';
        } else {
            return 'Năng suất dự kiến thấp. Cần can thiệp mạnh mẽ để cải thiện.';
        }
    }

    private function getRandomWaterEfficiency(float $baseScore): string
    {
        if ($baseScore >= 85) return 'excellent';
        if ($baseScore >= 75) return 'good';
        if ($baseScore >= 65) return 'fair';
        return 'poor';
    }

    private function getRandomIrrigationSchedule(): string
    {
        $schedules = ['optimal', 'adequate', 'suboptimal', 'inefficient'];
        return $schedules[array_rand($schedules)];
    }

    private function getRandomWaterDistribution(): string
    {
        $distributions = ['uniform', 'mostly_uniform', 'variable', 'poor'];
        return $distributions[array_rand($distributions)];
    }

    private function getRandomDrainageQuality(): string
    {
        $qualities = ['excellent', 'good', 'adequate', 'poor'];
        return $qualities[array_rand($qualities)];
    }

    private function getRandomWaterSavings(): float
    {
        return round(15.0 + (rand(0, 35)), 1); // 15.0 - 50.0%
    }

    private function getWaterManagementRecommendations(string $waterEfficiency): string
    {
        if ($waterEfficiency === 'excellent') {
            return 'Hiệu quả sử dụng nước rất cao. Duy trì các biện pháp quản lý hiện tại.';
        } elseif ($waterEfficiency === 'good') {
            return 'Hiệu quả sử dụng nước tốt. Có thể tối ưu hóa thêm để tiết kiệm nước.';
        } elseif ($waterEfficiency === 'fair') {
            return 'Hiệu quả sử dụng nước trung bình. Cần cải thiện hệ thống tưới tiêu.';
        } else {
            return 'Hiệu quả sử dụng nước thấp. Cần cải tạo hệ thống tưới tiêu ngay lập tức.';
        }
    }

    private function getRandomOverallQuality(float $baseScore): string
    {
        if ($baseScore >= 85) return 'excellent';
        if ($baseScore >= 75) return 'good';
        if ($baseScore >= 65) return 'fair';
        return 'poor';
    }

    private function getRandomDataReliability(float $baseScore): string
    {
        if ($baseScore >= 85) return 'very_high';
        if ($baseScore >= 75) return 'high';
        if ($baseScore >= 65) return 'moderate';
        return 'low';
    }
}
