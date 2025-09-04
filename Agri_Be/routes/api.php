<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FarmProfileController;
use App\Http\Controllers\Api\MrvDeclarationController;
use App\Http\Controllers\Api\VerificationController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PlotController;
use App\Http\Controllers\Api\AiAnalysisController;
use App\Http\Controllers\Api\CreditController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ProfileShareController;
use App\Http\Controllers\Api\Admin\CarbonPriceController;
use App\Http\Controllers\Api\CooperativeController;
use App\Http\Controllers\Api\VerifierController;
use App\Http\Controllers\Api\BankController;
use App\Http\Controllers\Api\GovernmentController;
use App\Http\Controllers\Api\BuyerController;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('web-login', [AuthController::class, 'webLogin']); // New web login method
    Route::post('request-otp', [AuthController::class, 'requestOtp']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('user', [AuthController::class, 'user']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});
Route::middleware('auth:sanctum')->get('check-login', [AuthController::class, 'checkLogin']);


// Protected routes scaffold (controllers will be added next)
Route::middleware('auth:sanctum')->group(function () {
    // Farm & Plot
    Route::apiResource('farm-profiles', FarmProfileController::class);

    // MRV Declaration
    Route::apiResource('mrv-declarations', MrvDeclarationController::class)->only(['index','store','show','update']);

    // Verification (admin or verifier)
    Route::post('verifications', [VerificationController::class, 'store'])->middleware('role:admin,verifier');

    // Dashboard
    Route::get('dashboard/summary', [PlotController::class, 'summary']);
    Route::get('dashboard/mrv-overview', [PlotController::class, 'mrvOverview']);
    Route::get('dashboard/land-plots', [PlotController::class, 'landPlots']);
    Route::get('dashboard/land-plots/{plot}', [PlotController::class, 'landPlotDetail']);
    Route::get('dashboard/statistics', [PlotController::class, 'statistics']);
    Route::post('dashboard/land-plots', [PlotController::class, 'createPlot']);
    Route::put('dashboard/land-plots/{plot}', [PlotController::class, 'updatePlot']);
    Route::delete('dashboard/land-plots/{plot}', [PlotController::class, 'deletePlot']);

    // AI Analyses
    Route::get('ai/analyses', [AiAnalysisController::class, 'index']);
    Route::get('ai/analyses/stats', [AiAnalysisController::class, 'stats']);
    Route::get('ai/analyses/{id}', [AiAnalysisController::class, 'show']);
    Route::post('ai/analyses/{id}/refresh', [AiAnalysisController::class, 'refresh']);
    Route::get('ai/analyses/{id}/report', [AiAnalysisController::class, 'report']);
    Route::post('ai/analyses/{id}/share', [AiAnalysisController::class, 'share']);
    // Credit & Scoring APIs
    Route::get('credit/profile', [CreditController::class, 'profile']);
    Route::get('credit/mrv-data', [CreditController::class, 'mrvData']);
    Route::get('credit/score-history', [CreditController::class, 'scoreHistory']);
    Route::get('credit/score-breakdown', [CreditController::class, 'scoreBreakdown']);
    Route::get('credit/monthly-change', [CreditController::class, 'monthlyChange']);




    // Finance & Portfolio APIs
    Route::get('finance/portfolio', [FinanceController::class, 'portfolio']);
    Route::get('finance/verification-pipeline', [FinanceController::class, 'verificationPipeline']);
    Route::get('finance/payment-history', [FinanceController::class, 'paymentHistory']);
    Route::get('finance/projected-earnings', [FinanceController::class, 'projectedEarnings']);
    Route::get('finance/performance-metrics', [FinanceController::class, 'performanceMetrics']);

    // Profile & User Management APIs
    Route::get('profile/user', [ProfileController::class, 'user']);
    Route::get('profile/farm-stats', [ProfileController::class, 'farmStats']);
    Route::get('profile/land-plots', [ProfileController::class, 'landPlots']);
    Route::get('profile/yield-history', [ProfileController::class, 'yieldHistory']);
    Route::get('profile/memberships', [ProfileController::class, 'memberships']);
    Route::get('profile/loan-history', [ProfileController::class, 'loanHistory']);

    // Profile Share APIs
    Route::post('profile/share/generate', [ProfileShareController::class, 'generateShareCode']);
    Route::get('profile/share/my-shares', [ProfileShareController::class, 'getMyShares']);
    Route::post('profile/share/{shareCode}/deactivate', [ProfileShareController::class, 'deactivateShare']);

    // Cooperative APIs
    Route::middleware('role:cooperative')->prefix('cooperative')->group(function () {
        Route::get('members', [CooperativeController::class, 'members']);
        Route::get('stats', [CooperativeController::class, 'stats']);
    });

    // Verifier APIs
    Route::middleware('role:verifier')->prefix('verifier')->group(function () {
        Route::get('queue', [VerifierController::class, 'queue']);
        Route::get('my-verifications', [VerifierController::class, 'myVerifications']);
        Route::get('analytics', [VerifierController::class, 'analytics']);
        Route::get('ai-insights', [VerifierController::class, 'aiInsights']);
        Route::get('requests/{id}/detail', [VerifierController::class, 'requestDetail']);

        // Actions: draft -> submitted -> verified/rejected
        Route::post('declarations/{id}/submit', [VerifierController::class, 'submitDeclaration']);
        Route::post('declarations/{id}/schedule', [VerifierController::class, 'scheduleFieldVisit']);
        Route::post('declarations/{id}/request-revision', [VerifierController::class, 'requestRevision']);
        Route::post('declarations/{id}/approve', [VerifierController::class, 'approveDeclaration']);
        Route::post('declarations/{id}/reject', [VerifierController::class, 'rejectDeclaration']);
    });

    // Test route without middleware
    Route::get('test', function () {
        return response()->json(['message' => 'API is working']);
    });

    // Test route with auth middleware
    Route::middleware('auth:sanctum')->get('test-auth', function () {
        return response()->json(['message' => 'Auth test successful', 'user' => request()->user()]);
    });

    // Bank APIs
    Route::middleware('role:bank')->prefix('bank')->group(function () {
        Route::get('loan-applications', [BankController::class, 'loanApplications']);
        Route::post('loans/{record}/approve', [BankController::class, 'approveLoan']);
    });

    // Government APIs
    Route::middleware('role:government')->prefix('government')->group(function () {
        Route::get('registry', [GovernmentController::class, 'registry']);
        Route::get('anchors', [GovernmentController::class, 'anchors']);
    });

    // Buyer APIs
    Route::middleware('role:buyer')->prefix('buyer')->group(function () {
        Route::get('marketplace', [BuyerController::class, 'marketplace']);
        Route::post('purchase/{credit}', [BuyerController::class, 'purchase']);
    });
});

// Admin Carbon Price Management APIs (chỉ admin mới được truy cập)
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin/carbon-price')->group(function () {
    Route::get('current', [CarbonPriceController::class, 'getCurrentPrice']);
    Route::post('update', [CarbonPriceController::class, 'updatePrice']);
    Route::get('history', [CarbonPriceController::class, 'getPriceHistory']);
    Route::post('refresh', [CarbonPriceController::class, 'refreshPrice']);
    Route::get('stats', [CarbonPriceController::class, 'getPriceStats']);
});

// Public signed share link
Route::get('share/ai/{id}', [AiAnalysisController::class, 'sharedShow'])->name('ai.share')->middleware('signed');

// Public Profile Share routes (không cần authentication)
Route::get('profile/share/{shareCode}', [ProfileShareController::class, 'getSharedProfile']);
Route::post('profile/share/{shareCode}/copy', [ProfileShareController::class, 'copyShareLink']);
Route::get('profile/share/{shareCode}/credit-data', [ProfileShareController::class, 'getCreditData']);


