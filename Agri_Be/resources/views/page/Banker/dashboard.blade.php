@extends('share.Banker.master')

@section('title')
    <div>
        <h1 class="mb-1">Banker Dashboard</h1>
        <p class="text-muted">Overview of financial management and risk assessment</p>
    </div>
@endsection

@section('content')
<div class="row g-3 mb-4">
    <!-- Total Loan Applications -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Loan Applications</span>
                <div class="stat-card-icon primary"><i class="fa fa-file-invoice-dollar"></i></div>
            </div>
            <div class="stat-value" id="totalApplications">0</div>
            <div class="stat-label" id="pendingApplications">0 pending review</div>
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

    <!-- Portfolio Value -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Portfolio Value</span>
                <div class="stat-card-icon info"><i class="fa fa-briefcase"></i></div>
            </div>
            <div class="stat-value" id="portfolioValue">$0</div>
            <div class="stat-label">Total investment</div>
        </div>
    </div>

    <!-- Risk Score -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Average Risk Score</span>
                <div class="stat-card-icon warning"><i class="fa fa-shield-alt"></i></div>
            </div>
            <div class="stat-value" id="averageRiskScore">0</div>
            <div class="stat-label">Risk assessment</div>
        </div>
    </div>
</div>

<!-- Search and Filter -->
<div class="row g-3 mb-4">
    <div class="col-md-8">
        <div class="input-group">
            <span class="input-group-text"><i class="fa fa-search"></i></span>
            <input type="text" class="form-control" id="searchInput" placeholder="Search by farmer name or loan ID...">
        </div>
    </div>
    <div class="col-md-4">
        <select class="form-select" id="statusFilter">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
        </select>
    </div>
</div>

<!-- Loan Applications -->
<div class="table-card">
    <div class="table-card-header d-flex justify-content-between align-items-center">
        <div>
            <h5>Recent Loan Applications (<span id="applicationCount">0</span>)</h5>
            <p class="text-muted mb-0">Review and manage loan applications from farmers</p>
        </div>
        <div class="btn-group btn-group-sm">
            <button onclick="loadData()" class="btn btn-sm btn-outline-primary">
                <i class="fa fa-rotate"></i> Refresh
            </button>
            <button onclick="testButton()" class="btn btn-sm btn-outline-success">
                <i class="fa fa-bug"></i> Test
            </button>
        </div>
    </div>
    <div class="table-responsive">
        <table class="table mb-0">
            <thead>
                <tr>
                    <th>Farmer</th>
                    <th>Loan ID</th>
                    <th>Amount</th>
                    <th>Purpose</th>
                    <th>Risk Score</th>
                    <th>Carbon Credits</th>
                    <th>Applied</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="applicationsTableBody">
                <tr>
                    <td colspan="9" class="text-center text-muted">Loading...</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
@endsection

@section('js')
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Set up axios with CSRF token for session authentication
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    console.log('CSRF Token:', csrfToken);

    if (csrfToken) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    }

    // Add request interceptor to log all requests
    axios.interceptors.request.use(function (config) {
        console.log('Making request:', config.method.toUpperCase(), config.url, config.data);
        return config;
    });

    // Add response interceptor to log all responses
    axios.interceptors.response.use(
        function (response) {
            console.log('Response success:', response.status, response.data);
            return response;
        },
        function (error) {
            console.log('Response error:', error.response?.status, error.response?.data);
            return Promise.reject(error);
        }
    );

    loadData();

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', function() {
        filterApplications();
    });

    // Status filter
    document.getElementById('statusFilter').addEventListener('change', function() {
        filterApplications();
    });

    async function loadData() {
        try {
            console.log('Loading banker data...');

            // Load loan applications
            const applicationsResponse = await axios.get('/banker/api/loan-applications');
            console.log('Applications response:', applicationsResponse.data);
            const applications = applicationsResponse.data.data?.applications || [];

            // Load portfolio data
            const portfolioResponse = await axios.get('/banker/api/portfolio');
            console.log('Portfolio response:', portfolioResponse.data);
            const portfolio = portfolioResponse.data.data || {};

            updateDashboard(applications, portfolio);
            updateApplicationsTable(applications);

        } catch (error) {
            console.error('Error loading data:', error);
            console.error('Error details:', error.response?.data);
            showError('Cannot load dashboard data: ' + (error.response?.data?.message || error.message));
        }
    }

    function updateDashboard(applications, portfolio) {
        const totalApplications = applications.length;
        const pendingApplications = applications.filter(a => a.status === 'pending').length;
        const activeLoans = applications.filter(a => a.status === 'active').length;
        const portfolioValue = portfolio.total_value || 0;

        // Calculate average risk score
        const totalRiskScore = applications.reduce((sum, a) => sum + (a.risk_score || 0), 0);
        const averageRiskScore = totalApplications > 0 ? (totalRiskScore / totalApplications) : 0;

        document.getElementById('totalApplications').textContent = totalApplications;
        document.getElementById('pendingApplications').textContent = `${pendingApplications} pending review`;
        document.getElementById('activeLoans').textContent = activeLoans;
        document.getElementById('portfolioValue').textContent = `$${portfolioValue.toLocaleString()}`;
        document.getElementById('averageRiskScore').textContent = averageRiskScore.toFixed(1);
        document.getElementById('applicationCount').textContent = totalApplications;
    }

    function updateApplicationsTable(applications) {
        const tbody = document.getElementById('applicationsTableBody');

        if (applications.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">Không có loan applications</td></tr>';
            return;
        }

        tbody.innerHTML = applications.map(application => {
            return `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="user-avatar me-2" style="width: 35px; height: 35px; font-size: 12px;">
                            ${getInitials(application.farmer?.full_name || 'Unknown')}
                        </div>
                        <div>
                            <div class="fw-bold">${application.farmer?.full_name || 'Unknown'}</div>
                            <small class="text-muted">${application.farmer?.location || 'Unknown Location'}</small>
                        </div>
                    </div>
                </td>
                <td><span class="badge bg-secondary">LA${String(application.id).padStart(3, '0')}</span></td>
                <td>$${Number(application.amount || 0).toLocaleString()}</td>
                <td>${application.purpose || 'N/A'}</td>
                <td>
                    <div class="text-center">
                        <div class="fw-bold ${getRiskScoreColor(application.risk_score || 0)}">${(application.risk_score || 0).toFixed(1)}</div>
                        <small class="badge ${getRiskBadgeClass(application.risk_score || 0)}">${getRiskLevel(application.risk_score || 0)}</small>
                    </div>
                </td>
                <td>${Number(application.carbon_credits || 0).toFixed(1)} tCO₂e</td>
                <td>${formatDate(application.created_at)}</td>
                <td>
                    <span class="badge ${getStatusClass(application.status)}">
                        ${getStatusText(application.status)}
                    </span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary" data-action="review" data-id="${application.id}">
                            <i class="fa fa-eye"></i> Review
                        </button>
                        ${application.status === 'pending' ? `
                            <button class="btn btn-success" data-action="approve" data-id="${application.id}">
                                <i class="fa fa-check"></i> Approve
                            </button>
                            <button class="btn btn-warning" data-action="reject" data-id="${application.id}">
                                <i class="fa fa-times"></i> Reject
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
        }).join('');

        // Add event delegation for dynamically created buttons
        document.getElementById('applicationsTableBody').addEventListener('click', function(e) {
            const button = e.target.closest('button[data-action]');
            if (!button) return;

            const action = button.getAttribute('data-action');
            const applicationId = parseInt(button.getAttribute('data-id'));

            console.log('Button clicked:', action, applicationId);

            switch(action) {
                case 'review':
                    reviewApplication(applicationId);
                    break;
                case 'approve':
                    quickApprove(applicationId);
                    break;
                case 'reject':
                    quickReject(applicationId);
                    break;
            }
        });
    }

    function getInitials(name) {
        return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 3);
    }

    function getStatusClass(status) {
        const classes = {
            'pending': 'bg-warning',
            'approved': 'bg-success',
            'rejected': 'bg-danger',
            'active': 'bg-primary',
            'completed': 'bg-info'
        };
        return classes[status] || 'bg-secondary';
    }

    function getStatusText(status) {
        const texts = {
            'pending': 'Pending',
            'approved': 'Approved',
            'rejected': 'Rejected',
            'active': 'Active',
            'completed': 'Completed'
        };
        return texts[status] || status;
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

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }

    function filterApplications() {
        // Implement search and filter logic
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;

        // This would typically filter the loaded data
        console.log('Filtering:', { searchTerm, statusFilter });
    }

    function reviewApplication(applicationId) {
        window.location.href = `/banker/loan-applications/${applicationId}`;
    }

    async function quickApprove(applicationId) {
        try {
            const result = await Swal.fire({
                title: 'Approve Loan',
                html: `
                    <div class="mb-3">
                        <label class="form-label">Interest Rate (%)</label>
                        <input type="number" id="interest_rate" class="form-control" min="0" max="30" step="0.1" value="8.5" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Loan Term (months)</label>
                        <input type="number" id="loan_term" class="form-control" min="1" max="60" value="12" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Comments</label>
                        <textarea id="comments" class="form-control" rows="3" placeholder="Enter approval comments..."></textarea>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Approve',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#28a745',
                preConfirm: () => {
                    const interestRate = document.getElementById('interest_rate').value;
                    const loanTerm = document.getElementById('loan_term').value;
                    const comments = document.getElementById('comments').value;

                    if (!interestRate || interestRate < 0 || interestRate > 30) {
                        Swal.showValidationMessage('Please enter a valid interest rate (0-30%)');
                        return false;
                    }

                    if (!loanTerm || loanTerm < 1 || loanTerm > 60) {
                        Swal.showValidationMessage('Please enter a valid loan term (1-60 months)');
                        return false;
                    }

                    return { interest_rate: interestRate, loan_term: loanTerm, comments };
                }
            });

            if (result.isConfirmed) {
                console.log('Approving loan:', applicationId, result.value);
                const response = await axios.post(`/banker/api/loans/${applicationId}/approve`, result.value);
                console.log('Approve response:', response.data);

                if (response.data.success) {
                    Swal.fire('Success', 'Loan approved successfully!', 'success');
                    await loadData(); // Refresh data
                } else {
                    throw new Error(response.data.message || 'Failed to approve loan');
                }
            }
        } catch (error) {
            console.error('Error approving loan:', error);
            console.error('Error response:', error.response?.data);
            showError('Không thể approve loan: ' + (error.response?.data?.message || error.message));
        }
    }

    async function quickReject(applicationId) {
        try {
            const result = await Swal.fire({
                title: 'Reject Loan',
                html: `
                    <div class="mb-3">
                        <label class="form-label">Rejection Reason *</label>
                        <textarea id="reason" class="form-control" rows="3" placeholder="Enter rejection reason..." required></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Additional Comments</label>
                        <textarea id="comments" class="form-control" rows="2" placeholder="Additional comments..."></textarea>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Reject',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#dc3545',
                preConfirm: () => {
                    const reason = document.getElementById('reason').value;
                    const comments = document.getElementById('comments').value;

                    if (!reason || reason.trim().length < 10) {
                        Swal.showValidationMessage('Please enter a detailed rejection reason (at least 10 characters)');
                        return false;
                    }

                    return { reason: reason.trim(), comments: comments.trim() };
                }
            });

            if (result.isConfirmed) {
                console.log('Rejecting loan:', applicationId, result.value);
                const response = await axios.post(`/banker/api/loans/${applicationId}/reject`, result.value);
                console.log('Reject response:', response.data);

                if (response.data.success) {
                    Swal.fire('Success', 'Loan rejected successfully!', 'success');
                    await loadData(); // Refresh data
                } else {
                    throw new Error(response.data.message || 'Failed to reject loan');
                }
            }
        } catch (error) {
            console.error('Error rejecting loan:', error);
            console.error('Error response:', error.response?.data);
            showError('Không thể reject loan: ' + (error.response?.data?.message || error.message));
        }
    }

    function testButton() {
        console.log('Test button clicked!');
        Swal.fire('Test', 'Button clicked successfully!', 'success');
    }

    function showError(message) {
        Swal.fire('Lỗi', message, 'error');
    }
});
</script>
@endsection
