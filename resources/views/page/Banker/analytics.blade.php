@extends('share.Banker.master')

@section('title')
    <div>
        <h1 class="mb-1">Analytics</h1>
        <p class="text-muted">Analyze financial data and statistics</p>
    </div>
@endsection

@section('content')
<!-- Analytics Overview -->
<div class="row g-3 mb-4">
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Total Revenue</span>
                <div class="stat-card-icon success"><i class="fa fa-dollar-sign"></i></div>
            </div>
            <div class="stat-value" id="totalRevenue">$0</div>
            <div class="stat-label">This year</div>
        </div>
    </div>

    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>ROI</span>
                <div class="stat-card-icon primary"><i class="fa fa-chart-line"></i></div>
            </div>
            <div class="stat-value" id="roi">0%</div>
            <div class="stat-label">Return on investment</div>
        </div>
    </div>

    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Customer Growth</span>
                <div class="stat-card-icon info"><i class="fa fa-users"></i></div>
            </div>
            <div class="stat-value" id="customerGrowth">0%</div>
            <div class="stat-label">Monthly growth</div>
        </div>
    </div>

    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Market Share</span>
                <div class="stat-card-icon warning"><i class="fa fa-chart-pie"></i></div>
            </div>
            <div class="stat-value" id="marketShare">0%</div>
            <div class="stat-label">In agricultural loans</div>
        </div>
    </div>
</div>

<!-- Analytics Charts -->
<div class="row g-3 mb-4">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Revenue Trends</h5>
            </div>
            <div class="card-body">
                <canvas id="revenueChart" height="100"></canvas>
            </div>
        </div>
    </div>

    <div class="col-md-4">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Loan Distribution</h5>
            </div>
            <div class="card-body">
                <canvas id="loanDistributionChart" height="200"></canvas>
            </div>
        </div>
    </div>
</div>

<!-- Performance Metrics -->
<div class="row g-3 mb-4">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Performance Metrics</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <div class="d-flex justify-content-between">
                        <span>Loan Approval Rate</span>
                        <span class="fw-bold text-success">85%</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-success" style="width: 85%"></div>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="d-flex justify-content-between">
                        <span>Default Rate</span>
                        <span class="fw-bold text-danger">3.2%</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-danger" style="width: 3.2%"></div>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="d-flex justify-content-between">
                        <span>Customer Satisfaction</span>
                        <span class="fw-bold text-primary">92%</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-primary" style="width: 92%"></div>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="d-flex justify-content-between">
                        <span>Processing Time</span>
                        <span class="fw-bold text-info">2.5 days</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-info" style="width: 75%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Geographic Distribution</h5>
            </div>
            <div class="card-body">
                <canvas id="geographicChart" height="200"></canvas>
            </div>
        </div>
    </div>
</div>

<!-- Detailed Analytics -->
<div class="row g-3 mb-4">
    <div class="col-12">
        <div class="table-card">
            <div class="table-card-header d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="mb-0">Analytics Dashboard</h5>
                    <p class="text-muted mb-0">Detailed analytics and insights</p>
                </div>
                <div class="btn-group btn-group-sm">
                    <button onclick="refreshAnalytics()" class="btn btn-outline-primary">
                        <i class="fa fa-rotate"></i> Refresh
                    </button>
                    <button onclick="exportAnalytics()" class="btn btn-outline-success">
                        <i class="fa fa-download"></i> Export
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-3">
                        <div class="text-center">
                            <h4 class="text-primary">$2.5M</h4>
                            <p class="text-muted mb-0">Total Loans Disbursed</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="text-center">
                            <h4 class="text-success">1,250</h4>
                            <p class="text-muted mb-0">Active Borrowers</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="text-center">
                            <h4 class="text-warning">8.5%</h4>
                            <p class="text-muted mb-0">Average Interest Rate</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="text-center">
                            <h4 class="text-info">15.2</h4>
                            <p class="text-muted mb-0">Average Loan Term (months)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Insights and Recommendations -->
<div class="row g-3 mb-4">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Key Insights</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <div class="d-flex align-items-start">
                        <i class="fa fa-lightbulb text-warning me-2 mt-1"></i>
                        <div>
                            <h6>High-Performing Regions</h6>
                            <p class="text-muted mb-0">Northern regions show 15% higher repayment rates</p>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="d-flex align-items-start">
                        <i class="fa fa-chart-line text-success me-2 mt-1"></i>
                        <div>
                            <h6>Seasonal Trends</h6>
                            <p class="text-muted mb-0">Loan demand peaks during planting season (March-May)</p>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="d-flex align-items-start">
                        <i class="fa fa-shield-alt text-info me-2 mt-1"></i>
                        <div>
                            <h6>Risk Patterns</h6>
                            <p class="text-muted mb-0">Smaller loans (<$5K) have 40% lower default rates</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Recommendations</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <div class="d-flex align-items-start">
                        <i class="fa fa-arrow-up text-success me-2 mt-1"></i>
                        <div>
                            <h6>Expand Small Loans</h6>
                            <p class="text-muted mb-0">Consider increasing small loan portfolio by 25%</p>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="d-flex align-items-start">
                        <i class="fa fa-map-marker-alt text-primary me-2 mt-1"></i>
                        <div>
                            <h6>Focus on North</h6>
                            <p class="text-muted mb-0">Prioritize marketing efforts in northern regions</p>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="d-flex align-items-start">
                        <i class="fa fa-clock text-warning me-2 mt-1"></i>
                        <div>
                            <h6>Seasonal Planning</h6>
                            <p class="text-muted mb-0">Prepare for increased demand in Q2</p>
                        </div>
                    </div>
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

    loadAnalyticsData();
    initializeCharts();

    async function loadAnalyticsData() {
        try {
            const response = await axios.get('/banker/api/analytics');
            const analytics = response.data.data || {};

            updateAnalyticsStats(analytics);

        } catch (error) {
            console.error('Error loading analytics data:', error);
            showError('Cannot load analytics data');
        }
    }

    function updateAnalyticsStats(analytics) {
        document.getElementById('totalRevenue').textContent = `$${(analytics.total_revenue || 0).toLocaleString()}`;
        document.getElementById('roi').textContent = `${(analytics.roi || 0).toFixed(1)}%`;
        document.getElementById('customerGrowth').textContent = `${(analytics.customer_growth || 0).toFixed(1)}%`;
        document.getElementById('marketShare').textContent = `${(analytics.market_share || 0).toFixed(1)}%`;
    }

    function initializeCharts() {
        // Revenue Trends Chart
        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Revenue',
                    data: [120000, 135000, 150000, 145000, 160000, 175000, 180000, 170000, 185000, 190000, 200000, 210000],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Interest Income',
                    data: [8000, 9000, 10000, 9500, 11000, 12000, 12500, 11500, 13000, 13500, 14000, 15000],
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });

        // Loan Distribution Chart
        const loanDistCtx = document.getElementById('loanDistributionChart').getContext('2d');
        new Chart(loanDistCtx, {
            type: 'doughnut',
            data: {
                labels: ['Small Loans (<$5K)', 'Medium Loans ($5K-$20K)', 'Large Loans (>$20K)'],
                datasets: [{
                    data: [45, 35, 20],
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

        // Geographic Distribution Chart
        const geoCtx = document.getElementById('geographicChart').getContext('2d');
        new Chart(geoCtx, {
            type: 'bar',
            data: {
                labels: ['North', 'Central', 'South', 'East', 'West'],
                datasets: [{
                    label: 'Loan Volume',
                    data: [450000, 380000, 320000, 280000, 250000],
                    backgroundColor: ['#1976d2', '#28a745', '#ffc107', '#dc3545', '#6f42c1']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000) + 'K';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Action functions
    function refreshAnalytics() {
        loadAnalyticsData();
        Swal.fire('Refreshed', 'Analytics data has been refreshed', 'success');
    }

    function exportAnalytics() {
        Swal.fire('Export Analytics', 'Analytics data will be exported', 'info');
    }

    function showError(message) {
        Swal.fire('Error', message, 'error');
    }
});
</script>
@endsection
