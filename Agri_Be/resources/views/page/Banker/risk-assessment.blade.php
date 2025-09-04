@extends('share.Banker.master')

@section('title')
    <div>
        <h1 class="mb-1">Risk Assessment</h1>
        <p class="text-muted">Credit risk assessment and management</p>
    </div>
@endsection

@section('content')
<div class="row g-3 mb-4">
    <!-- Risk Overview -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Overall Risk Score</span>
                <div class="stat-card-icon warning"><i class="fa fa-shield-alt"></i></div>
            </div>
            <div class="stat-value" id="overallRiskScore">0</div>
            <div class="stat-label">Portfolio risk level</div>
        </div>
    </div>

    <!-- High Risk Loans -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>High Risk Loans</span>
                <div class="stat-card-icon danger"><i class="fa fa-exclamation-triangle"></i></div>
            </div>
            <div class="stat-value" id="highRiskLoans">0</div>
            <div class="stat-label">Require attention</div>
        </div>
    </div>

    <!-- Default Rate -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Default Rate</span>
                <div class="stat-card-icon info"><i class="fa fa-percentage"></i></div>
            </div>
            <div class="stat-value" id="defaultRate">0%</div>
            <div class="stat-label">Current default rate</div>
        </div>
    </div>

    <!-- Risk Alerts -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Risk Alerts</span>
                <div class="stat-card-icon primary"><i class="fa fa-bell"></i></div>
            </div>
            <div class="stat-value" id="riskAlerts">0</div>
            <div class="stat-label">Active alerts</div>
        </div>
    </div>
</div>

<!-- Risk Analysis Charts -->
<div class="row g-3 mb-4">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Risk Distribution</h5>
            </div>
            <div class="card-body">
                <canvas id="riskDistributionChart" height="200"></canvas>
            </div>
        </div>
    </div>

    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Risk Trends</h5>
            </div>
            <div class="card-body">
                <canvas id="riskTrendsChart" height="200"></canvas>
            </div>
        </div>
    </div>
</div>

<!-- Risk Assessment Tools -->
<div class="row g-3 mb-4">
    <div class="col-md-8">
        <div class="table-card">
            <div class="table-card-header d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="mb-0">Risk Assessment Results</h5>
                    <p class="text-muted mb-0">Detailed risk analysis for each loan</p>
                </div>
                <div class="btn-group btn-group-sm">
                    <button onclick="runRiskAssessment()" class="btn btn-primary">
                        <i class="fa fa-calculator"></i> Run Assessment
                    </button>
                    <button onclick="exportRiskReport()" class="btn btn-outline-success">
                        <i class="fa fa-download"></i> Export Report
                    </button>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table mb-0">
                    <thead>
                        <tr>
                            <th>Farmer</th>
                            <th>Loan Amount</th>
                            <th>Risk Score</th>
                            <th>Risk Level</th>
                            <th>Carbon Credits</th>
                            <th>Farm Score</th>
                            <th>Recommendation</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="riskAssessmentTableBody">
                        <tr>
                            <td colspan="8" class="text-center text-muted">Loading...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="col-md-4">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Risk Factors</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <div class="d-flex justify-content-between">
                        <span>Credit History</span>
                        <span class="badge bg-primary">25%</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-primary" style="width: 25%"></div>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="d-flex justify-content-between">
                        <span>Farm Performance</span>
                        <span class="badge bg-success">30%</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-success" style="width: 30%"></div>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="d-flex justify-content-between">
                        <span>Carbon Credits</span>
                        <span class="badge bg-info">20%</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-info" style="width: 20%"></div>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="d-flex justify-content-between">
                        <span>Market Conditions</span>
                        <span class="badge bg-warning">15%</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-warning" style="width: 15%"></div>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="d-flex justify-content-between">
                        <span>Other Factors</span>
                        <span class="badge bg-secondary">10%</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-secondary" style="width: 10%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Risk Alerts -->
<div class="row g-3 mb-4">
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Risk Alerts & Notifications</h5>
            </div>
            <div class="card-body">
                <div id="riskAlertsList">
                    <div class="text-center text-muted">Loading risk alerts...</div>
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

    loadRiskAssessmentData();
    initializeCharts();

    async function loadRiskAssessmentData() {
        try {
            const response = await axios.get('/banker/api/risk-assessment');
            const riskData = response.data.data || {};

            updateRiskStats(riskData);
            updateRiskAssessmentTable(riskData.assessments || []);
            updateRiskAlerts(riskData.alerts || []);

        } catch (error) {
            console.error('Error loading risk assessment data:', error);
            showError('Cannot load risk assessment data');
        }
    }

    function updateRiskStats(riskData) {
        document.getElementById('overallRiskScore').textContent = (riskData.overall_risk_score || 0).toFixed(1);
        document.getElementById('highRiskLoans').textContent = riskData.high_risk_loans || 0;
        document.getElementById('defaultRate').textContent = `${(riskData.default_rate || 0).toFixed(2)}%`;
        document.getElementById('riskAlerts').textContent = riskData.risk_alerts || 0;
    }

    function updateRiskAssessmentTable(assessments) {
        const tbody = document.getElementById('riskAssessmentTableBody');

        if (assessments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Không có risk assessments</td></tr>';
            return;
        }

        tbody.innerHTML = assessments.map(assessment => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="user-avatar me-2" style="width: 35px; height: 35px; font-size: 12px;">
                            ${getInitials(assessment.farmer?.full_name || 'Unknown')}
                        </div>
                        <div>
                            <div class="fw-bold">${assessment.farmer?.full_name || 'Unknown'}</div>
                            <small class="text-muted">${assessment.farmer?.location || 'Unknown Location'}</small>
                        </div>
                    </div>
                </td>
                <td>$${Number(assessment.loan_amount || 0).toLocaleString()}</td>
                <td>
                    <div class="text-center">
                        <div class="fw-bold ${getRiskScoreColor(assessment.risk_score || 0)}">${(assessment.risk_score || 0).toFixed(1)}</div>
                    </div>
                </td>
                <td>
                    <span class="badge ${getRiskBadgeClass(assessment.risk_score || 0)}">
                        ${getRiskLevel(assessment.risk_score || 0)}
                    </span>
                </td>
                <td>${Number(assessment.carbon_credits || 0).toFixed(1)} tCO₂e</td>
                <td>${(assessment.farm_score || 0).toFixed(1)}</td>
                <td>
                    <span class="badge ${getRecommendationBadgeClass(assessment.recommendation)}">
                        ${getRecommendationText(assessment.recommendation)}
                    </span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary" data-action="view" data-id="${assessment.id}">
                            <i class="fa fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-primary" data-action="details" data-id="${assessment.id}">
                            <i class="fa fa-info"></i>
                        </button>
                        <button class="btn btn-outline-warning" data-action="reassess" data-id="${assessment.id}">
                            <i class="fa fa-redo"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Add event delegation
        document.getElementById('riskAssessmentTableBody').addEventListener('click', function(e) {
            const button = e.target.closest('button[data-action]');
            if (!button) return;

            const action = button.getAttribute('data-action');
            const assessmentId = parseInt(button.getAttribute('data-id'));

            switch(action) {
                case 'view':
                    viewRiskAssessment(assessmentId);
                    break;
                case 'details':
                    showRiskDetails(assessmentId);
                    break;
                case 'reassess':
                    reassessRisk(assessmentId);
                    break;
            }
        });
    }

    function updateRiskAlerts(alerts) {
        const container = document.getElementById('riskAlertsList');

        if (alerts.length === 0) {
            container.innerHTML = '<div class="text-center text-muted">No risk alerts</div>';
            return;
        }

        container.innerHTML = alerts.map(alert => `
            <div class="alert ${getAlertClass(alert.severity)} alert-dismissible fade show" role="alert">
                <div class="d-flex align-items-center">
                    <i class="fa ${getAlertIcon(alert.severity)} me-2"></i>
                    <div class="flex-grow-1">
                        <strong>${alert.title}</strong>
                        <p class="mb-0">${alert.message}</p>
                        <small class="text-muted">${formatDate(alert.created_at)}</small>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            </div>
        `).join('');
    }

    function initializeCharts() {
        // Risk Distribution Chart
        const riskDistCtx = document.getElementById('riskDistributionChart').getContext('2d');
        new Chart(riskDistCtx, {
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

        // Risk Trends Chart
        const riskTrendsCtx = document.getElementById('riskTrendsChart').getContext('2d');
        new Chart(riskTrendsCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Average Risk Score',
                    data: [45, 48, 42, 50, 47, 45],
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
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
    }

    // Helper functions
    function getInitials(name) {
        return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 3);
    }

    function getRiskScoreColor(score) {
        if (score >= 80) return 'text-danger';
        if (score >= 60) return 'text-warning';
        if (score >= 40) return 'text-primary';
        return 'text-success';
    }

    function getRiskBadgeClass(score) {
        if (score >= 80) return 'bg-danger';
        if (score >= 60) return 'bg-warning';
        if (score >= 40) return 'bg-primary';
        return 'bg-success';
    }

    function getRiskLevel(score) {
        if (score >= 80) return 'High';
        if (score >= 60) return 'Medium';
        if (score >= 40) return 'Low';
        return 'Very Low';
    }

    function getRecommendationBadgeClass(recommendation) {
        const classes = {
            'approve': 'bg-success',
            'approve_with_conditions': 'bg-warning',
            'reject': 'bg-danger',
            'review': 'bg-info'
        };
        return classes[recommendation] || 'bg-secondary';
    }

    function getRecommendationText(recommendation) {
        const texts = {
            'approve': 'Approve',
            'approve_with_conditions': 'Approve with Conditions',
            'reject': 'Reject',
            'review': 'Review'
        };
        return texts[recommendation] || recommendation;
    }

    function getAlertClass(severity) {
        const classes = {
            'high': 'alert-danger',
            'medium': 'alert-warning',
            'low': 'alert-info'
        };
        return classes[severity] || 'alert-secondary';
    }

    function getAlertIcon(severity) {
        const icons = {
            'high': 'fa-exclamation-triangle',
            'medium': 'fa-exclamation-circle',
            'low': 'fa-info-circle'
        };
        return icons[severity] || 'fa-info-circle';
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }

    // Action functions
    function viewRiskAssessment(assessmentId) {
        Swal.fire('View Assessment', `Viewing risk assessment ID: ${assessmentId}`, 'info');
    }

    function showRiskDetails(assessmentId) {
        Swal.fire('Risk Details', `Details for assessment ID: ${assessmentId}`, 'info');
    }

    function reassessRisk(assessmentId) {
        Swal.fire({
            title: 'Reassess Risk',
            text: 'Are you sure you want to run a new risk assessment?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Reassess',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Reassessing', 'Running new risk assessment...', 'info');
                // Implement reassessment logic
            }
        });
    }

    function runRiskAssessment() {
        Swal.fire({
            title: 'Run Risk Assessment',
            text: 'This will analyze all pending loan applications. Continue?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Run Assessment',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Running Assessment', 'Please wait while we analyze the risk...', 'info');
                // Implement risk assessment logic
            }
        });
    }

    function exportRiskReport() {
        Swal.fire('Export Report', 'Risk assessment report will be exported', 'info');
    }

    function showError(message) {
        Swal.fire('Lỗi', message, 'error');
    }
});
</script>
@endsection
