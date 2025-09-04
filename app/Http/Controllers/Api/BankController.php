<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FinancialRecord;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class BankController extends Controller
{
    use ApiResponseTrait;

    public function loanApplications(Request $request)
    {
        $bank = $request->user();

        // Mock loan applications data
        $applications = [
            [
                'id' => 1,
                'farmer' => ['full_name' => 'Nguyen Van A', 'location' => 'Hanoi, Vietnam'],
                'amount' => 15000,
                'purpose' => 'Rice farming equipment',
                'risk_score' => 35.5,
                'carbon_credits' => 12.5,
                'status' => 'pending',
                'created_at' => now()->subDays(2)
            ],
            [
                'id' => 2,
                'farmer' => ['full_name' => 'Tran Thi B', 'location' => 'Ho Chi Minh, Vietnam'],
                'amount' => 25000,
                'purpose' => 'Agroforestry expansion',
                'risk_score' => 65.8,
                'carbon_credits' => 8.2,
                'status' => 'pending',
                'created_at' => now()->subDays(1)
            ],
            [
                'id' => 3,
                'farmer' => ['full_name' => 'Le Van C', 'location' => 'Da Nang, Vietnam'],
                'amount' => 18000,
                'purpose' => 'Sustainable farming practices',
                'risk_score' => 28.2,
                'carbon_credits' => 15.8,
                'status' => 'approved',
                'created_at' => now()->subDays(3)
            ],
            [
                'id' => 4,
                'farmer' => ['full_name' => 'Pham Thi D', 'location' => 'Can Tho, Vietnam'],
                'amount' => 32000,
                'purpose' => 'Farm infrastructure',
                'risk_score' => 75.5,
                'carbon_credits' => 6.5,
                'status' => 'pending',
                'created_at' => now()->subHours(12)
            ],
            [
                'id' => 5,
                'farmer' => ['full_name' => 'Hoang Van E', 'location' => 'Hue, Vietnam'],
                'amount' => 12000,
                'purpose' => 'Organic certification',
                'risk_score' => 42.1,
                'carbon_credits' => 18.2,
                'status' => 'active',
                'created_at' => now()->subDays(5)
            ]
        ];

        return $this->success(['applications' => $applications]);
    }

    public function approveLoan(Request $request, $recordId)
    {
        $request->validate([
            'interest_rate' => ['required', 'numeric', 'min:0', 'max:30'],
            'loan_term' => ['required', 'integer', 'min:1', 'max:60'],
            'comments' => ['nullable', 'string']
        ]);

        // Mock approval response
        $response = [
            'id' => $recordId,
            'status' => 'approved',
            'interest_rate' => $request->input('interest_rate'),
            'loan_term' => $request->input('loan_term'),
            'comments' => $request->input('comments'),
            'approved_at' => now(),
            'approved_by' => $request->user()->full_name ?? 'Banker'
        ];

        return $this->success($response, 'Loan approved successfully');
    }

    public function portfolio(Request $request)
    {
        $bank = $request->user();

        // Mock portfolio data
        $portfolio = [
            'total_value' => 2500000,
            'active_loans' => 1250,
            'monthly_returns' => 8.5,
            'risk_score' => 45.2,
            'investments' => [
                [
                    'id' => 1,
                    'farmer' => ['full_name' => 'Nguyen Van A', 'location' => 'Hanoi'],
                    'amount' => 15000,
                    'interest_rate' => 8.5,
                    'term' => 12,
                    'remaining_months' => 8,
                    'status' => 'active'
                ],
                [
                    'id' => 2,
                    'farmer' => ['full_name' => 'Tran Thi B', 'location' => 'Ho Chi Minh'],
                    'amount' => 25000,
                    'interest_rate' => 9.0,
                    'term' => 18,
                    'remaining_months' => 12,
                    'status' => 'active'
                ]
            ],
            'risk_analysis' => [
                'total' => 100,
                'low_risk' => 60,
                'medium_risk' => 30,
                'high_risk' => 10
            ],
            'recent_activity' => [
                [
                    'type' => 'loan_approved',
                    'title' => 'Loan Approved',
                    'message' => 'Loan for Nguyen Van C has been approved',
                    'created_at' => now()->subHours(2)
                ],
                [
                    'type' => 'payment_received',
                    'title' => 'Payment Received',
                    'message' => 'Payment received from Tran Thi D',
                    'created_at' => now()->subHours(5)
                ]
            ]
        ];

        return $this->success($portfolio);
    }

    public function riskAssessment(Request $request)
    {
        // Mock risk assessment data
        $riskData = [
            'overall_risk_score' => 45.2,
            'high_risk_loans' => 25,
            'default_rate' => 3.2,
            'risk_alerts' => 5,
            'assessments' => [
                [
                    'id' => 1,
                    'farmer' => ['full_name' => 'Nguyen Van A', 'location' => 'Hanoi'],
                    'loan_amount' => 15000,
                    'risk_score' => 35.5,
                    'carbon_credits' => 12.5,
                    'farm_score' => 85.2,
                    'recommendation' => 'approve'
                ],
                [
                    'id' => 2,
                    'farmer' => ['full_name' => 'Tran Thi B', 'location' => 'Ho Chi Minh'],
                    'loan_amount' => 25000,
                    'risk_score' => 65.8,
                    'carbon_credits' => 8.2,
                    'farm_score' => 72.1,
                    'recommendation' => 'approve_with_conditions'
                ]
            ],
            'alerts' => [
                [
                    'severity' => 'high',
                    'title' => 'High Risk Loan Detected',
                    'message' => 'Loan application #LA003 has a risk score of 85.2',
                    'created_at' => now()->subHours(1)
                ],
                [
                    'severity' => 'medium',
                    'title' => 'Payment Overdue',
                    'message' => 'Payment overdue for loan #LA001',
                    'created_at' => now()->subHours(3)
                ]
            ]
        ];

        return $this->success($riskData);
    }

    public function reports(Request $request)
    {
        // Mock reports data
        $reports = [
            'reports' => [
                [
                    'id' => 1,
                    'name' => 'Monthly Financial Report',
                    'description' => 'Comprehensive financial performance report',
                    'type' => 'financial',
                    'created_at' => now()->subDays(1),
                    'size' => 1024000,
                    'status' => 'completed'
                ],
                [
                    'id' => 2,
                    'name' => 'Risk Assessment Report',
                    'description' => 'Portfolio risk analysis and recommendations',
                    'type' => 'risk',
                    'created_at' => now()->subDays(3),
                    'size' => 512000,
                    'status' => 'completed'
                ],
                [
                    'id' => 3,
                    'name' => 'Loan Portfolio Analysis',
                    'description' => 'Detailed analysis of loan portfolio performance',
                    'type' => 'portfolio',
                    'created_at' => now()->subDays(7),
                    'size' => 2048000,
                    'status' => 'completed'
                ]
            ]
        ];

        return $this->success($reports);
    }

    public function analytics(Request $request)
    {
        // Mock analytics data
        $analytics = [
            'total_revenue' => 2500000,
            'roi' => 12.5,
            'customer_growth' => 15.2,
            'market_share' => 8.7
        ];

        return $this->success($analytics);
    }

    public function rejectLoan(Request $request, $recordId)
    {
        $request->validate([
            'reason' => ['required', 'string', 'min:10'],
            'comments' => ['nullable', 'string']
        ]);

        // Mock rejection response
        $response = [
            'id' => $recordId,
            'status' => 'rejected',
            'rejection_reason' => $request->input('reason'),
            'rejection_comments' => $request->input('comments'),
            'rejected_at' => now(),
            'rejected_by' => $request->user()->full_name ?? 'Banker'
        ];

        return $this->success($response, 'Loan rejected successfully');
    }

    public function requestInfo(Request $request, $recordId)
    {
        $request->validate([
            'info_request' => ['required', 'string']
        ]);

        // Mock info request response
        $response = [
            'id' => $recordId,
            'info_request' => $request->input('info_request'),
            'requested_at' => now(),
            'requested_by' => $request->user()->full_name ?? 'Banker'
        ];

        return $this->success($response, 'Information request sent successfully');
    }

    public function createLoanApplication(Request $request)
    {
        $request->validate([
            'farmer_id' => ['required', 'string'],
            'amount' => ['required', 'integer', 'min:1000000'],
            'purpose' => ['required', 'string'],
            'notes' => ['nullable', 'string']
        ]);

        $banker = $request->user();

        // Mock loan application creation
        $loanApplication = [
            'id' => rand(1000, 9999),
            'farmer_id' => $request->input('farmer_id'),
            'banker_id' => $banker->id,
            'amount' => $request->input('amount'),
            'purpose' => $request->input('purpose'),
            'notes' => $request->input('notes'),
            'status' => 'pending',
            'created_at' => now(),
            'created_by' => $banker->full_name ?? 'Banker'
        ];

        return $this->success($loanApplication, 'Loan application created successfully');
    }
}


