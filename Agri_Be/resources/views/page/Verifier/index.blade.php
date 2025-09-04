@extends('share.Verifier.master')

@section('title')
    <div>
        <h1 class="mb-1">Verifier Dashboard</h1>
        <p class="text-muted">Dashboard for verifier</p>
    </div>
@endsection

@section('content')
<div class="row g-3 mb-4">
    <!-- Total Requests -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Total Requests</span>
                <div class="stat-card-icon primary"><i class="fa fa-file-alt"></i></div>
            </div>
            <div class="stat-value" id="totalRequests">0</div>
            <div class="stat-label" id="pendingCount">0 pending review</div>
        </div>
    </div>

    <!-- Scheduled Visits -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Scheduled Visits</span>
                <div class="stat-card-icon info"><i class="fa fa-calendar"></i></div>
            </div>
            <div class="stat-value" id="scheduledVisits">0</div>
            <div class="stat-label">This week</div>
        </div>
    </div>

    <!-- Completed -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Completed</span>
                <div class="stat-card-icon success"><i class="fa fa-check-circle"></i></div>
            </div>
            <div class="stat-value" id="completedCount">0</div>
            <div class="stat-label">This month</div>
        </div>
    </div>

    <!-- Average Score -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Average Score</span>
                <div class="stat-card-icon warning"><i class="fa fa-chart-line"></i></div>
            </div>
            <div class="stat-value" id="averageScore">0</div>
            <div class="stat-label">Final verification score</div>
        </div>
    </div>
</div>

<!-- Search and Filter -->
<div class="row g-3 mb-4">
    <div class="col-md-8">
        <div class="input-group">
            <span class="input-group-text"><i class="fa fa-search"></i></span>
            <input type="text" class="form-control" id="searchInput" placeholder="Search by farmer name or location...">
        </div>
    </div>
    <div class="col-md-4">
        <select class="form-select" id="statusFilter">
            <option value="">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="pending">Pending Visit</option>
            <option value="requires_revision">Requires Revision</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
        </select>
    </div>
</div>

<!-- Verification Requests -->
<div class="table-card">
    <div class="table-card-header d-flex justify-content-between align-items-center">
        <div>
            <h5>Verification Requests (<span id="requestCount">0</span>)</h5>
            <p class="text-muted mb-0">Review and manage MRV verification requests from farmers</p>
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
                    <th>Request ID</th>
                    <th>Carbon Performance</th>
                    <th>MRV Reliability</th>
                    <th>Final Score</th>
                    <th>Evidence Files</th>
                    <th>Submitted</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="requestsTableBody">
                <tr>
                    <td colspan="10" class="text-center text-muted">Loading...</td>
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
        filterRequests();
    });

    // Status filter
    document.getElementById('statusFilter').addEventListener('change', function() {
        filterRequests();
    });

    async function loadData() {
        try {
            console.log('Loading data...');

            // Load verification queue
            const queueResponse = await axios.get('/verifier/api/queue');
            console.log('Queue response:', queueResponse.data);
            const requests = queueResponse.data.data?.queue || [];

            // Load my verifications for stats
            const myResponse = await axios.get('/verifier/api/my-verifications');
            console.log('My verifications response:', myResponse.data);
            const myVerifications = myResponse.data.data?.verifications || [];

            updateDashboard(requests, myVerifications);
            updateRequestsTable(requests);

        } catch (error) {
            console.error('Error loading data:', error);
            console.error('Error details:', error.response?.data);
            showError('Cannot load dashboard data: ' + (error.response?.data?.message || error.message));
        }
    }

    function updateDashboard(requests, myVerifications) {
        const totalRequests = requests.length;
        const pendingCount = requests.filter(r => r.status === 'submitted').length;
        const scheduledCount = myVerifications.filter(v => v.verification_status === 'pending').length;
        const completedCount = myVerifications.filter(v => v.verification_status === 'approved').length;

        // Calculate average final score
        const totalScore = requests.reduce((sum, r) => {
            const carbonPerformance = r.carbon_performance_score || 0;
            const mrvReliability = r.mrv_reliability_score || 0;
            const finalScore = Math.min(100, carbonPerformance * 0.7 + mrvReliability * 0.3);
            return sum + finalScore;
        }, 0);
        const averageScore = totalRequests > 0 ? (totalScore / totalRequests) : 0;

        document.getElementById('totalRequests').textContent = totalRequests;
        document.getElementById('pendingCount').textContent = `${pendingCount} pending review`;
        document.getElementById('scheduledVisits').textContent = scheduledCount;
        document.getElementById('completedCount').textContent = completedCount;
        document.getElementById('averageScore').textContent = averageScore.toFixed(1);
        document.getElementById('requestCount').textContent = totalRequests;
    }

    function updateRequestsTable(requests) {
        const tbody = document.getElementById('requestsTableBody');

        if (requests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-center text-muted">No verification requests</td></tr>';
            return;
        }

        tbody.innerHTML = requests.map(request => {
            // Calculate scores theo công thức backend
            const carbonPerformance = request.carbon_performance_score || 0;
            const mrvReliability = request.mrv_reliability_score || 0;
            const finalScore = Math.min(100, carbonPerformance * 0.7 + mrvReliability * 0.3);
            const grade = getGradeFromScore(finalScore);

            return `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="user-avatar me-2" style="width: 35px; height: 35px; font-size: 12px;">
                            ${getInitials(request.user?.full_name || 'Unknown')}
                        </div>
                        <div>
                            <div class="fw-bold">${request.user?.full_name || 'Unknown'}</div>
                            <small class="text-muted">${request.farm_profile?.location || 'Unknown Location'}</small>
                        </div>
                    </div>
                </td>
                <td><span class="badge bg-secondary">VR${String(request.id).padStart(3, '0')}</span></td>
                <td>
                    <div class="text-center">
                        <div class="fw-bold text-primary">${carbonPerformance.toFixed(1)}</div>
                        <small class="text-muted">CP Score</small>
                    </div>
                </td>
                <td>
                    <div class="text-center">
                        <div class="fw-bold text-info">${mrvReliability.toFixed(1)}</div>
                        <small class="text-muted">MR Score</small>
                    </div>
                </td>
                <td>
                    <div class="text-center">
                        <div class="fw-bold ${getGradeColor(grade)}">${finalScore.toFixed(1)}</div>
                        <small class="badge ${getGradeBadgeClass(grade)}">${grade}</small>
                    </div>
                </td>
                <td>${request.evidence_files_count || 0} files</td>
                <td>${formatDate(request.created_at)}</td>
                <td>
                    <span class="badge ${getPriorityClass(request.priority || 'medium')}">
                        ${request.priority || 'Medium'}
                    </span>
                </td>
                <td>
                    <span class="badge ${getStatusClass(request.status)}">
                        ${request.status}
                    </span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary" data-action="review" data-id="${request.id}">
                            <i class="fa fa-eye"></i> Review
                        </button>
                        ${request.status === 'submitted' ? `
                            <button class="btn btn-success" data-action="approve" data-id="${request.id}">
                                <i class="fa fa-check"></i> Approve
                            </button>
                            <button class="btn btn-warning" data-action="reject" data-id="${request.id}">
                                <i class="fa fa-times"></i> Reject
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
        }).join('');

        // Add event delegation for dynamically created buttons
        document.getElementById('requestsTableBody').addEventListener('click', function(e) {
            const button = e.target.closest('button[data-action]');
            if (!button) return;

            const action = button.getAttribute('data-action');
            const requestId = parseInt(button.getAttribute('data-id'));

            console.log('Button clicked:', action, requestId);

            switch(action) {
                case 'review':
                    reviewRequest(requestId);
                    break;
                case 'approve':
                    quickApprove(requestId);
                    break;
                case 'reject':
                    quickReject(requestId);
                    break;
            }
        });
    }

    function getInitials(name) {
        return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 3);
    }

    function getPriorityClass(priority) {
        const classes = {
            'high': 'bg-danger',
            'medium': 'bg-warning',
            'low': 'bg-success'
        };
        return classes[priority] || 'bg-secondary';
    }

    function getStatusClass(status) {
        const classes = {
            'submitted': 'bg-warning',
            'pending': 'bg-info',
            'requires_revision': 'bg-danger',
            'verified': 'bg-success',
            'rejected': 'bg-danger'
        };
        return classes[status] || 'bg-secondary';
    }

    function getStatusText(status) {
        const texts = {
            'submitted': 'Submitted',
            'pending': 'Pending Visit',
            'requires_revision': 'Requires Revision',
            'verified': 'Verified',
            'rejected': 'Rejected'
        };
        return texts[status] || status;
    }

    function getGradeFromScore(score) {
        if (score >= 75) return 'A';
        if (score >= 60) return 'B';
        if (score >= 45) return 'C';
        if (score >= 30) return 'D';
        return 'F';
    }

    function getGradeColor(grade) {
        const colors = {
            'A': 'text-success',
            'B': 'text-primary',
            'C': 'text-warning',
            'D': 'text-danger',
            'F': 'text-danger'
        };
        return colors[grade] || 'text-muted';
    }

    function getGradeBadgeClass(grade) {
        const classes = {
            'A': 'bg-success',
            'B': 'bg-primary',
            'C': 'bg-warning',
            'D': 'bg-danger',
            'F': 'bg-danger'
        };
        return classes[grade] || 'bg-secondary';
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }

    function filterRequests() {
        // Implement search and filter logic
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;

        // This would typically filter the loaded data
        console.log('Filtering:', { searchTerm, statusFilter });
    }

    function reviewRequest(requestId) {
        window.location.href = `/verifier/request/${requestId}`;
    }

    function scheduleVisit(requestId) {
        window.location.href = `/verifier/schedule/${requestId}`;
    }

    async function quickApprove(requestId) {
        try {
            const result = await Swal.fire({
                title: 'Quick Approve',
                html: `
                    <div class="mb-3">
                        <label class="form-label">Verification Score (0-100)</label>
                        <input type="number" id="score" class="form-control" min="0" max="100" value="85" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Verification Type</label>
                        <select id="verification_type" class="form-select" required>
                            <option value="remote">Remote</option>
                            <option value="field">Field Visit</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Comments</label>
                        <textarea id="comments" class="form-control" rows="3" placeholder="Enter verification comments..."></textarea>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Approve',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#28a745',
                preConfirm: () => {
                    const score = document.getElementById('score').value;
                    const verificationType = document.getElementById('verification_type').value;
                    const comments = document.getElementById('comments').value;

                    if (!score || score < 0 || score > 100) {
                        Swal.showValidationMessage('Please enter a valid score (0-100)');
                        return false;
                    }

                    return { score, verification_type: verificationType, comments };
                }
            });

                        if (result.isConfirmed) {
                console.log('Approving declaration:', requestId, result.value);
                const response = await axios.post(`/verifier/api/declarations/${requestId}/approve`, result.value);
                console.log('Approve response:', response.data);

                if (response.data.success) {
                    Swal.fire('Success', 'Declaration approved successfully!', 'success');
                    await loadData(); // Refresh data
                } else {
                    throw new Error(response.data.message || 'Failed to approve declaration');
                }
            }
        } catch (error) {
            console.error('Error approving declaration:', error);
            console.error('Error response:', error.response?.data);
            showError('Cannot approve declaration: ' + (error.response?.data?.message || error.message));
        }
    }

    async function quickReject(requestId) {
        try {
            const result = await Swal.fire({
                title: 'Quick Reject',
                html: `
                    <div class="mb-3">
                        <label class="form-label">Rejection Reason *</label>
                        <textarea id="reason" class="form-control" rows="3" placeholder="Enter rejection reason..." required></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Verification Type</label>
                        <select id="verification_type" class="form-select" required>
                            <option value="remote">Remote</option>
                            <option value="field">Field Visit</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Reject',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#dc3545',
                preConfirm: () => {
                    const reason = document.getElementById('reason').value;
                    const verificationType = document.getElementById('verification_type').value;

                    if (!reason || reason.trim().length < 10) {
                        Swal.showValidationMessage('Please enter a detailed rejection reason (at least 10 characters)');
                        return false;
                    }

                    return { reason: reason.trim(), verification_type: verificationType };
                }
            });

                        if (result.isConfirmed) {
                console.log('Rejecting declaration:', requestId, result.value);
                const response = await axios.post(`/verifier/api/declarations/${requestId}/reject`, result.value);
                console.log('Reject response:', response.data);

                if (response.data.success) {
                    Swal.fire('Success', 'Declaration rejected successfully!', 'success');
                    await loadData(); // Refresh data
                } else {
                    throw new Error(response.data.message || 'Failed to reject declaration');
                }
            }
        } catch (error) {
            console.error('Error rejecting declaration:', error);
            console.error('Error response:', error.response?.data);
            showError('Cannot reject declaration: ' + (error.response?.data?.message || error.message));
        }
    }

    function testButton() {
        console.log('Test button clicked!');
        Swal.fire('Test', 'Button clicked successfully!', 'success');
    }

    function showError(message) {
        Swal.fire('Error', message, 'error');
    }
});
</script>
@endsection
