@extends('share.Banker.master')

@section('title')
    <div>
        <h1 class="mb-1">Reports</h1>
        <p class="text-muted">Financial reports and performance analysis</p>
    </div>
@endsection

@section('content')
<!-- Report Filters -->
<div class="row g-3 mb-4">
    <div class="col-md-3">
        <label class="form-label">Report Type</label>
        <select class="form-select" id="reportType">
            <option value="financial">Financial Report</option>
            <option value="risk">Risk Assessment</option>
            <option value="portfolio">Portfolio Performance</option>
            <option value="loans">Loan Analysis</option>
            <option value="custom">Custom Report</option>
        </select>
    </div>
    <div class="col-md-2">
        <label class="form-label">Date From</label>
        <input type="date" class="form-control" id="dateFrom">
    </div>
    <div class="col-md-2">
        <label class="form-label">Date To</label>
        <input type="date" class="form-control" id="dateTo">
    </div>
    <div class="col-md-2">
        <label class="form-label">Format</label>
        <select class="form-select" id="reportFormat">
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
        </select>
    </div>
    <div class="col-md-3">
        <label class="form-label">&nbsp;</label>
        <div class="d-flex gap-2">
            <button onclick="generateReport()" class="btn btn-primary">
                <i class="fa fa-file-alt"></i> Generate
            </button>
            <button onclick="previewReport()" class="btn btn-outline-secondary">
                <i class="fa fa-eye"></i> Preview
            </button>
        </div>
    </div>
</div>

<!-- Quick Reports -->
<div class="row g-3 mb-4">
    <div class="col-md-3">
        <div class="card h-100">
            <div class="card-body text-center">
                <i class="fa fa-chart-line fa-3x text-primary mb-3"></i>
                <h5>Monthly Performance</h5>
                <p class="text-muted">Portfolio performance for current month</p>
                <button onclick="generateQuickReport('monthly')" class="btn btn-primary btn-sm">
                    Generate Report
                </button>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card h-100">
            <div class="card-body text-center">
                <i class="fa fa-shield-alt fa-3x text-warning mb-3"></i>
                <h5>Risk Analysis</h5>
                <p class="text-muted">Comprehensive risk assessment report</p>
                <button onclick="generateQuickReport('risk')" class="btn btn-warning btn-sm">
                    Generate Report
                </button>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card h-100">
            <div class="card-body text-center">
                <i class="fa fa-hand-holding-usd fa-3x text-success mb-3"></i>
                <h5>Loan Portfolio</h5>
                <p class="text-muted">Detailed loan portfolio analysis</p>
                <button onclick="generateQuickReport('portfolio')" class="btn btn-success btn-sm">
                    Generate Report
                </button>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card h-100">
            <div class="card-body text-center">
                <i class="fa fa-users fa-3x text-info mb-3"></i>
                <h5>Customer Analysis</h5>
                <p class="text-muted">Customer behavior and demographics</p>
                <button onclick="generateQuickReport('customers')" class="btn btn-info btn-sm">
                    Generate Report
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Report History -->
<div class="row g-3 mb-4">
    <div class="col-12">
        <div class="table-card">
            <div class="table-card-header d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="mb-0">Report History</h5>
                    <p class="text-muted mb-0">Previously generated reports</p>
                </div>
                <div class="btn-group btn-group-sm">
                    <button onclick="refreshReports()" class="btn btn-outline-primary">
                        <i class="fa fa-rotate"></i> Refresh
                    </button>
                    <button onclick="clearHistory()" class="btn btn-outline-danger">
                        <i class="fa fa-trash"></i> Clear History
                    </button>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table mb-0">
                    <thead>
                        <tr>
                            <th>Report Name</th>
                            <th>Type</th>
                            <th>Generated</th>
                            <th>Size</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="reportsTableBody">
                        <tr>
                            <td colspan="6" class="text-center text-muted">Loading...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Report Templates -->
<div class="row g-3 mb-4">
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Report Templates</h5>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <div class="card border">
                            <div class="card-body">
                                <h6 class="card-title">Financial Summary</h6>
                                <p class="card-text text-muted">Monthly financial performance summary</p>
                                <button onclick="useTemplate('financial')" class="btn btn-outline-primary btn-sm">
                                    Use Template
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card border">
                            <div class="card-body">
                                <h6 class="card-title">Risk Dashboard</h6>
                                <p class="card-text text-muted">Comprehensive risk assessment dashboard</p>
                                <button onclick="useTemplate('risk')" class="btn btn-outline-warning btn-sm">
                                    Use Template
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card border">
                            <div class="card-body">
                                <h6 class="card-title">Portfolio Analysis</h6>
                                <p class="card-text text-muted">Detailed portfolio performance analysis</p>
                                <button onclick="useTemplate('portfolio')" class="btn btn-outline-success btn-sm">
                                    Use Template
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('js')
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Set up axios with CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    }

    // Set default dates
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    document.getElementById('dateFrom').value = lastMonth.toISOString().split('T')[0];
    document.getElementById('dateTo').value = today.toISOString().split('T')[0];

    loadReportHistory();

    async function loadReportHistory() {
        try {
            const response = await axios.get('/banker/api/reports');
            const reports = response.data.data?.reports || [];

            updateReportsTable(reports);

        } catch (error) {
            console.error('Error loading report history:', error);
            showError('Cannot load report history');
        }
    }

    function updateReportsTable(reports) {
        const tbody = document.getElementById('reportsTableBody');

        if (reports.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Không có báo cáo nào</td></tr>';
            return;
        }

        tbody.innerHTML = reports.map(report => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="fa ${getReportIcon(report.type)} me-2 text-primary"></i>
                        <div>
                            <div class="fw-bold">${report.name}</div>
                            <small class="text-muted">${report.description || 'No description'}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge ${getReportTypeBadge(report.type)}">
                        ${getReportTypeText(report.type)}
                    </span>
                </td>
                <td>${formatDate(report.created_at)}</td>
                <td>${formatFileSize(report.size)}</td>
                <td>
                    <span class="badge ${getStatusBadge(report.status)}">
                        ${getStatusText(report.status)}
                    </span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" data-action="download" data-id="${report.id}">
                            <i class="fa fa-download"></i>
                        </button>
                        <button class="btn btn-outline-secondary" data-action="preview" data-id="${report.id}">
                            <i class="fa fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-danger" data-action="delete" data-id="${report.id}">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Add event delegation
        document.getElementById('reportsTableBody').addEventListener('click', function(e) {
            const button = e.target.closest('button[data-action]');
            if (!button) return;

            const action = button.getAttribute('data-action');
            const reportId = parseInt(button.getAttribute('data-id'));

            switch(action) {
                case 'download':
                    downloadReport(reportId);
                    break;
                case 'preview':
                    previewReport(reportId);
                    break;
                case 'delete':
                    deleteReport(reportId);
                    break;
            }
        });
    }

    // Helper functions
    function getReportIcon(type) {
        const icons = {
            'financial': 'fa-chart-line',
            'risk': 'fa-shield-alt',
            'portfolio': 'fa-briefcase',
            'loans': 'fa-hand-holding-usd',
            'custom': 'fa-file-alt'
        };
        return icons[type] || 'fa-file-alt';
    }

    function getReportTypeBadge(type) {
        const badges = {
            'financial': 'bg-primary',
            'risk': 'bg-warning',
            'portfolio': 'bg-success',
            'loans': 'bg-info',
            'custom': 'bg-secondary'
        };
        return badges[type] || 'bg-secondary';
    }

    function getReportTypeText(type) {
        const texts = {
            'financial': 'Financial',
            'risk': 'Risk',
            'portfolio': 'Portfolio',
            'loans': 'Loans',
            'custom': 'Custom'
        };
        return texts[type] || type;
    }

    function getStatusBadge(status) {
        const badges = {
            'completed': 'bg-success',
            'processing': 'bg-warning',
            'failed': 'bg-danger',
            'pending': 'bg-info'
        };
        return badges[status] || 'bg-secondary';
    }

    function getStatusText(status) {
        const texts = {
            'completed': 'Completed',
            'processing': 'Processing',
            'failed': 'Failed',
            'pending': 'Pending'
        };
        return texts[status] || status;
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }

    function formatFileSize(bytes) {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Action functions
    function generateReport() {
        const reportType = document.getElementById('reportType').value;
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        const format = document.getElementById('reportFormat').value;

        if (!dateFrom || !dateTo) {
            Swal.fire('Error', 'Please select date range', 'error');
            return;
        }

        Swal.fire({
            title: 'Generating Report',
            html: `
                <div class="mb-3">
                    <strong>Report Type:</strong> ${getReportTypeText(reportType)}<br>
                    <strong>Date Range:</strong> ${dateFrom} to ${dateTo}<br>
                    <strong>Format:</strong> ${format.toUpperCase()}
                </div>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
                </div>
            `,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                // Simulate report generation
                setTimeout(() => {
                    Swal.fire('Success', 'Report generated successfully!', 'success');
                    loadReportHistory();
                }, 3000);
            }
        });
    }

    function previewReport(reportId = null) {
        if (reportId) {
            Swal.fire('Preview Report', `Previewing report ID: ${reportId}`, 'info');
        } else {
            Swal.fire('Preview Report', 'Preview functionality will be implemented', 'info');
        }
    }

    function generateQuickReport(type) {
        Swal.fire({
            title: 'Generating Quick Report',
            text: `Generating ${type} report...`,
            icon: 'info',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                setTimeout(() => {
                    Swal.fire('Success', `${type} report generated successfully!`, 'success');
                    loadReportHistory();
                }, 2000);
            }
        });
    }

    function useTemplate(templateType) {
        document.getElementById('reportType').value = templateType;
        Swal.fire('Template Applied', `${templateType} template has been applied`, 'success');
    }

    function downloadReport(reportId) {
        Swal.fire('Download Report', `Downloading report ID: ${reportId}`, 'info');
    }

    function deleteReport(reportId) {
        Swal.fire({
            title: 'Delete Report',
            text: 'Are you sure you want to delete this report?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc3545'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Deleted', 'Report has been deleted', 'success');
                loadReportHistory();
            }
        });
    }

    function refreshReports() {
        loadReportHistory();
        Swal.fire('Refreshed', 'Report history has been refreshed', 'success');
    }

    function clearHistory() {
        Swal.fire({
            title: 'Clear History',
            text: 'Are you sure you want to clear all report history?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Clear',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc3545'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Cleared', 'Report history has been cleared', 'success');
                loadReportHistory();
            }
        });
    }

    function showError(message) {
        Swal.fire('Lỗi', message, 'error');
    }
});
</script>
@endsection
