@extends('share.Banker.master')

@section('title')
    <div>
        <h1 class="mb-1">Loan Applications</h1>
        <p class="text-muted">Manage and process loan applications from farmers</p>
    </div>
@endsection

@section('content')
<!-- Search and Filter -->
<div class="row g-3 mb-4">
    <div class="col-md-6">
        <div class="input-group">
            <span class="input-group-text"><i class="fa fa-search"></i></span>
            <input type="text" class="form-control" id="searchInput" placeholder="Search by farmer name, loan ID, or amount...">
        </div>
    </div>
    <div class="col-md-2">
        <select class="form-select" id="statusFilter">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
        </select>
    </div>
    <div class="col-md-2">
        <select class="form-select" id="riskFilter">
            <option value="">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
        </select>
    </div>
    <div class="col-md-2">
        <button onclick="loadData()" class="btn btn-primary w-100">
            <i class="fa fa-rotate"></i> Refresh
        </button>
    </div>
</div>

<!-- Loan Applications Table -->
<div class="table-card">
    <div class="table-card-header d-flex justify-content-between align-items-center">
        <div>
            <h5>Loan Applications (<span id="applicationCount">0</span>)</h5>
            <p class="text-muted mb-0">Review and process loan applications</p>
        </div>
        <div class="btn-group btn-group-sm">
            <button onclick="exportData()" class="btn btn-outline-success">
                <i class="fa fa-download"></i> Export
            </button>
            <button onclick="bulkAction()" class="btn btn-outline-primary">
                <i class="fa fa-tasks"></i> Bulk Action
            </button>
        </div>
    </div>
    <div class="table-responsive">
        <table class="table mb-0">
            <thead>
                <tr>
                    <th>
                        <input type="checkbox" id="selectAll" onchange="toggleSelectAll()">
                    </th>
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
                    <td colspan="10" class="text-center text-muted">Loading...</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<!-- Pagination -->
<nav aria-label="Loan applications pagination">
    <ul class="pagination justify-content-center" id="pagination">
        <!-- Pagination will be generated here -->
    </ul>
</nav>
@endsection

@section('js')
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Set up axios with CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    }

    loadData();

    // Event listeners
    document.getElementById('searchInput').addEventListener('input', debounce(filterApplications, 300));
    document.getElementById('statusFilter').addEventListener('change', filterApplications);
    document.getElementById('riskFilter').addEventListener('change', filterApplications);

    async function loadData() {
        try {
            const response = await axios.get('/banker/api/loan-applications');
            const applications = response.data.data?.applications || [];

            updateApplicationsTable(applications);
            updatePagination(applications.length);

        } catch (error) {
            console.error('Error loading loan applications:', error);
            showError('Không thể tải danh sách loan applications');
        }
    }

    function updateApplicationsTable(applications) {
        const tbody = document.getElementById('applicationsTableBody');

        if (applications.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-center text-muted">Không có loan applications</td></tr>';
            return;
        }

        tbody.innerHTML = applications.map(application => `
            <tr>
                <td>
                    <input type="checkbox" class="application-checkbox" value="${application.id}" onchange="updateBulkActions()">
                </td>
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
                        <button class="btn btn-outline-secondary" data-action="view" data-id="${application.id}">
                            <i class="fa fa-eye"></i>
                        </button>
                        ${application.status === 'pending' ? `
                            <button class="btn btn-success" data-action="approve" data-id="${application.id}">
                                <i class="fa fa-check"></i>
                            </button>
                            <button class="btn btn-warning" data-action="reject" data-id="${application.id}">
                                <i class="fa fa-times"></i>
                            </button>
                        ` : ''}
                        <button class="btn btn-info" data-action="info" data-id="${application.id}">
                            <i class="fa fa-info"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Add event delegation
        document.getElementById('applicationsTableBody').addEventListener('click', function(e) {
            const button = e.target.closest('button[data-action]');
            if (!button) return;

            const action = button.getAttribute('data-action');
            const applicationId = parseInt(button.getAttribute('data-id'));

            switch(action) {
                case 'view':
                    viewApplication(applicationId);
                    break;
                case 'approve':
                    approveApplication(applicationId);
                    break;
                case 'reject':
                    rejectApplication(applicationId);
                    break;
                case 'info':
                    showApplicationInfo(applicationId);
                    break;
            }
        });

        document.getElementById('applicationCount').textContent = applications.length;
    }

    function updatePagination(totalItems) {
        // Simple pagination implementation
        const itemsPerPage = 10;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (totalPages <= 1) {
            document.getElementById('pagination').innerHTML = '';
            return;
        }

        let paginationHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" onclick="goToPage(${i})">${i}</a>
                </li>
            `;
        }

        document.getElementById('pagination').innerHTML = paginationHTML;
    }

    // Helper functions
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

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Action functions
    function viewApplication(applicationId) {
        window.location.href = `/banker/loan-applications/${applicationId}`;
    }

    async function approveApplication(applicationId) {
        try {
            const result = await Swal.fire({
                title: 'Approve Loan Application',
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
                        <label class="form-label">Approval Comments</label>
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
                const response = await axios.post(`/banker/api/loans/${applicationId}/approve`, result.value);

                if (response.data.success) {
                    Swal.fire('Success', 'Loan application approved successfully!', 'success');
                    await loadData();
                } else {
                    throw new Error(response.data.message || 'Failed to approve loan');
                }
            }
        } catch (error) {
            console.error('Error approving loan:', error);
            showError('Không thể approve loan: ' + (error.response?.data?.message || error.message));
        }
    }

    async function rejectApplication(applicationId) {
        try {
            const result = await Swal.fire({
                title: 'Reject Loan Application',
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
                const response = await axios.post(`/banker/api/loans/${applicationId}/reject`, result.value);

                if (response.data.success) {
                    Swal.fire('Success', 'Loan application rejected successfully!', 'success');
                    await loadData();
                } else {
                    throw new Error(response.data.message || 'Failed to reject loan');
                }
            }
        } catch (error) {
            console.error('Error rejecting loan:', error);
            showError('Không thể reject loan: ' + (error.response?.data?.message || error.message));
        }
    }

    function showApplicationInfo(applicationId) {
        Swal.fire({
            title: 'Application Information',
            text: `Detailed information for application ID: ${applicationId}`,
            icon: 'info'
        });
    }

    function filterApplications() {
        // Implement filtering logic
        console.log('Filtering applications...');
    }

    function exportData() {
        Swal.fire('Export', 'Export functionality will be implemented', 'info');
    }

    function bulkAction() {
        const selected = document.querySelectorAll('.application-checkbox:checked');
        if (selected.length === 0) {
            Swal.fire('No Selection', 'Please select applications first', 'warning');
            return;
        }

        Swal.fire('Bulk Action', `Selected ${selected.length} applications`, 'info');
    }

    function toggleSelectAll() {
        const selectAll = document.getElementById('selectAll');
        const checkboxes = document.querySelectorAll('.application-checkbox');

        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAll.checked;
        });

        updateBulkActions();
    }

    function updateBulkActions() {
        const selected = document.querySelectorAll('.application-checkbox:checked');
        // Update bulk action button state
    }

    function goToPage(page) {
        console.log('Go to page:', page);
        // Implement pagination
    }

    function showError(message) {
        Swal.fire('Lỗi', message, 'error');
    }
});
</script>
@endsection
