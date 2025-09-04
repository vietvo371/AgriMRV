@extends('share.Banker.master')

@section('title')
    <div>
        <h1 class="mb-1">Portfolio Management</h1>
        <p class="text-muted">Manage investment portfolio and track performance</p>
    </div>
@endsection

@section('content')
<div class="row g-3 mb-4">
    <!-- Portfolio Overview -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Total Portfolio Value</span>
                <div class="stat-card-icon primary"><i class="fa fa-briefcase"></i></div>
            </div>
            <div class="stat-value" id="totalValue">$0</div>
            <div class="stat-label">Current value</div>
        </div>
    </div>

    <!-- Active Loans -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Active Loans</span>
                <div class="stat-card-icon success"><i class="fa fa-hand-holding-usd"></i></div>
            </div>
            <div class="stat-value" id="activeLoans">0</div>
            <div class="stat-label">Currently active</div>
        </div>
    </div>

    <!-- Monthly Returns -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Monthly Returns</span>
                <div class="stat-card-icon info"><i class="fa fa-chart-line"></i></div>
            </div>
            <div class="stat-value" id="monthlyReturns">0%</div>
            <div class="stat-label">This month</div>
        </div>
    </div>

    <!-- Risk Level -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Portfolio Risk</span>
                <div class="stat-card-icon warning"><i class="fa fa-shield-alt"></i></div>
            </div>
            <div class="stat-value" id="portfolioRisk">0</div>
            <div class="stat-label">Risk score</div>
        </div>
    </div>
</div>

<!-- Portfolio Performance Chart -->
<div class="row g-3 mb-4">
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Portfolio Performance</h5>
            </div>
            <div class="card-body">
                <canvas id="portfolioChart" height="100"></canvas>
            </div>
        </div>
    </div>
</div>

<!-- Portfolio Breakdown -->
<div class="row g-3 mb-4">
    <div class="col-md-8">
        <div class="table-card">
            <div class="table-card-header">
                <h5 class="mb-0">Active Investments</h5>
            </div>
            <div class="table-responsive">
                <table class="table mb-0">
                    <thead>
                        <tr>
                            <th>Farmer</th>
                            <th>Loan Amount</th>
                            <th>Interest Rate</th>
                            <th>Term</th>
                            <th>Remaining</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="investmentsTableBody">
                        <tr>
                            <td colspan="7" class="text-center text-muted">Loading...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="col-md-4">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Portfolio Distribution</h5>
            </div>
            <div class="card-body">
                <canvas id="distributionChart" height="200"></canvas>
            </div>
        </div>
    </div>
</div>

<!-- Risk Analysis -->
<div class="row g-3 mb-4">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Risk Analysis</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <div class="d-flex justify-content-between">
                        <span>Low Risk</span>
                        <span id="lowRiskCount">0</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-success" id="lowRiskBar" style="width: 0%"></div>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="d-flex justify-content-between">
                        <span>Medium Risk</span>
                        <span id="mediumRiskCount">0</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-warning" id="mediumRiskBar" style="width: 0%"></div>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="d-flex justify-content-between">
                        <span>High Risk</span>
                        <span id="highRiskCount">0</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-danger" id="highRiskBar" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Recent Activity</h5>
            </div>
            <div class="card-body">
                <div id="recentActivity">
                    <div class="text-center text-muted">Loading recent activity...</div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('js')
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Set up axios with CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    }

    loadPortfolioData();
    initializeCharts();

    async function loadPortfolioData() {
        try {
            const response = await axios.get('/banker/api/portfolio');
            const portfolio = response.data.data || {};

            updatePortfolioStats(portfolio);
            updateInvestmentsTable(portfolio.investments || []);
            updateRiskAnalysis(portfolio.risk_analysis || {});
            updateRecentActivity(portfolio.recent_activity || []);

        } catch (error) {
            console.error('Error loading portfolio data:', error);
            showError('Cannot load portfolio data');
        }
    }

    function updatePortfolioStats(portfolio) {
        document.getElementById('totalValue').textContent = `$${(portfolio.total_value || 0).toLocaleString()}`;
        document.getElementById('activeLoans').textContent = portfolio.active_loans || 0;
        document.getElementById('monthlyReturns').textContent = `${(portfolio.monthly_returns || 0).toFixed(2)}%`;
        document.getElementById('portfolioRisk').textContent = (portfolio.risk_score || 0).toFixed(1);
    }

    function updateInvestmentsTable(investments) {
        const tbody = document.getElementById('investmentsTableBody');

        if (investments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Không có investments</td></tr>';
            return;
        }

        tbody.innerHTML = investments.map(investment => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="user-avatar me-2" style="width: 35px; height: 35px; font-size: 12px;">
                            ${getInitials(investment.farmer?.full_name || 'Unknown')}
                        </div>
                        <div>
                            <div class="fw-bold">${investment.farmer?.full_name || 'Unknown'}</div>
                            <small class="text-muted">${investment.farmer?.location || 'Unknown Location'}</small>
                        </div>
                    </div>
                </td>
                <td>$${Number(investment.amount || 0).toLocaleString()}</td>
                <td>${(investment.interest_rate || 0).toFixed(2)}%</td>
                <td>${investment.term || 0} months</td>
                <td>${investment.remaining_months || 0} months</td>
                <td>
                    <span class="badge ${getStatusClass(investment.status)}">
                        ${getStatusText(investment.status)}
                    </span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary" data-action="view" data-id="${investment.id}">
                            <i class="fa fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-primary" data-action="details" data-id="${investment.id}">
                            <i class="fa fa-info"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Add event delegation
        document.getElementById('investmentsTableBody').addEventListener('click', function(e) {
            const button = e.target.closest('button[data-action]');
            if (!button) return;

            const action = button.getAttribute('data-action');
            const investmentId = parseInt(button.getAttribute('data-id'));

            switch(action) {
                case 'view':
                    viewInvestment(investmentId);
                    break;
                case 'details':
                    showInvestmentDetails(investmentId);
                    break;
            }
        });
    }

    function updateRiskAnalysis(riskAnalysis) {
        const total = riskAnalysis.total || 1;
        const lowRisk = riskAnalysis.low_risk || 0;
        const mediumRisk = riskAnalysis.medium_risk || 0;
        const highRisk = riskAnalysis.high_risk || 0;

        document.getElementById('lowRiskCount').textContent = lowRisk;
        document.getElementById('mediumRiskCount').textContent = mediumRisk;
        document.getElementById('highRiskCount').textContent = highRisk;

        document.getElementById('lowRiskBar').style.width = `${(lowRisk / total) * 100}%`;
        document.getElementById('mediumRiskBar').style.width = `${(mediumRisk / total) * 100}%`;
        document.getElementById('highRiskBar').style.width = `${(highRisk / total) * 100}%`;
    }

    function updateRecentActivity(activities) {
        const container = document.getElementById('recentActivity');

        if (activities.length === 0) {
            container.innerHTML = '<div class="text-center text-muted">No recent activity</div>';
            return;
        }

        container.innerHTML = activities.map(activity => `
            <div class="d-flex align-items-center mb-3">
                <div class="me-3">
                    <i class="fa ${getActivityIcon(activity.type)} text-primary"></i>
                </div>
                <div class="flex-grow-1">
                    <div class="fw-bold">${activity.title}</div>
                    <small class="text-muted">${formatDate(activity.created_at)}</small>
                </div>
                <div class="text-end">
                    <span class="badge ${getActivityBadgeClass(activity.type)}">${activity.type}</span>
                </div>
            </div>
        `).join('');
    }

    function initializeCharts() {
        // Portfolio Performance Chart
        const portfolioCtx = document.getElementById('portfolioChart').getContext('2d');
        new Chart(portfolioCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Portfolio Value',
                    data: [100000, 105000, 110000, 108000, 115000, 120000],
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });

        // Portfolio Distribution Chart
        const distributionCtx = document.getElementById('distributionChart').getContext('2d');
        new Chart(distributionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Low Risk', 'Medium Risk', 'High Risk'],
                datasets: [{
                    data: [60, 30, 10],
                    backgroundColor: ['#28a745', '#ffc107', '#dc3545']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Helper functions
    function getInitials(name) {
        return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 3);
    }

    function getStatusClass(status) {
        const classes = {
            'active': 'bg-success',
            'completed': 'bg-info',
            'default': 'bg-warning',
            'overdue': 'bg-danger'
        };
        return classes[status] || 'bg-secondary';
    }

    function getStatusText(status) {
        const texts = {
            'active': 'Active',
            'completed': 'Completed',
            'default': 'Default',
            'overdue': 'Overdue'
        };
        return texts[status] || status;
    }

    function getActivityIcon(type) {
        const icons = {
            'loan_approved': 'fa-check-circle',
            'payment_received': 'fa-money-bill-wave',
            'loan_completed': 'fa-flag-checkered',
            'default': 'fa-info-circle'
        };
        return icons[type] || icons.default;
    }

    function getActivityBadgeClass(type) {
        const classes = {
            'loan_approved': 'bg-success',
            'payment_received': 'bg-primary',
            'loan_completed': 'bg-info',
            'default': 'bg-secondary'
        };
        return classes[type] || classes.default;
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }

    function viewInvestment(investmentId) {
        Swal.fire('View Investment', `Viewing investment ID: ${investmentId}`, 'info');
    }

    function showInvestmentDetails(investmentId) {
        Swal.fire('Investment Details', `Details for investment ID: ${investmentId}`, 'info');
    }

    function showError(message) {
        Swal.fire('Lỗi', message, 'error');
    }
});
</script>
@endsection
