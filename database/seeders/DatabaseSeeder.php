<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\FarmProfile;
use App\Models\PlotBoundary;
use App\Models\MrvDeclaration;
use App\Models\EvidenceFile;
use App\Models\AiAnalysisResult;
use App\Models\VerificationRecord;
use App\Models\CarbonCredit;
use App\Models\CarbonTransaction;
use App\Models\CooperativeMembership;
use App\Models\TrainingRecord;
use App\Models\FinancialRecord;
use App\Models\BlockchainAnchor;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create user types
        $this->createUsers();
        $this->createFarmProfiles();
        $this->createPlotBoundaries();
        $this->createMrvDeclarations();
        $this->createEvidenceFiles();
        $this->createAiAnalysisResults();
        $this->createVerificationRecords();
        $this->createCarbonCredits();
        $this->createCarbonTransactions();
        $this->createCooperativeMemberships();
        $this->createTrainingRecords();
        $this->createFinancialRecords();
        $this->createBlockchainAnchors();

        // === HIỂN THỊ THỐNG KÊ TỔNG QUAN VỀ STATUS DISTRIBUTION ===
        $this->displayStatusDistributionSummary();
    }

    /**
     * Hiển thị thống kê tổng quan về status distribution của hệ thống
     */
    private function displayStatusDistributionSummary()
    {
        $this->command->info("\n" . str_repeat('=', 60));
        $this->command->info('📊 THỐNG KÊ TỔNG QUAN STATUS DISTRIBUTION');
        $this->command->info(str_repeat('=', 60));

        // MRV Declarations status
        $declarationStats = MrvDeclaration::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $this->command->info('📋 MRV Declarations:');
        foreach (['draft', 'submitted', 'verified', 'rejected'] as $status) {
            $count = $declarationStats[$status] ?? 0;
            $this->command->info("  • {$status}: {$count}");
        }

        // Verification Records status
        $verificationStats = VerificationRecord::selectRaw('verification_status, COUNT(*) as count')
            ->groupBy('verification_status')
            ->pluck('count', 'verification_status')
            ->toArray();

        $this->command->info('🔍 Verification Records:');
        foreach (['pending', 'approved', 'rejected', 'requires_revision'] as $status) {
            $count = $verificationStats[$status] ?? 0;
            $percentage = $verificationStats ? round(($count / array_sum($verificationStats)) * 100, 1) : 0;
            $this->command->info("  • {$status}: {$count} ({$percentage}%)");
        }

        // Carbon Credits status
        $creditStats = CarbonCredit::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $this->command->info('💎 Carbon Credits:');
        foreach (['issued', 'sold', 'retired', 'cancelled'] as $status) {
            $count = $creditStats[$status] ?? 0;
            $percentage = $creditStats ? round(($count / array_sum($creditStats)) * 100, 1) : 0;
            $this->command->info("  • {$status}: {$count} ({$percentage}%)");
        }

        $this->command->info(str_repeat('=', 60));
        $this->command->info('✅ Seeding hoàn tất với logic xử lý status chính xác!');
        $this->command->info(str_repeat('=', 60));
    }

    private function createUsers()
    {
        // Create 15 farmers with diverse data (India-localized)
        for ($i = 1; $i <= 15; $i++) {
            User::create([
                'email' => "farmer{$i}@example.com",
                'phone' => '+91' . str_pad((string)(900000000 + $i), 10, '0', STR_PAD_LEFT),
                'full_name' => 'Farmer ' . $i,
                'date_of_birth' => date('Y-m-d', strtotime('-' . (25 + $i) . ' years')),
                'user_type' => 'farmer',
                // Approx India centroid ranges: 8-35 N, 68-97 E
                'gps_latitude' => 8.0 + ($i * 1.2),
                'gps_longitude' => 68.0 + ($i * 1.4),
                'organization_name' => 'Kisan Household ' . $i,
                'organization_type' => 'individual',
                'address' => ['Punjab, India', 'Uttar Pradesh, India', 'Maharashtra, India', 'Tamil Nadu, India', 'Assam, India'][$i % 5],
                'password' => Hash::make('12345678'),
                'avatar' => 'https://ui-avatars.com/api/?name=Farmer+' . $i . '&background=random&size=200'
            ]);
        }

        // Create 3 cooperatives (India-localized)
        for ($i = 1; $i <= 3; $i++) {
            User::create([
                'email' => "coop{$i}@example.com",
                'phone' => '+91' . str_pad((string)(730000000 + $i), 10, '0', STR_PAD_LEFT),
                'full_name' => 'FPO Cooperative ' . $i,
                'date_of_birth' => '1990-01-01',
                'user_type' => 'cooperative',
                'gps_latitude' => 15.0 + $i * 0.5,
                'gps_longitude' => 75.0 + $i * 0.5,
                'organization_name' => 'FPO ' . $i,
                'organization_type' => 'cooperative',
                'address' => ['Gujarat, India', 'Karnataka, India', 'Bihar, India'][$i % 3],
                'password' => Hash::make('12345678'),
                'avatar' => 'https://ui-avatars.com/api/?name=FPO+' . $i . '&background=random&size=200'
            ]);
        }

        // Create 3 verifiers (India-localized)
        for ($i = 1; $i <= 3; $i++) {
            User::create([
                'email' => "verifier{$i}@example.com",
                'phone' => '+91' . str_pad((string)(790000000 + $i), 10, '0', STR_PAD_LEFT),
                'full_name' => 'Verifier Team ' . $i,
                'date_of_birth' => '1988-08-20',
                'user_type' => 'verifier',
                'gps_latitude' => 22.0 + $i * 0.2,
                'gps_longitude' => 78.0 + $i * 0.2,
                'organization_name' => 'Carbon Verify India ' . $i,
                'organization_type' => 'verification_company',
                'address' => 'New Delhi, India',
                'password' => Hash::make('12345678'),
                'avatar' => 'https://ui-avatars.com/api/?name=Verifier+' . $i . '&background=random&size=200'
            ]);
        }

        // Create 1 bank (India-localized)
        User::create([
            'email' => 'bank@example.com',
            'phone' => '+91123456999',
            'full_name' => 'NABARD Partner Bank',
            'date_of_birth' => '1985-01-01',
            'user_type' => 'bank',
            'gps_latitude' => 19.0760,
            'gps_longitude' => 72.8777,
            'organization_name' => 'AgriBank India',
            'organization_type' => 'bank',
            'address' => 'Mumbai, India',
            'password' => Hash::make('12345678'),
            'avatar' => 'https://ui-avatars.com/api/?name=AgriBank+IN&background=random&size=200'
        ]);

        // Create 1 government (India-localized)
        User::create([
            'email' => 'government@example.com',
            'phone' => '+91123456888',
            'full_name' => 'Ministry of Agriculture & Farmers Welfare',
            'date_of_birth' => '1980-01-01',
            'user_type' => 'government',
            'gps_latitude' => 28.6139,
            'gps_longitude' => 77.2090,
            'organization_name' => 'MoAFW',
            'organization_type' => 'government',
            'address' => 'New Delhi, India',
            'password' => Hash::make('12345678'),
            'avatar' => 'https://ui-avatars.com/api/?name=MoAFW&background=random&size=200'
        ]);

        // Create 2 buyers (India-localized)
        for ($i = 1; $i <= 2; $i++) {
            User::create([
                'email' => "buyer{$i}@example.com",
                'phone' => '+91' . str_pad((string)(950000000 + $i), 10, '0', STR_PAD_LEFT),
                'full_name' => 'Carbon Buyer ' . $i,
                'date_of_birth' => '1982-01-01',
                'user_type' => 'buyer',
                'gps_latitude' => 13.0827 + $i * 0.1,
                'gps_longitude' => 80.2707 + $i * 0.1,
                'organization_name' => 'Carbon Corp ' . $i,
                'organization_type' => 'corporation',
                'address' => 'Chennai, India',
                'password' => Hash::make('12345678'),
                'avatar' => 'https://ui-avatars.com/api/?name=Carbon+Buyer+' . $i . '&background=random&size=200'
            ]);
        }
    }

    private function createFarmProfiles()
    {
        $farmers = User::where('user_type', 'farmer')->get();
        foreach ($farmers as $idx => $farmer) {
            // India-localized farm sizes
            // Total area: ~6-90 ha (scaled)
            $totalArea = 8 + ($idx * 6.5);
            // Rice area: ensure meaningful carbon reduction
            $riceArea = 5 + ($idx * 4.0);
            // Agroforestry area: meaningful tree cover
            $agroArea = 1.5 + ($idx * 2.0);

            FarmProfile::create([
                'user_id' => $farmer->id,
                'total_area_hectares' => $totalArea,
                'rice_area_hectares' => $riceArea,
                'agroforestry_area_hectares' => $agroArea,
                'primary_crop_type' => ['Rice', 'Rice', 'Rice', 'Rice', 'Rice'][$idx % 5],
                'farming_experience_years' => 2 + $idx * 2,
                'irrigation_type' => ['AWD', 'Canal', 'Tube well', 'Sprinkler', 'Drip'][$idx % 5],
                'soil_type' => ['Alluvial', 'Black (Regur)', 'Red', 'Laterite', 'Sandy loam'][$idx % 5],
            ]);
        }
    }

    private function createPlotBoundaries()
    {
        foreach (FarmProfile::all() as $farmProfile) {
            // Create 2-3 plots per farm
            $numPlots = 2 + ($farmProfile->id % 2);

            for ($p = 1; $p <= $numPlots; $p++) {
                $plotType = ['rice', 'agroforestry', 'mixed'][($farmProfile->id + $p) % 3];
                $area = $plotType === 'rice' ?
                    max(2, $farmProfile->rice_area_hectares / $numPlots) :
                    max(1, $farmProfile->agroforestry_area_hectares / $numPlots);

                PlotBoundary::create([
                    'farm_profile_id' => $farmProfile->id,
                    'plot_name' => ucfirst($plotType) . ' Plot ' . $p . ' - Farm ' . $farmProfile->id,
                    'boundary_coordinates' => [
                        ['lat' => 10.0 + $farmProfile->id / 1000 + $p * 0.001, 'lng' => 105.0 + $farmProfile->id / 1000 + $p * 0.001],
                        ['lat' => 10.01 + $farmProfile->id / 1000 + $p * 0.001, 'lng' => 105.01 + $farmProfile->id / 1000 + $p * 0.001],
                        ['lat' => 10.01 + $farmProfile->id / 1000 + $p * 0.001, 'lng' => 105.0 + $farmProfile->id / 1000 + $p * 0.001],
                        ['lat' => 10.0 + $farmProfile->id / 1000 + $p * 0.001, 'lng' => 105.0 + $farmProfile->id / 1000 + $p * 0.001],
                    ],
                    'area_hectares' => round($area, 2),
                    'plot_type' => $plotType,
                ]);
            }
        }
    }

    private function createMrvDeclarations()
    {
        $farmProfiles = FarmProfile::all();
        $quarters = ['2024-Kharif', '2024-Rabi', '2023-Kharif', '2023-Rabi'];

        foreach ($farmProfiles as $idx => $farmProfile) {
            // Tạo 1-3 báo cáo MRV cho mỗi farm (để có dữ liệu đa dạng)
            $numDeclarations = 1 + ($idx % 3);

            $plotBoundaries = PlotBoundary::where('farm_profile_id', $farmProfile->id)->get();

            foreach ($plotBoundaries as $plot) {
                for ($d = 1; $d <= $numDeclarations; $d++) {
                    $quarter = $quarters[($idx + $d) % count($quarters)];

                    // === LOGIC XỬ LÝ STATUS THEO WORKFLOW THỰC TẾ ===
                    // Status được xác định dựa trên logic nghiệp vụ, không phải random
                    $status = $this->determineDeclarationStatus($idx, $d, $numDeclarations);

                    // Đảm bảo mật độ cây đủ cao để có carbon sequestration có ý nghĩa
                    // Mật độ cây: 120-200 cây/ha (tăng dần theo farm và declaration)
                    $treeDensity = 120 + ($idx * 30) + ($d * 10);

                    // Tính toán carbon performance dựa trên công thức thực tế
                    $riceArea = $farmProfile->rice_area_hectares;
                    $agroArea = $farmProfile->agroforestry_area_hectares;

                    // === India context: AWD and straw management assumptions ===
                    // baselineCH4 = 1.2 tCO₂e/ha/season (methane từ ruộng ngập nước truyền thống)
                    // awdReduction = 0.36 tCO₂e/ha/season (30% giảm methane từ AWD)
                    // strawAvoidance = 0.3 tCO₂e/ha/season (không đốt rơm rạ)
                    // ricePerHa = 0.66 tCO₂e/ha/season (tổng carbon reduction)
                    $ricePerHa = 0.66;
                    $riceTotalReduction = $ricePerHa * $riceArea;

                    // === CÔNG THỨC TÍNH CARBON SEQUESTRATION CHO AGROFORESTRY ===
                    // carbonPerTree = 0.022 tCO₂/cây/năm (theo nghiên cứu)
                    // treesTotal = tổng số cây trên toàn bộ diện tích
                    // 0.5 = hệ số nửa năm (demo data)
                    $treesTotal = $treeDensity * $agroArea;
                    $agroTotalSequestration = $treesTotal * 0.022 * 0.5;

                    // === TÍNH ĐIỂM CARBON PERFORMANCE (CP) ===
                    // riceTarget = 0.8 tCO₂e/ha/season (mục tiêu cho 100 điểm)
                    // agroTarget = 1.5 tCO₂e/ha/năm (mục tiêu cho 100 điểm)
                    $riceTarget = 0.8;
                    $agroTarget = 1.5;

                    // Tính điểm từng loại (tối đa 100 điểm)
                    $cpRice = min(100, ($ricePerHa / $riceTarget) * 100);
                    $cpAgro = min(100, ($agroTotalSequestration / $agroArea / $agroTarget) * 100);

                    // Điểm tổng hợp: 60% lúa + 40% nông lâm (weighted average)
                    $cpTotal = $cpRice * 0.6 + $cpAgro * 0.4;

                    // === TÍNH ĐIỂM MRV RELIABILITY (MR) ===
                    // mrRice: 75-95 điểm (dựa trên ảnh + GPS + nhật ký AWD)
                    // mrAgro: 70-95 điểm (dựa trên ảnh độ che phủ cây theo thời gian)
                    $mrRice = 75 + ($idx % 20);
                    $mrAgro = 70 + ($idx % 25);

                    // Điểm tổng hợp: 50% lúa + 50% nông lâm
                    $mrTotal = $mrRice * 0.5 + $mrAgro * 0.5;

                    // === TÍNH CARBON CREDITS DỰ KIẾN ===
                    // Tổng carbon reduction + sequestration
                    $estimatedCredits = $riceTotalReduction + $agroTotalSequestration;

                    MrvDeclaration::create([
                        'plot_boundary_id' => $plot->id,
                        'farm_profile_id' => $farmProfile->id,
                        'declaration_period' => $quarter,
                        'rice_sowing_date' => date('Y-m-d', strtotime('-' . (90 + $d * 30) . ' days')),
                        'rice_harvest_date' => date('Y-m-d', strtotime('-' . (30 + $d * 30) . ' days')),
                        'awd_cycles_per_season' => 2 + ($idx % 3),
                        'water_management_method' => ['Alternate wetting and drying', 'Canal irrigation', 'Tube well pumping'][$idx % 3],
                        'straw_management' => ['Incorporated', 'Removed', 'Mulched', 'Left on field'][$idx % 4],
                        'tree_density_per_hectare' => $treeDensity,
                        'tree_species' => [
                            ['Neem', 'Acacia', 'Eucalyptus'],
                            ['Bamboo', 'Teak', 'Mahogany'],
                            ['Coconut', 'Mango', 'Jackfruit']
                        ][$idx % 3],
                        'intercrop_species' => [
                            ['Pulses', 'Groundnut', 'Soybeans'],
                            ['Maize', 'Millets', 'Sweet potato'],
                            ['Vegetables', 'Herbs', 'Fruits']
                        ][$idx % 3],
                        'planting_date' => date('Y-m-d', strtotime('-' . (180 + $d * 30) . ' days')),
                        'carbon_performance_score' => round($cpTotal, 2),
                        'mrv_reliability_score' => round($mrTotal, 2),
                        'estimated_carbon_credits' => round($estimatedCredits, 2),
                        'status' => $status,
                    ]);
                }
            }
        }
    }

    private function createEvidenceFiles()
    {
        $mrvDeclarations = MrvDeclaration::all();
        $fileTypes = ['satellite_image', 'field_photo', 'drone_image', 'soil_sample', 'water_sample'];

        foreach ($mrvDeclarations as $idx => $declaration) {
            // Create 2-4 evidence files per declaration
            $numFiles = 2 + ($idx % 3);

            for ($f = 1; $f <= $numFiles; $f++) {
                $fileType = $fileTypes[($idx + $f) % count($fileTypes)];
                // Create placeholder image in storage if not exists
                $dir = 'public/uploads/evidence';
                if (!Storage::exists($dir)) {
                    Storage::makeDirectory($dir);
                }
                $fileName = strtolower($fileType) . '_' . $declaration->id . '_' . $f . '_' . Str::random(6) . '.jpg';
                $relativePath = $dir . '/' . $fileName;
                if (!Storage::exists($relativePath)) {
                    // Generate a simple JPEG placeholder
                    $img = imagecreatetruecolor(800, 600);
                    $bg = imagecolorallocate($img, 240, 248, 255);
                    imagefilledrectangle($img, 0, 0, 800, 600, $bg);
                    $textColor = imagecolorallocate($img, 50, 50, 70);
                    imagestring($img, 5, 20, 20, 'AgriMRV Evidence', $textColor);
                    imagestring($img, 4, 20, 50, strtoupper($fileType), $textColor);
                    imagestring($img, 3, 20, 80, 'Decl ID: ' . $declaration->id, $textColor);
                    ob_start();
                    imagejpeg($img, null, 80);
                    $jpegData = ob_get_clean();
                    imagedestroy($img);
                    Storage::put($relativePath, $jpegData);
                }

                EvidenceFile::create([
                    'mrv_declaration_id' => $declaration->id,
                    'file_type' => $fileType,
                    'file_url' => Storage::url('uploads/evidence/' . $fileName),
                    'file_name' => $fileName,
                    'file_size_bytes' => 1024 * 1024 + ($idx * 100000),
                    'gps_latitude' => 20.0 + ($declaration->id / 1000) + ($f * 0.001),
                    'gps_longitude' => 78.0 + ($declaration->id / 1000) + ($f * 0.001),
                    'capture_timestamp' => date('Y-m-d H:i:s', strtotime('-' . ($f * 2) . ' hours', strtotime($declaration->created_at))),
                    'description' => ucfirst(str_replace('_',' ', $fileType)) . ' for declaration ' . $declaration->id . ' - file ' . $f,
                ]);
            }
        }
    }

    private function createAiAnalysisResults()
    {
        // Sử dụng AI Simulator Service để tạo dữ liệu giả lập thực tế
        $aiSimulator = new \App\Services\AiAnalysisSimulatorService();
        $evidenceFiles = EvidenceFile::all();

        foreach ($evidenceFiles as $evidenceFile) {
            // Giả lập AI analysis cho từng evidence file
            // Service sẽ tự động tạo dữ liệu phân tích dựa trên loại file và metadata
            $aiSimulator->simulateAnalysis($evidenceFile);
        }

        $this->command->info('✅ Đã tạo ' . $evidenceFiles->count() . ' AI analysis results giả lập');
    }

    /**
     * Xác định status của MRV Declaration dựa trên logic nghiệp vụ thực tế
     * Workflow: draft → submitted → verified/rejected
     */
    private function determineDeclarationStatus(int $farmIdx, int $declIdx, int $totalDecls): string
    {
        // Logic: Declaration đầu tiên thường đã được verify
        // Declaration thứ 2 có thể đang pending hoặc verified
        // Declaration thứ 3 thường là draft hoặc mới submitted

        if ($declIdx === 1) {
            // Declaration đầu tiên: 70% verified, 20% pending, 10% rejected
            $rand = rand(1, 100);
            if ($rand <= 70) return 'verified';
            if ($rand <= 90) return 'submitted';
            return 'rejected';
        } elseif ($declIdx === 2) {
            // Declaration thứ 2: 40% verified, 40% pending, 15% draft, 5% rejected
            $rand = rand(1, 100);
            if ($rand <= 40) return 'verified';
            if ($rand <= 80) return 'submitted';
            if ($rand <= 95) return 'draft';
            return 'rejected';
        } else {
            // Declaration thứ 3: 60% draft, 30% submitted, 10% verified
            $rand = rand(1, 100);
            if ($rand <= 60) return 'draft';
            if ($rand <= 90) return 'submitted';
            return 'verified';
        }
    }

    private function createVerificationRecords()
    {
        $verifiers = User::where('user_type', 'verifier')->get();

        // === LOGIC XỬ LÝ VERIFICATION THEO WORKFLOW THỰC TẾ ===
        // Chỉ tạo verification records cho 70% submitted declarations (thực tế không phải tất cả đều được verify)
        $submittedDeclarations = MrvDeclaration::where('status', 'submitted')->get();

        if ($submittedDeclarations->isEmpty()) {
            $this->command->info('⚠️  Không có declarations nào có status "submitted" để tạo verification records');
            return;
        }

        // Chỉ verify 70% submitted declarations (thực tế)
        $declarationsToVerify = $submittedDeclarations->take(ceil($submittedDeclarations->count() * 0.7));

        foreach ($declarationsToVerify as $idx => $declaration) {
            $verifier = $verifiers[$idx % count($verifiers)];
            $verificationType = ['remote', 'field', 'hybrid'][$idx % 3];

            // === XÁC ĐỊNH VERIFICATION STATUS THEO LOGIC NGHIỆP VỤ THỰC TẾ ===
            // 70% approved, 15% pending, 10% requires_revision, 5% rejected
            $verificationStatus = $this->determineVerificationStatus($idx);

            // Tính verification score dựa trên carbon performance và evidence quality
            $baseScore = 70;
            $carbonBonus = min(20, $declaration->carbon_performance_score * 0.2); // Bonus từ carbon performance
            $evidenceBonus = 5 + ($idx % 10); // Bonus từ evidence quality
            $verificationScore = min(100, $baseScore + $carbonBonus + $evidenceBonus);

            VerificationRecord::create([
                'mrv_declaration_id' => $declaration->id,
                'verifier_id' => $verifier->id,
                'verification_type' => $verificationType,
                'verification_date' => date('Y-m-d', strtotime('+' . ($idx * 3) . ' days', strtotime($declaration->created_at))),
                'verification_status' => $verificationStatus,
                'verification_score' => round($verificationScore, 1),
                'field_visit_notes' => $this->generateVerificationNotes($declaration, $verificationType, $verificationStatus),
                'verification_evidence' => [
                    'photos' => ['verification_' . $declaration->id . '_1.jpg', 'verification_' . $declaration->id . '_2.jpg'],
                    'documents' => ['report_' . $declaration->id . '.pdf'],
                    'gps_coordinates' => [10.0 + $idx * 0.001, 105.0 + $idx * 0.001],
                    'evidence_quality_score' => 75 + ($idx % 20)
                ],
                'verifier_comments' => $this->generateVerifierComments($declaration, $verificationStatus, $verificationScore),
            ]);
        }

        $this->command->info('✅ Đã tạo ' . $declarationsToVerify->count() . ' verification records cho ' . ceil($submittedDeclarations->count() * 0.7) . '/' . $submittedDeclarations->count() . ' submitted declarations');

        // === CẬP NHẬT STATUS CỦA MRV DECLARATIONS SAU KHI VERIFY ===
        $this->updateDeclarationStatusesAfterVerification();
    }

    /**
     * Cập nhật status của MRV declarations sau khi có verification records
     * Workflow: submitted → verified (nếu approved) hoặc rejected (nếu rejected)
     */
    private function updateDeclarationStatusesAfterVerification()
    {
        $verificationRecords = VerificationRecord::all();
        $updatedCount = 0;
        $verifiedCount = 0;
        $rejectedCount = 0;

        foreach ($verificationRecords as $verification) {
            $declaration = MrvDeclaration::find($verification->mrv_declaration_id);

            if ($declaration && $declaration->status === 'submitted') {
                if ($verification->verification_status === 'approved') {
                    $declaration->update(['status' => 'verified']);
                    $verifiedCount++;
                    $updatedCount++;
                } elseif ($verification->verification_status === 'rejected') {
                    $declaration->update(['status' => 'rejected']);
                    $rejectedCount++;
                    $updatedCount++;
                }
                // Nếu verification_status là 'pending' hoặc 'requires_revision', giữ nguyên status 'submitted'
            }
        }

        if ($updatedCount > 0) {
            $this->command->info("✅ Đã cập nhật status cho {$updatedCount} MRV declarations sau verification:");
            $this->command->info("   • Verified: {$verifiedCount}");
            $this->command->info("   • Rejected: {$rejectedCount}");
            $this->command->info("   • Vẫn pending/requires_revision: " . ($verificationRecords->count() - $updatedCount));
        }
    }

    /**
     * Xác định verification status dựa trên logic nghiệp vụ thực tế
     */
    private function determineVerificationStatus(int $idx): string
    {
        $rand = rand(1, 100);

        // Thực tế: 70% approved, 15% pending, 10% requires_revision, 5% rejected
        if ($rand <= 70) return 'approved';        // 70% - Đa số được approve
        if ($rand <= 85) return 'pending';         // 15% - Đang chờ xử lý
        if ($rand <= 95) return 'requires_revision'; // 10% - Cần sửa đổi
        return 'rejected';                          // 5% - Bị từ chối
    }

    /**
     * Tạo verification notes dựa trên loại verification và status
     */
    private function generateVerificationNotes($declaration, string $verificationType, string $status): string
    {
        $notes = [
            'remote' => [
                'approved' => 'Remote verification completed successfully. Satellite imagery and documentation reviewed. Carbon practices verified.',
                'pending' => 'Remote verification in progress. Additional documentation requested from farmer.',
                'requires_revision' => 'Remote verification requires revision. Inconsistent data found in evidence files.',
                'rejected' => 'Remote verification failed. Insufficient evidence or non-compliance with standards.'
            ],
            'field' => [
                'approved' => 'Field verification completed successfully. On-site inspection confirmed carbon farming practices.',
                'pending' => 'Field verification scheduled. Awaiting site visit completion.',
                'requires_revision' => 'Field verification requires revision. Minor discrepancies found during site visit.',
                'rejected' => 'Field verification failed. Major non-compliance issues identified during site visit.'
            ],
            'hybrid' => [
                'approved' => 'Hybrid verification completed successfully. Remote and field data consistent.',
                'pending' => 'Hybrid verification in progress. Combining remote and field data analysis.',
                'requires_revision' => 'Hybrid verification requires revision. Data inconsistencies between remote and field sources.',
                'rejected' => 'Hybrid verification failed. Significant discrepancies between remote and field verification.'
            ]
        ];

        return $notes[$verificationType][$status] ?? 'Verification completed for declaration ' . $declaration->id;
    }

    /**
     * Tạo verifier comments dựa trên status và score
     */
    private function generateVerifierComments($declaration, string $status, float $score): string
    {
        $comments = [
            'approved' => "Declaration approved with score {$score}. Carbon practices meet standards. Estimated credits: {$declaration->estimated_carbon_credits} tCO₂e.",
            'pending' => "Verification pending. Score: {$score}. Additional review required before final decision.",
            'requires_revision' => "Declaration requires revision. Score: {$score}. Please address identified issues and resubmit.",
            'rejected' => "Declaration rejected. Score: {$score}. Does not meet verification standards."
        ];

        return $comments[$status] ?? 'Verification completed for declaration ' . $declaration->id;
    }

    private function createCarbonCredits()
    {
        // === LOGIC XỬ LÝ CARBON CREDITS THEO VERIFICATION STATUS ===
        // Chỉ tạo carbon credits cho declarations đã được verify (approved)
        $approvedVerifications = VerificationRecord::where('verification_status', 'approved')->get();

        if ($approvedVerifications->isEmpty()) {
            $this->command->info('⚠️  Không có verification records nào có status "approved" để tạo carbon credits');
            return;
        }

        $issuedCount = 0;
        $soldCount = 0;
        $retiredCount = 0;
        $cancelledCount = 0;

        foreach ($approvedVerifications as $idx => $verification) {
            $declaration = MrvDeclaration::find($verification->mrv_declaration_id);

            if (!$declaration) {
                continue; // Skip nếu không tìm thấy declaration
            }

            // Xác định credit type dựa trên farm profile
            $farmProfile = $declaration->farmProfile;
            $creditType = $this->determineCreditType($farmProfile);

            // === XÁC ĐỊNH CARBON CREDIT STATUS THEO LOGIC NGHIỆP VỤ ===
            // 75% issued, 20% sold, 4% retired, 1% cancelled
            $creditStatus = $this->determineCarbonCreditStatus($idx);

            // Tính credit amount dựa trên verification score và estimated credits
            $baseAmount = $declaration->estimated_carbon_credits;
            $verificationMultiplier = $verification->verification_score / 100; // 0.7-1.0
            $finalAmount = round($baseAmount * $verificationMultiplier, 2);

            // Tính price dựa trên credit type và market conditions
            $basePrice = $this->getBasePriceForCreditType($creditType);
            $pricePerCredit = $basePrice + ($idx % 5); // Variation in price

            $carbonCredit = CarbonCredit::create([
                'mrv_declaration_id' => $verification->mrv_declaration_id,
                'verification_record_id' => $verification->id,
                'credit_amount' => $finalAmount,
                'credit_type' => $creditType,
                'vintage_year' => 2024,
                'certification_standard' => $this->getCertificationStandard($creditType),
                'serial_number' => 'CC-2024-' . str_pad((string)($idx + 1), 5, '0', STR_PAD_LEFT),
                'status' => $creditStatus,
                'price_per_credit' => $pricePerCredit,
                'issued_date' => date('Y-m-d', strtotime('+' . ($idx * 2) . ' days', strtotime($verification->verification_date))),
                'expiry_date' => date('Y-m-d', strtotime('+10 years', strtotime('2024-01-01'))),
            ]);

            // Count by status
            switch ($creditStatus) {
                case 'issued': $issuedCount++; break;
                case 'sold': $soldCount++; break;
                case 'retired': $retiredCount++; break;
                case 'cancelled': $cancelledCount++; break;
            }
        }

        $this->command->info("✅ Đã tạo {$approvedVerifications->count()} carbon credits cho approved verifications:");
        $this->command->info("   • Issued: {$issuedCount}");
        $this->command->info("   • Sold: {$soldCount}");
        $this->command->info("   • Retired: {$retiredCount}");
        $this->command->info("   • Cancelled: {$cancelledCount}");
    }

    /**
     * Xác định carbon credit status dựa trên logic nghiệp vụ thực tế
     */
    private function determineCarbonCreditStatus(int $idx): string
    {
        $rand = rand(1, 100);

        // Thực tế: 75% issued, 20% sold, 4% retired, 1% cancelled
        if ($rand <= 75) return 'issued';      // 75% - Đã phát hành
        if ($rand <= 95) return 'sold';        // 20% - Đã bán
        if ($rand <= 99) return 'retired';     // 4% - Đã rút khỏi thị trường
        return 'cancelled';                     // 1% - Bị hủy bỏ
    }

    /**
     * Xác định credit type dựa trên farm profile
     */
    private function determineCreditType($farmProfile): string
    {
        $riceRatio = $farmProfile->rice_area_hectares / $farmProfile->total_area_hectares;
        $agroRatio = $farmProfile->agroforestry_area_hectares / $farmProfile->total_area_hectares;

        if ($riceRatio > 0.7) {
            return 'rice_cultivation';
        } elseif ($agroRatio > 0.5) {
            return 'agroforestry';
        } else {
            return 'mixed_farming';
        }
    }

    /**
     * Lấy base price cho credit type
     */
    private function getBasePriceForCreditType(string $creditType): int
    {
        $prices = [
            'rice_cultivation' => 15,  // Rice credits thường rẻ hơn
            'agroforestry' => 25,      // Agroforestry credits có giá cao hơn
            'mixed_farming' => 20      // Mixed farming ở giữa
        ];

        return $prices[$creditType] ?? 18;
    }

    /**
     * Lấy certification standard cho credit type
     */
    private function getCertificationStandard(string $creditType): string
    {
        $standards = [
            'rice_cultivation' => 'Gold Standard',  // Rice thường dùng Gold Standard
            'agroforestry' => 'VCS',               // Agroforestry thường dùng VCS
            'mixed_farming' => 'CAR'               // Mixed farming thường dùng CAR
        ];

        return $standards[$creditType] ?? 'Gold Standard';
    }

    private function createCarbonTransactions()
    {
        // === LOGIC XỬ LÝ CARBON TRANSACTIONS THEO CARBON CREDIT STATUS ===
        // Chỉ tạo transactions cho carbon credits có status 'sold'
        $soldCarbonCredits = CarbonCredit::where('status', 'sold')->get();

        if ($soldCarbonCredits->isEmpty()) {
            $this->command->info('⚠️  Không có carbon credits nào có status "sold" để tạo transactions');
            return;
        }

        $farmers = User::where('user_type', 'farmer')->get();
        $buyers = User::where('user_type', 'buyer')->get();

        if ($farmers->isEmpty() || $buyers->isEmpty()) {
            $this->command->info('⚠️  Không có farmers hoặc buyers để tạo carbon transactions');
            return;
        }

        foreach ($soldCarbonCredits as $idx => $credit) {
            $farmer = $farmers[$idx % count($farmers)];
            $buyer = $buyers[$idx % count($buyers)];

            // Tính toán số lượng và tổng tiền giao dịch
            $quantity = min($credit->credit_amount, 8 + ($idx % 7));
            $totalAmount = round($quantity * $credit->price_per_credit, 2);

            CarbonTransaction::create([
                'carbon_credit_id' => $credit->id,
                'seller_id' => $farmer->id,
                'buyer_id' => $buyer->id,
                'quantity' => $quantity,
                'price_per_credit' => $credit->price_per_credit,
                'total_amount' => $totalAmount,
                'transaction_date' => date('Y-m-d', strtotime('+' . ($idx * 2) . ' days', strtotime($credit->issued_date))),
                'payment_status' => 'completed',
                'transaction_hash' => '0x' . substr(md5('transaction_' . $credit->id . '_' . $idx), 0, 40),
            ]);
        }

        $this->command->info('✅ Đã tạo ' . $soldCarbonCredits->count() . ' carbon transactions cho sold carbon credits');
    }

    private function createCooperativeMemberships()
    {
        $coops = User::where('user_type', 'cooperative')->pluck('id')->all();
        if (empty($coops)) return;

        $farmers = User::where('user_type', 'farmer')->get();

        foreach ($farmers as $idx => $farmer) {
            // Gán 60% số farmer vào các cooperative (để có dữ liệu đa dạng)
            if ($idx % 5 < 3) {
                CooperativeMembership::create([
                    'user_id' => $farmer->id,
                    'cooperative_id' => $coops[$idx % count($coops)],
                    'membership_number' => 'COOP-' . date('Y') . '-' . str_pad((string)($idx + 1), 4, '0', STR_PAD_LEFT),
                    'join_date' => date('Y-m-d', strtotime('-' . (365 + $idx * 30) . ' days')),
                    'membership_status' => 'active',
                    'membership_fee_paid' => true,
                ]);
            }
        }
    }

    private function createTrainingRecords()
    {
        $farmers = User::where('user_type', 'farmer')->get();
        $trainingTypes = ['sustainable_farming', 'carbon_farming', 'irrigation_management', 'soil_health', 'crop_diversification'];
        $trainingTitles = [
            'Advanced Rice Cultivation Techniques',
            'Carbon Credit Farming Methods',
            'Efficient Water Management',
            'Soil Health Improvement',
            'Diversified Farming Systems'
        ];

        foreach ($farmers as $idx => $farmer) {
            // Tạo 1-2 training records cho mỗi farmer (để có dữ liệu đa dạng)
            $numTrainings = 1 + ($idx % 2);

            for ($t = 1; $t <= $numTrainings; $t++) {
                $trainingIdx = ($idx + $t) % count($trainingTypes);

                TrainingRecord::create([
                    'user_id' => $farmer->id,
                    'training_type' => $trainingTypes[$trainingIdx],
                    'training_title' => $trainingTitles[$trainingIdx],
                    'completion_date' => date('Y-m-d', strtotime('-' . (30 + $idx * 15) . ' days')),
                    'completion_status' => 'completed',
                    'score' => 80 + ($idx % 20),
                    'certificate_url' => "https://example.com/certificates/farmer_{$farmer->id}_training_{$t}.pdf",
                ]);
            }
        }
    }

    private function createFinancialRecords()
    {
        $farmers = User::where('user_type', 'farmer')->get();
        $banks = User::where('user_type', 'bank')->get();
        $recordTypes = ['carbon_revenue', 'loan', 'payment'];

        foreach ($farmers as $idx => $farmer) {
            $bank = $banks[$idx % count($banks)];

            // Tạo 1-3 financial records cho mỗi farmer (để có dữ liệu đa dạng)
            $numRecords = 1 + ($idx % 3);

            for ($r = 1; $r <= $numRecords; $r++) {
                $recordType = $recordTypes[($idx + $r) % count($recordTypes)];
                // Số tiền khác nhau theo loại record: carbon_revenue thấp hơn, loan/payment cao hơn
                $amount = $recordType === 'carbon_revenue' ? 200 + ($idx * 50) : 1000 + ($idx * 200);

                FinancialRecord::create([
                    'user_id' => $farmer->id,
                    'bank_id' => $bank->id,
                    'record_type' => $recordType,
                    'amount' => $amount,
                    'currency' => 'USD',
                    'transaction_date' => date('Y-m-d', strtotime('-' . ($idx * 15 + $r * 5) . ' days')),
                    'description' => ucfirst($recordType) . ' for farmer ' . $farmer->id . ' - record ' . $r,
                    'status' => 'completed',
                    'reference_number' => 'TXN-' . date('Y') . '-' . str_pad((string)($farmer->id * 100 + $r), 6, '0', STR_PAD_LEFT),
                ]);
            }
        }
    }

    private function createBlockchainAnchors()
    {
        // === TẠO BLOCKCHAIN ANCHORS CHO TẤT CẢ RECORDS ===
        // Anchor cho MRV declarations (để minh bạch và không thể thay đổi)
        foreach (MrvDeclaration::all() as $decl) {
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
                'anchor_timestamp' => date('Y-m-d H:i:s', strtotime('+' . $decl->id . ' minutes', strtotime('2024-01-15 08:00:00'))),
                'verification_url' => 'https://etherscan.io/tx/0x' . substr(sha1('decl' . $decl->id), 0, 40),
            ]);
        }

        // Anchor cho verification records (để đảm bảo tính xác thực của quá trình verify)
        foreach (VerificationRecord::all() as $vr) {
            BlockchainAnchor::create([
                'record_type' => 'verification',
                'record_id' => $vr->id,
                'blockchain_network' => 'Ethereum',
                'transaction_hash' => '0x' . substr(sha1('ver' . $vr->id), 0, 40),
                'block_number' => 18100000 + $vr->id,
                'gas_used' => 22000 + ($vr->id % 100),
                'anchor_data' => [
                    'verification_status' => $vr->verification_status,
                    'verification_type' => $vr->verification_type,
                    'verifier_id' => $vr->verifier_id,
                ],
                'anchor_timestamp' => date('Y-m-d H:i:s', strtotime('+' . $vr->id . ' minutes', strtotime('2024-02-10 09:00:00'))),
                'verification_url' => 'https://etherscan.io/tx/0x' . substr(sha1('ver' . $vr->id), 0, 40),
            ]);
        }

        // Anchor cho carbon credits (để đảm bảo tính minh bạch của carbon market)
        foreach (CarbonCredit::all() as $cc) {
            BlockchainAnchor::create([
                'record_type' => 'carbon_credit',
                'record_id' => $cc->id,
                'blockchain_network' => 'Ethereum',
                'transaction_hash' => '0x' . substr(sha1('cc' . $cc->id), 0, 40),
                'block_number' => 18200000 + $cc->id,
                'gas_used' => 23000 + ($cc->id % 100),
                'anchor_data' => [
                    'serial' => $cc->serial_number,
                    'credit_type' => $cc->credit_type,
                    'amount' => $cc->credit_amount,
                    'status' => $cc->status,
                ],
                'anchor_timestamp' => date('Y-m-d H:i:s', strtotime('+' . $cc->id . ' minutes', strtotime('2024-03-05 10:00:00'))),
                'verification_url' => 'https://etherscan.io/tx/0x' . substr(sha1('cc' . $cc->id), 0, 40),
            ]);
        }
    }
}
