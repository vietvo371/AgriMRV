@extends('share.Verifier.master')

@section('title')
    <div>
        <h1 class="mb-1">Verification Analytics</h1>
        <p class="text-muted">In-depth analysis and insights on verification performance</p>
    </div>
@endsection

@section('content')
<div class="row g-3 mb-4">
    <!-- Performance Score -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Performance Score</span>
                <div class="stat-card-icon primary"><i class="fa fa-trophy"></i></div>
            </div>
            <div class="stat-value" id="performanceScore">0</div>
            <div class="stat-label">Out of 100</div>
        </div>
    </div>

    <!-- Efficiency Rate -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Efficiency Rate</span>
                <div class="stat-card-icon success"><i class="fa fa-rocket"></i></div>
            </div>
            <div class="stat-value" id="efficiencyRate">0%</div>
            <div class="stat-label">Time vs Quality</div>
        </div>
    </div>

    <!-- Risk Level -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Risk Level</span>
                <div class="stat-card-icon warning"><i class="fa fa-shield-alt"></i></div>
            </div>
            <div class="stat-value" id="riskLevel">Low</div>
            <div class="stat-label">Verification risk</div>
        </div>
    </div>

    <!-- Carbon Impact -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Carbon Impact</span>
                <div class="stat-card-icon info"><i class="fa fa-globe"></i></div>
            </div>
            <div class="stat-value" id="carbonImpact">0</div>
            <div class="stat-label">tCO₂e verified</div>
        </div>
    </div>
</div>

<!-- Advanced Analytics Filters -->
<div class="row g-3 mb-4">
    <div class="col-md-2">
        <label class="form-label">Time Period</label>
        <select class="form-select" id="timePeriod">
            <option value="7">7 days</option>
            <option value="30" selected>30 days</option>
            <option value="90">90 days</option>
            <option value="365">1 year</option>
        </select>
    </div>
    <div class="col-md-2">
        <label class="form-label">Region</label>
        <select class="form-select" id="regionFilter">
            <option value="">All Regions</option>
            <option value="north">North</option>
            <option value="central">Central</option>
            <option value="south">South</option>
        </select>
    </div>
    <div class="col-md-2">
        <label class="form-label">Farm Size</label>
        <select class="form-select" id="farmSizeFilter">
            <option value="">All Sizes</option>
            <option value="small">Small (< 2ha)</option>
            <option value="medium">Medium (2-5ha)</option>
            <option value="large">Large (> 5ha)</option>
        </select>
    </div>
    <div class="col-md-2">
        <label class="form-label">Crop Type</label>
        <select class="form-select" id="cropTypeFilter">
            <option value="">All Crops</option>
            <option value="rice">Rice</option>
            <option value="agroforestry">Agroforestry</option>
            <option value="mixed">Mixed</option>
        </select>
    </div>
    <div class="col-md-2">
        <label class="form-label">Verification Method</label>
        <select class="form-select" id="methodFilter">
            <option value="">All Methods</option>
            <option value="field">Field Visit</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
        </select>
    </div>
    <div class="col-md-2">
        <label class="form-label">&nbsp;</label>
        <div class="d-grid">
            <button class="btn btn-primary" onclick="updateAnalytics()">
                <i class="fa fa-sync-alt me-2"></i>Update
            </button>
        </div>
    </div>
</div>

<!-- Key Performance Indicators -->
<div class="row g-3 mb-4">
    <div class="col-md-6">
        <div class="chart-card">
            <div class="chart-header">
                <h5>Verification Performance Trends</h5>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary active" onclick="switchChart('performance')">Performance</button>
                    <button class="btn btn-outline-primary" onclick="switchChart('efficiency')">Efficiency</button>
                    <button class="btn btn-outline-primary" onclick="switchChart('quality')">Quality</button>
                </div>
            </div>
            <canvas id="performanceChart" width="400" height="300"></canvas>
        </div>
    </div>
    <div class="col-md-6">
        <div class="chart-card">
            <div class="chart-header">
                <h5>Risk Assessment Matrix</h5>
                <p class="text-muted mb-0">Verification risk by farm characteristics</p>
            </div>
            <canvas id="riskMatrixChart" width="400" height="300"></canvas>
        </div>
    </div>
</div>

<!-- Detailed Analytics -->
<div class="row g-3 mb-4">
    <div class="col-md-4">
        <div class="chart-card">
            <div class="chart-header">
                <h5>Verification Method Effectiveness</h5>
            </div>
            <canvas id="methodEffectivenessChart" width="400" height="250"></canvas>
        </div>
    </div>
    <div class="col-md-4">
        <div class="chart-card">
            <div class="chart-header">
                <h5>Regional Performance Comparison</h5>
            </div>
            <canvas id="regionalChart" width="400" height="250"></canvas>
        </div>
    </div>
    <div class="col-md-4">
        <div class="chart-card">
            <div class="chart-header">
                <h5>Carbon Credit Distribution</h5>
            </div>
            <canvas id="carbonDistributionChart" width="400" height="250"></canvas>
        </div>
    </div>
</div>

<!-- Predictive Analytics -->
<div class="row g-3 mb-4">
    <div class="col-md-8">
        <div class="chart-card">
            <div class="chart-header">
                <h5>Predictive Performance Forecast</h5>
                <p class="text-muted mb-0">AI-powered prediction of verification outcomes</p>
            </div>
            <canvas id="forecastChart" width="400" height="300"></canvas>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0"><i class="fa fa-lightbulb me-2"></i>AI Insights</h5>
            </div>
            <div class="card-body">
                <div id="aiInsights">
                    <div class="text-center">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Performance Benchmarking -->
<div class="table-card">
    <div class="table-card-header">
        <h5>Performance Benchmarking</h5>
        <p class="text-muted mb-0">Compare your performance with industry standards</p>
    </div>
    <div class="table-responsive">
        <table class="table mb-0">
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>Your Performance</th>
                    <th>Industry Average</th>
                    <th>Top Performers</th>
                    <th>Status</th>
                    <th>Recommendations</th>
                </tr>
            </thead>
            <tbody id="benchmarkTableBody">
                <tr>
                    <td colspan="6" class="text-center text-muted">Loading benchmarks...</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
@endsection

@section('js')
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
let performanceChart, riskMatrixChart, methodEffectivenessChart, regionalChart, carbonDistributionChart, forecastChart;
let currentChartType = 'performance';
let analyticsData = {};
let isLoadingAnalytics = false;
let chartsInitialized = false;
let loadAnalyticsDebounce;

document.addEventListener('DOMContentLoaded', function() {
    // Set up axios with CSRF token for session authentication
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    if (csrfToken) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    }

    initializeCharts();
    clearTimeout(loadAnalyticsDebounce);
    loadAnalyticsDebounce = setTimeout(() => loadAnalytics(), 0);
});

function initializeCharts() {
    if (chartsInitialized) return;
    // Performance Chart
    const perfCtx = document.getElementById('performanceChart').getContext('2d');
    performanceChart = new Chart(perfCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Performance Score',
                data: [],
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
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
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Risk Matrix Chart
    const riskCtx = document.getElementById('riskMatrixChart').getContext('2d');
    riskMatrixChart = new Chart(riskCtx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Low Risk',
                data: [],
                backgroundColor: '#28a745',
                pointRadius: 8
            }, {
                label: 'Medium Risk',
                data: [],
                backgroundColor: '#ffc107',
                pointRadius: 8
            }, {
                label: 'High Risk',
                data: [],
                backgroundColor: '#dc3545',
                pointRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Farm Size (ha)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Carbon Claims (tCO₂e)'
                    }
                }
            }
        }
    });

    // Method Effectiveness Chart
    const methodCtx = document.getElementById('methodEffectivenessChart').getContext('2d');
    methodEffectivenessChart = new Chart(methodCtx, {
        type: 'radar',
        data: {
            labels: ['Accuracy', 'Speed', 'Cost', 'Reliability', 'Coverage'],
            datasets: [{
                label: 'Field Visit',
                data: [85, 60, 40, 90, 70],
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.2)'
            }, {
                label: 'Remote',
                data: [70, 90, 80, 75, 85],
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.2)'
            }, {
                label: 'Hybrid',
                data: [90, 75, 60, 95, 80],
                borderColor: '#ffc107',
                backgroundColor: 'rgba(255, 193, 7, 0.2)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Regional Chart
    const regionalCtx = document.getElementById('regionalChart').getContext('2d');
    regionalChart = new Chart(regionalCtx, {
        type: 'bar',
        data: {
            labels: ['North', 'Central', 'South'],
            datasets: [{
                label: 'Performance Score',
                data: [0, 0, 0],
                backgroundColor: ['#007bff', '#28a745', '#ffc107']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Carbon Distribution Chart
    const carbonCtx = document.getElementById('carbonDistributionChart').getContext('2d');
    carbonDistributionChart = new Chart(carbonCtx, {
        type: 'doughnut',
        data: {
            labels: ['Small Farms', 'Medium Farms', 'Large Farms'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#28a745', '#ffc107', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Forecast Chart
    const forecastCtx = document.getElementById('forecastChart').getContext('2d');
    forecastChart = new Chart(forecastCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Historical',
                data: [],
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                tension: 0.4
            }, {
                label: 'Predicted',
                data: [],
                borderColor: '#dc3545',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                borderDash: [5, 5],
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
    chartsInitialized = true;
}

async function loadAnalytics() {
    if (isLoadingAnalytics) return;
    isLoadingAnalytics = true;
    try {
        const filters = getAnalyticsFilters();
        const response = await axios.get('/verifier/api/analytics', { params: filters });
        analyticsData = response.data.data || {};

        updateDashboard();
        updateCharts();
        updateBenchmarks();
        loadAIInsights();

    } catch (error) {
        console.error('Error loading analytics:', error);
        showError('Unable to load analytics data');
    }
    isLoadingAnalytics = false;
}

function getAnalyticsFilters() {
    return {
        time_period: document.getElementById('timePeriod').value,
        region: document.getElementById('regionFilter').value,
        farm_size: document.getElementById('farmSizeFilter').value,
        crop_type: document.getElementById('cropTypeFilter').value,
        verification_method: document.getElementById('methodFilter').value
    };
}

function updateDashboard() {
    const data = analyticsData.summary || {};

    document.getElementById('performanceScore').textContent = data.performance_score || 0;
    document.getElementById('efficiencyRate').textContent = (data.efficiency_rate || 0) + '%';
    document.getElementById('riskLevel').textContent = data.risk_level || 'Low';
    document.getElementById('carbonImpact').textContent = (data.carbon_impact || 0).toFixed(1);
}

function updateCharts() {
    updatePerformanceChart();
    updateRiskMatrix();
    updateMethodEffectiveness();
    updateRegionalChart();
    updateCarbonDistribution();
    updateForecastChart();
}

function updatePerformanceChart() {
    const data = analyticsData.performance_trends || {};
    const labels = data.labels || [];
    const values = data.values || [];

    performanceChart.data.labels = labels;
    performanceChart.data.datasets[0].data = values;
    performanceChart.update();
}

function updateRiskMatrix() {
    const data = analyticsData.risk_matrix || {};

    // Update risk matrix with farm size vs carbon claims
    const lowRisk = data.low_risk || [];
    const mediumRisk = data.medium_risk || [];
    const highRisk = data.high_risk || [];

    riskMatrixChart.data.datasets[0].data = lowRisk;
    riskMatrixChart.data.datasets[1].data = mediumRisk;
    riskMatrixChart.data.datasets[2].data = highRisk;
    riskMatrixChart.update();
}

function updateMethodEffectiveness() {
    // Method effectiveness is static for now, could be updated with real data
    methodEffectivenessChart.update();
}

function updateRegionalChart() {
    const data = analyticsData.regional_performance || {};
    const regions = ['North', 'Central', 'South'];
    const scores = [
        data.north || 0,
        data.central || 0,
        data.south || 0
    ];

    regionalChart.data.datasets[0].data = scores;
    regionalChart.update();
}

function updateCarbonDistribution() {
    const data = analyticsData.carbon_distribution || {};
    const distribution = [
        data.small_farms || 0,
        data.medium_farms || 0,
        data.large_farms || 0
    ];

    carbonDistributionChart.data.datasets[0].data = distribution;
    carbonDistributionChart.update();
}

function updateForecastChart() {
    const data = analyticsData.forecast || {};
    const labels = data.labels || [];
    const historical = data.historical || [];
    const predicted = data.predicted || [];

    forecastChart.data.labels = labels;
    forecastChart.data.datasets[0].data = historical;
    forecastChart.data.datasets[1].data = predicted;
    forecastChart.update();
}

function updateBenchmarks() {
    const benchmarks = analyticsData.benchmarks || [];
    const tbody = document.getElementById('benchmarkTableBody');

    if (benchmarks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No benchmark data available</td></tr>';
        return;
    }

    tbody.innerHTML = benchmarks.map(benchmark => `
        <tr>
            <td><strong>${benchmark.metric}</strong></td>
            <td>
                <span class="badge bg-${getBenchmarkStatusClass(benchmark.your_performance, benchmark.industry_average)}">
                    ${benchmark.your_performance}
                </span>
            </td>
            <td>${benchmark.industry_average}</td>
            <td>${benchmark.top_performers}</td>
            <td>
                <span class="badge bg-${getBenchmarkStatusClass(benchmark.your_performance, benchmark.industry_average)}">
                    ${getBenchmarkStatus(benchmark.your_performance, benchmark.industry_average)}
                </span>
            </td>
            <td>
                <small class="text-muted">${benchmark.recommendations || 'No specific recommendations'}</small>
            </td>
        </tr>
    `).join('');
}

function getBenchmarkStatusClass(yourScore, industryScore) {
    if (yourScore >= industryScore * 1.1) return 'success';
    if (yourScore >= industryScore * 0.9) return 'warning';
    return 'danger';
}

function getBenchmarkStatus(yourScore, industryScore) {
    if (yourScore >= industryScore * 1.1) return 'Above Average';
    if (yourScore >= industryScore * 0.9) return 'Average';
    return 'Below Average';
}

async function loadAIInsights() {
    try {
        const response = await axios.get('/verifier/api/ai-insights');
        const insights = response.data.data.insights || [];

        const container = document.getElementById('aiInsights');

        if (insights.length === 0) {
            container.innerHTML = '<div class="text-center text-muted">No AI insights available</div>';
            return;
        }

        container.innerHTML = insights.map(insight => `
            <div class="mb-3 p-3 border rounded">
                <div class="d-flex align-items-start">
                    <i class="fa fa-lightbulb text-warning me-2 mt-1"></i>
                    <div>
                        <h6 class="mb-1">${insight.title}</h6>
                        <p class="mb-1 small">${insight.description}</p>
                        <small class="text-muted">Confidence: ${insight.confidence}%</small>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading AI insights:', error);
        document.getElementById('aiInsights').innerHTML =
            '<div class="text-center text-muted">Unable to load AI insights</div>';
    }
}

function switchChart(type, el) {
    currentChartType = type;

    // Update active button state
    document.querySelectorAll('.chart-header .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (el) el.classList.add('active');

    // Update chart data based on type
    const data = analyticsData[`${type}_trends`] || {};
    const labels = data.labels || [];
    const values = data.values || [];

    performanceChart.data.labels = labels;
    performanceChart.data.datasets[0].data = values;
    performanceChart.data.datasets[0].label = type.charAt(0).toUpperCase() + type.slice(1);
    performanceChart.update();
}

function updateAnalytics() {
    loadAnalytics();
}

function showError(message) {
    Swal.fire('Error', message, 'error');
}
</script>
@endsection


