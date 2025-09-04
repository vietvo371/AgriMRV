<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VerifierController;

Route::get('/', function () {
    return view('welcome');
});



Route::get('/login', [AuthController::class, 'loginView'])->name('login');

Route::post('login', [AuthController::class, 'actionLogin'])->name('login.post');

Route::post('logout', function (Request $request) {
    Auth::logout();

    // Invalidate session and regenerate CSRF token
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect()->route('login')->with('success', 'Đăng xuất thành công');
})->name('logout');

// Role landing pages (với authentication check)
Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/cooperative', function () {
        return view('page.Cooper.index');
    })->name('cooperative');

    Route::get('/dashboard', function () {
        return view('page.Dashboard.index');
    })->name('dashboard');

    // Verifier routes - Sử dụng VerifierController với middleware tùy chỉnh
    Route::prefix('verifier')->name('verifier.')->middleware('verifier')->group(function () {
        Route::get('/', [App\Http\Controllers\VerifierController::class, 'dashboard'])->name('dashboard');
        Route::get('/schedule', [App\Http\Controllers\VerifierController::class, 'schedule'])->name('schedule');
        Route::get('/request', [App\Http\Controllers\VerifierController::class, 'requests'])->name('request');
        // View detail page
        Route::get('/request/{id}', [App\Http\Controllers\VerifierController::class, 'requestDetail'])->name('request.show');
        Route::get('/reports', [App\Http\Controllers\VerifierController::class, 'reports'])->name('reports');
        Route::get('/analytics', [App\Http\Controllers\VerifierController::class, 'analytics'])->name('analytics');

        // Web API routes for verifier (session authentication)
        Route::get('/api/queue', [App\Http\Controllers\Api\VerifierController::class, 'queue'])->name('api.queue');
        Route::get('/api/my-verifications', [App\Http\Controllers\Api\VerifierController::class, 'myVerifications'])->name('api.my-verifications');
        Route::get('/api/analytics', [App\Http\Controllers\Api\VerifierController::class, 'analytics'])->name('api.analytics');
        Route::get('/api/ai-insights', [App\Http\Controllers\Api\VerifierController::class, 'aiInsights'])->name('api.ai-insights');
        Route::get('/api/request/detail/{id}', [App\Http\Controllers\Api\VerifierController::class, 'requestDetail'])->name('api.request.detail');

        // Verifier action routes
        Route::post('/api/declarations/{id}/submit', [App\Http\Controllers\Api\VerifierController::class, 'submitDeclaration'])->name('api.declarations.submit');
        Route::post('/api/declarations/{id}/schedule', [App\Http\Controllers\Api\VerifierController::class, 'scheduleFieldVisit'])->name('api.declarations.schedule');
        Route::post('/api/declarations/{id}/request-revision', [App\Http\Controllers\Api\VerifierController::class, 'requestRevision'])->name('api.declarations.request-revision');
        Route::post('/api/declarations/{id}/approve', [App\Http\Controllers\Api\VerifierController::class, 'approveDeclaration'])->name('api.declarations.approve');
        Route::post('/api/declarations/{id}/reject', [App\Http\Controllers\Api\VerifierController::class, 'rejectDeclaration'])->name('api.declarations.reject');
    });




    // Banker routes - Sử dụng BankerController với middleware tùy chỉnh
    Route::prefix('banker')->name('banker.')->group(function () {
        Route::get('/', [App\Http\Controllers\BankerController::class, 'dashboard'])->name('dashboard');
        Route::get('/loan-applications', [App\Http\Controllers\BankerController::class, 'loanApplications'])->name('loan-applications');
        Route::get('/portfolio', [App\Http\Controllers\BankerController::class, 'portfolio'])->name('portfolio');
        Route::get('/risk-assessment', [App\Http\Controllers\BankerController::class, 'riskAssessment'])->name('risk-assessment');
        Route::get('/reports', [App\Http\Controllers\BankerController::class, 'reports'])->name('reports');
        Route::get('/analytics', [App\Http\Controllers\BankerController::class, 'analytics'])->name('analytics');
        Route::get('/settings', [App\Http\Controllers\BankerController::class, 'settings'])->name('settings');
        Route::get('/profile', [App\Http\Controllers\BankerController::class, 'profile'])->name('profile');
        Route::get('/share-profile', [App\Http\Controllers\BankerController::class, 'shareProfile'])->name('share-profile');

        // Web API routes for banker (session authentication)
        Route::get('/api/loan-applications', [App\Http\Controllers\Api\BankController::class, 'loanApplications'])->name('api.loan-applications');
        Route::get('/api/portfolio', [App\Http\Controllers\Api\BankController::class, 'portfolio'])->name('api.portfolio');
        Route::get('/api/risk-assessment', [App\Http\Controllers\Api\BankController::class, 'riskAssessment'])->name('api.risk-assessment');
        Route::get('/api/reports', [App\Http\Controllers\Api\BankController::class, 'reports'])->name('api.reports');
        Route::get('/api/analytics', [App\Http\Controllers\Api\BankController::class, 'analytics'])->name('api.analytics');

                    // Banker action routes
            Route::post('/api/loans/{record}/approve', [App\Http\Controllers\Api\BankController::class, 'approveLoan'])->name('api.loans.approve');
            Route::post('/api/loans/{record}/reject', [App\Http\Controllers\Api\BankController::class, 'rejectLoan'])->name('api.loans.reject');
            Route::post('/api/loans/{record}/request-info', [App\Http\Controllers\Api\BankController::class, 'requestInfo'])->name('api.loans.request-info');
            Route::post('/api/loan-applications', [App\Http\Controllers\Api\BankController::class, 'createLoanApplication'])->name('api.loan-applications.create');
    });

    // Legacy bank route (redirect to new banker system)
    Route::get('/bank', function () {
        return redirect()->route('banker.dashboard');
    })->name('bank');
    Route::get('/government', function () {
        return view('page.Admin.index');
    })->name('government');
    Route::get('/buyer', function () {
        return view('page.Buyer.index');
    })->name('buyer');

    // Remove duplicate GET /logout; use POST /logout above.
});
