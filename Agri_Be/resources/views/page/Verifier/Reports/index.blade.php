@extends('share.Verifier.master')

@section('title')
    <div>
        <h1 class="mb-1">Verification Reports</h1>
        <p class="text-muted">Reports and statistics for verification activities</p>
    </div>
@endsection

@section('content')
<div class="row g-3 mb-4">
    <!-- Total Verifications -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Total Verifications</span>
                <div class="stat-card-icon primary"><i class="fa fa-clipboard-list"></i></div>
            </div>
            <div class="stat-value" id="totalVerifications">0</div>
            <div class="stat-label">This month</div>
        </div>
    </div>

    <!-- Approval Rate -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Approval Rate</span>
                <div class="stat-card-icon success"><i class="fa fa-chart-line"></i></div>
            </div>
            <div class="stat-value" id="approvalRate">0%</div>
            <div class="stat-label">Success rate</div>
        </div>
    </div>

    <!-- Average Score -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Average Score</span>
                <div class="stat-card-icon info"><i class="fa fa-star"></i></div>
            </div>
            <div class="stat-value" id="averageScore">0</div>
            <div class="stat-label">Out of 100</div>
        </div>
    </div>

    <!-- Carbon Impact -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Carbon Impact</span>
                <div class="stat-card-icon warning"><i class="fa fa-leaf"></i></div>
            </div>
            <div class="stat-value" id="carbonImpact">0</div>
            <div class="stat-label">tCO₂e verified</div>
        </div>
    </div>
</div>

<!-- Report Filters -->
<div class="row g-3 mb-4">
    <div class="col-md-3">
        <label class="form-label">Date Range</label>
        <select class="form-select" id="dateRange">
            <option value="7">Last 7 days</option>
            <option value="30" selected>Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
            <option value="custom">Custom range</option>
        </select>
    </div>
    <div class="col-md-3">
        <label class="form-label">Verification Type</label>
        <select class="form-select" id="verificationType">
            <option value="">All Types</option>
            <option value="field">Field Visit</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
        </select>
    </div>
    <div class="col-md-3">
        <label class="form-label">Status</label>
        <select class="form-select" id="statusFilter">
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
        </select>
    </div>
    <div class="col-md-3">
        <label class="form-label">&nbsp;</label>
        <div class="d-grid">
            <button class="btn btn-primary" onclick="generateReport()">
                <i class="fa fa-chart-bar me-2"></i>Generate Report
            </button>
        </div>
    </div>
</div>

<!-- Custom Date Range (hidden by default) -->
<div class="row g-3 mb-4" id="customDateRange" style="display: none;">
    <div class="col-md-3">
        <label class="form-label">Start Date</label>
        <input type="date" class="form-control" id="startDate">
    </div>
    <div class="col-md-3">
        <label class="form-label">End Date</label>
        <input type="date" class="form-control" id="endDate">
    </div>
</div>

<!-- Charts Section -->
<div class="row g-3 mb-4">
    <div class="col-md-6">
        <div class="chart-card">
            <div class="chart-header">
                <h5>Verification Status Distribution</h5>
            </div>
            <canvas id="statusChart" width="400" height="200"></canvas>
        </div>
    </div>
    <div class="col-md-6">
        <div class="chart-card">
            <div class="chart-header">
                <h5>Monthly Verification Trends</h5>
            </div>
            <canvas id="trendChart" width="400" height="200"></canvas>
        </div>
    </div>
</div>

<!-- Performance Metrics -->
<div class="row g-3 mb-4">
    <div class="col-md-6">
        <div class="chart-card">
            <div class="chart-header">
                <h5>Verification Score Distribution</h5>
            </div>
            <canvas id="scoreChart" width="400" height="200"></canvas>
        </div>
    </div>
    <div class="col-md-6">
        <div class="chart-card">
            <div class="chart-header">
                <h5>Carbon Claims by Region</h5>
            </div>
            <canvas id="regionChart" width="400" height="200"></canvas>
        </div>
    </div>
</div>

<!-- Detailed Report Table -->
<div class="table-card">
    <div class="table-card-header d-flex justify-content-between align-items-center">
        <div>
            <h5>Detailed Verification Report</h5>
            <p class="text-muted mb-0">Comprehensive list of all verifications</p>
        </div>
        <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-primary" onclick="exportReport('pdf')">
                <i class="fa fa-file-pdf me-1"></i>PDF
            </button>
            <button class="btn btn-outline-primary" onclick="exportReport('excel')">
                <i class="fa fa-file-excel me-1"></i>Excel
            </button>
            <button class="btn btn-outline-primary" onclick="exportReport('csv')">
                <i class="fa fa-file-csv me-1"></i>CSV
            </button>
        </div>
    </div>
    <div class="table-responsive">
        <table class="table mb-0">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Farmer</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Score</th>
                    <th>Carbon Claims</th>
                    <th>Duration</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="reportTableBody">
                <tr>
                    <td colspan="8" class="text-center text-muted">Select filters and generate report</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
@endsection

@section('js')
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
let statusChart, trendChart, scoreChart, regionChart;
let reportData = [];
let isGeneratingReport = false;
let chartsInitialized = false;
let generateReportDebounce;

document.addEventListener('DOMContentLoaded', function() {
    // Set up axios with CSRF token for session authentication
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    if (csrfToken) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    }

    initializeCharts();
    setupEventListeners();

    // Set default dates
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    document.getElementById('startDate').value = thirtyDaysAgo.toISOString().split('T')[0];
    document.getElementById('endDate').value = today.toISOString().split('T')[0];

    // Generate initial report
    // Debounce initial call slightly to avoid duplicate invocations in certain navigators
    clearTimeout(generateReportDebounce);
    generateReportDebounce = setTimeout(() => generateReport(), 0);
});

function setupEventListeners() {
    document.getElementById('dateRange').addEventListener('change', function() {
        const value = this.value;
        const customRange = document.getElementById('customDateRange');

        if (value === 'custom') {
            customRange.style.display = 'block';
        } else {
            customRange.style.display = 'none';
        }
    });
}

function initializeCharts() {
    if (chartsInitialized) return;
    // Status Distribution Chart
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    statusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['Approved', 'Rejected', 'Pending', 'In Progress'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: ['#28a745', '#dc3545', '#ffc107', '#17a2b8']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Trend Chart
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Verifications',
                data: [],
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Score Distribution Chart
    const scoreCtx = document.getElementById('scoreChart').getContext('2d');
    scoreChart = new Chart(scoreCtx, {
        type: 'bar',
        data: {
            labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
            datasets: [{
                label: 'Count',
                data: [0, 0, 0, 0, 0],
                backgroundColor: ['#dc3545', '#fd7e14', '#ffc107', '#20c997', '#28a745']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Region Chart
    const regionCtx = document.getElementById('regionChart').getContext('2d');
    regionChart = new Chart(regionCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Carbon Claims (tCO₂e)',
                data: [],
                backgroundColor: 'rgba(40, 167, 69, 0.8)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    chartsInitialized = true;
}

async function generateReport() {
    if (isGeneratingReport) return;
    isGeneratingReport = true;
    try {
        const filters = getFilters();
        showLoading();

        // Load verification data based on filters
        const response = await axios.get('/verifier/api/my-verifications', { params: filters });
        reportData = response.data.data.verifications || [];

        updateDashboard();
        updateCharts();
        updateReportTable();

        hideLoading();

    } catch (error) {
        console.error('Error generating report:', error);
        showError('Unable to generate report');
        hideLoading();
    }
    isGeneratingReport = false;
}

function getFilters() {
    const dateRange = document.getElementById('dateRange').value;
    const verificationType = document.getElementById('verificationType').value;
    const statusFilter = document.getElementById('statusFilter').value;

    let filters = {};

    if (dateRange === 'custom') {
        filters.start_date = document.getElementById('startDate').value;
        filters.end_date = document.getElementById('endDate').value;
    } else {
        const days = parseInt(dateRange);
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));
        filters.start_date = startDate.toISOString().split('T')[0];
        filters.end_date = endDate.toISOString().split('T')[0];
    }

    if (verificationType) filters.verification_type = verificationType;
    if (statusFilter) filters.verification_status = statusFilter;

    return filters;
}

function updateDashboard() {
    const totalVerifications = reportData.length;
    const approvedCount = reportData.filter(v => v.verification_status === 'approved').length;
    const approvalRate = totalVerifications > 0 ? (approvedCount / totalVerifications * 100).toFixed(1) : 0;

    const scores = reportData.map(v => v.verification_score || 0).filter(s => s > 0);
    const averageScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;

    const carbonImpact = reportData.reduce((sum, v) => {
        return sum + (v.carbon_claims || 0);
    }, 0);

    document.getElementById('totalVerifications').textContent = totalVerifications;
    document.getElementById('approvalRate').textContent = approvalRate + '%';
    document.getElementById('averageScore').textContent = averageScore;
    document.getElementById('carbonImpact').textContent = carbonImpact.toFixed(1);
}

function updateCharts() {
    // Update Status Chart
    const statusCounts = {
        approved: reportData.filter(v => v.verification_status === 'approved').length,
        rejected: reportData.filter(v => v.verification_status === 'rejected').length,
        pending: reportData.filter(v => v.verification_status === 'pending').length,
        in_progress: reportData.filter(v => v.verification_status === 'in_progress').length
    };

    statusChart.data.datasets[0].data = [
        statusCounts.approved,
        statusCounts.rejected,
        statusCounts.pending,
        statusCounts.in_progress
    ];
    statusChart.update();

    // Update Trend Chart
    const monthlyData = getMonthlyData();
    trendChart.data.labels = monthlyData.labels;
    trendChart.data.datasets[0].data = monthlyData.data;
    trendChart.update();

    // Update Score Chart
    const scoreRanges = [0, 0, 0, 0, 0];
    reportData.forEach(v => {
        const score = v.verification_score || 0;
        if (score <= 20) scoreRanges[0]++;
        else if (score <= 40) scoreRanges[1]++;
        else if (score <= 60) scoreRanges[2]++;
        else if (score <= 80) scoreRanges[3]++;
        else scoreRanges[4]++;
    });

    scoreChart.data.datasets[0].data = scoreRanges;
    scoreChart.update();

    // Update Region Chart
    const regionData = getRegionData();
    regionChart.data.labels = regionData.labels;
    regionChart.data.datasets[0].data = regionData.data;
    regionChart.update();
}

function getMonthlyData() {
    const months = {};
    const labels = [];
    const data = [];

    reportData.forEach(v => {
        const date = new Date(v.verification_date);
        const monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');

        if (!months[monthKey]) {
            months[monthKey] = 0;
            labels.push(monthKey);
        }
        months[monthKey]++;
    });

    labels.sort().forEach(month => {
        data.push(months[month]);
    });

    return { labels, data };
}

function getRegionData() {
    const regions = {};

    reportData.forEach(v => {
        const region = v.farmer_region || 'Unknown';
        if (!regions[region]) regions[region] = 0;
        regions[region] += v.carbon_claims || 0;
    });

    const labels = Object.keys(regions);
    const data = Object.values(regions);

    return { labels, data };
}

function updateReportTable() {
    const tbody = document.getElementById('reportTableBody');

    if (reportData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No data available</td></tr>';
        return;
    }

    tbody.innerHTML = reportData.map(verification => `
        <tr>
            <td>${formatDate(verification.verification_date)}</td>
            <td>
                <div class="fw-bold">${verification.farmer_name || 'Unknown'}</div>
                <small class="text-muted">ID: ${verification.mrv_declaration_id}</small>
            </td>
            <td>
                <span class="badge bg-info">${verification.verification_type}</span>
            </td>
            <td>
                <span class="badge ${getStatusClass(verification.verification_status)}">
                    ${getStatusText(verification.verification_status)}
                </span>
            </td>
            <td>${verification.verification_score || 'N/A'}</td>
            <td>${(verification.carbon_claims || 0).toFixed(1)} tCO₂e</td>
            <td>${verification.duration || 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewDetails(${verification.id})">
                    <i class="fa fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function getStatusClass(status) {
    const classes = {
        'approved': 'bg-success',
        'rejected': 'bg-danger',
        'pending': 'bg-warning',
        'in_progress': 'bg-primary'
    };
    return classes[status] || 'bg-secondary';
}

function getStatusText(status) {
    const texts = {
        'approved': 'Approved',
        'rejected': 'Rejected',
        'pending': 'Pending',
        'in_progress': 'In Progress'
    };
    return texts[status] || status;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function viewDetails(verificationId) {
    window.location.href = `/verifier/request/${verificationId}`;
}

function exportReport(format) {
    if (reportData.length === 0) {
        showError('Không có dữ liệu để export');
        return;
    }

    // Here you would implement export functionality
    console.log(`Exporting ${format} report with ${reportData.length} records`);
    showSuccess(`Báo cáo ${format.toUpperCase()} đã được tạo`);
}

function showLoading() {
    // Show loading state
    document.getElementById('reportTableBody').innerHTML =
        '<tr><td colspan="8" class="text-center"><div class="spinner-border text-primary" role="status"></div></td></tr>';
}

function hideLoading() {
    // Loading state is handled by updateReportTable
}

function showError(message) {
    Swal.fire('Error', message, 'error');
}

function showSuccess(message) {
    Swal.fire('Success', message, 'success');
}
</script>
@endsection


