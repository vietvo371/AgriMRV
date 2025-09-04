@extends('share.Verifier.master')

@section('title')
    <div>
        <h1 class="mb-1">Schedule Management</h1>
        <p class="text-muted">Manage field visits and verification appointments</p>
    </div>
@endsection

@section('content')
<div class="row g-3 mb-4">
    <!-- Today's Visits -->
    <div class="col-md-4">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Today's Visits</span>
                <div class="stat-card-icon primary"><i class="fa fa-calendar-day"></i></div>
            </div>
            <div class="stat-value" id="todayVisits">0</div>
            <div class="stat-label">Scheduled for today</div>
        </div>
    </div>

    <!-- This Week -->
    <div class="col-md-4">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>This Week</span>
                <div class="stat-card-icon info"><i class="fa fa-calendar-week"></i></div>
            </div>
            <div class="stat-value" id="weekVisits">0</div>
            <div class="stat-label">Total scheduled</div>
        </div>
    </div>

    <!-- Pending Approval -->
    <div class="col-md-4">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Pending Approval</span>
                <div class="stat-card-icon warning"><i class="fa fa-clock"></i></div>
            </div>
            <div class="stat-value" id="pendingApproval">0</div>
            <div class="stat-label">Awaiting confirmation</div>
        </div>
    </div>
</div>

<!-- Calendar View -->
<div class="chart-card mb-4">
    <div class="chart-header d-flex justify-content-between align-items-center">
        <h5>Verification Calendar</h5>
        <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-primary" onclick="previousWeek()">
                <i class="fa fa-chevron-left"></i> Previous
            </button>
            <button class="btn btn-outline-primary" onclick="nextWeek()">
                Next <i class="fa fa-chevron-right"></i>
            </button>
        </div>
    </div>
    <div id="calendarContainer">
        <!-- Calendar will be generated here -->
    </div>
</div>

<!-- Scheduled Visits Table -->
<div class="table-card">
    <div class="table-card-header d-flex justify-content-between align-items-center">
        <div>
            <h5>Scheduled Field Visits</h5>
            <p class="text-muted mb-0">Manage and track verification appointments</p>
        </div>
        <button class="btn btn-primary" onclick="showScheduleModal()">
            <i class="fa fa-plus"></i> Schedule New Visit
        </button>
    </div>
    <div class="table-responsive">
        <table class="table mb-0">
            <thead>
                <tr>
                    <th>Date & Time</th>
                    <th>Farmer</th>
                    <th>Location</th>
                    <th>Visit Type</th>
                    <th>Carbon Claims</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="visitsTableBody">
                <tr>
                    <td colspan="7" class="text-center text-muted">Loading...</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<!-- Schedule Modal -->
<div class="modal fade" id="scheduleModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Schedule Field Visit</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="scheduleForm">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Farmer</label>
                            <select class="form-select" id="farmerSelect" required>
                                <option value="">Select Farmer</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Visit Date</label>
                            <input type="date" class="form-control" id="visitDate" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Start Time</label>
                            <input type="time" class="form-control" id="startTime" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Duration (hours)</label>
                            <input type="number" class="form-control" id="duration" min="1" max="8" value="2" required>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label">Visit Type</label>
                            <select class="form-select" id="visitType" required>
                                <option value="field">Field Visit</option>
                                <option value="remote">Remote Verification</option>
                                <option value="hybrid">Hybrid (Field + Remote)</option>
                            </select>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label">Notes</label>
                            <textarea class="form-control" id="visitNotes" rows="3" placeholder="Special requirements or notes..."></textarea>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" onclick="saveSchedule()">Schedule Visit</button>
            </div>
        </div>
    </div>
</div>
@endsection

@section('js')
<script>
let currentWeek = new Date();
let scheduledVisits = [];

document.addEventListener('DOMContentLoaded', function() {
    // Set up axios with CSRF token for session authentication
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    if (csrfToken) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    }

    loadScheduledVisits();
    generateCalendar();

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('visitDate').min = today;
});

async function loadScheduledVisits() {
    try {
        const response = await axios.get('/verifier/api/my-verifications');
        scheduledVisits = response.data.data.verifications || [];

        updateDashboard();
        updateVisitsTable();
        populateFarmerSelect();

    } catch (error) {
        console.error('Error loading scheduled visits:', error);
        showError('Cannot load schedule data');
    }
}

function updateDashboard() {
    const today = new Date().toISOString().split('T')[0];
    const todayVisits = scheduledVisits.filter(v =>
        v.verification_date === today && v.verification_status === 'pending'
    ).length;

    const weekVisits = scheduledVisits.filter(v =>
        v.verification_status === 'pending'
    ).length;

    const pendingApproval = scheduledVisits.filter(v =>
        v.verification_status === 'pending'
    ).length;

    document.getElementById('todayVisits').textContent = todayVisits;
    document.getElementById('weekVisits').textContent = weekVisits;
    document.getElementById('pendingApproval').textContent = pendingApproval;
}

function updateVisitsTable() {
    const tbody = document.getElementById('visitsTableBody');

    if (scheduledVisits.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No schedule</td></tr>';
        return;
    }

    tbody.innerHTML = scheduledVisits.map(visit => `
        <tr>
            <td>
                <div class="fw-bold">${formatDate(visit.verification_date)}</div>
                <small class="text-muted">${visit.verification_type}</small>
            </td>
            <td>
                <div class="fw-bold">${visit.farmer_name || 'Unknown'}</div>
                <small class="text-muted">ID: ${visit.mrv_declaration_id}</small>
            </td>
            <td>${visit.location || 'N/A'}</td>
            <td>
                <span class="badge bg-info">${visit.verification_type}</span>
            </td>
            <td>${(visit.carbon_claims || 0).toFixed(1)} tCO₂e</td>
            <td>
                <span class="badge ${getStatusClass(visit.verification_status)}">
                    ${getStatusText(visit.verification_status)}
                </span>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="editVisit(${visit.id})">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-success" onclick="completeVisit(${visit.id})">
                        <i class="fa fa-check"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function generateCalendar() {
    const container = document.getElementById('calendarContainer');
    const weekStart = getWeekStart(currentWeek);

    let calendarHTML = '<div class="row g-2">';

    // Generate week days
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const dayVisits = scheduledVisits.filter(v => v.verification_date === dateStr);

        calendarHTML += `
            <div class="col">
                <div class="border rounded p-2 text-center ${date.toDateString() === new Date().toDateString() ? 'bg-primary text-white' : ''}">
                    <div class="fw-bold">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div class="small">${date.getDate()}</div>
                    <div class="mt-1">
                        ${dayVisits.length > 0 ? `<span class="badge bg-warning">${dayVisits.length}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    calendarHTML += '</div>';
    container.innerHTML = calendarHTML;
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}

function previousWeek() {
    currentWeek.setDate(currentWeek.getDate() - 7);
    generateCalendar();
}

function nextWeek() {
    currentWeek.setDate(currentWeek.getDate() + 7);
    generateCalendar();
}

function populateFarmerSelect() {
    const select = document.getElementById('farmerSelect');
    const farmers = [...new Set(scheduledVisits.map(v => v.farmer_name))].filter(Boolean);

    select.innerHTML = '<option value="">Select Farmer</option>' +
        farmers.map(farmer => `<option value="${farmer}">${farmer}</option>`).join('');
}

function showScheduleModal() {
    const modal = new bootstrap.Modal(document.getElementById('scheduleModal'));
    modal.show();
}

async function saveSchedule() {
    const formData = {
        farmer: document.getElementById('farmerSelect').value,
        visit_date: document.getElementById('visitDate').value,
        start_time: document.getElementById('startTime').value,
        duration: document.getElementById('duration').value,
        visit_type: document.getElementById('visitType').value,
        notes: document.getElementById('visitNotes').value
    };

    if (!formData.farmer || !formData.visit_date || !formData.start_time) {
        showError('Please fill in all required information');
        return;
    }

    try {
        // Here you would typically save to backend
        console.log('Scheduling visit:', formData);

        // Close modal and refresh
        bootstrap.Modal.getInstance(document.getElementById('scheduleModal')).hide();
        showSuccess('Schedule created successfully');

        // Refresh data
        loadScheduledVisits();

    } catch (error) {
        console.error('Error scheduling visit:', error);
        showError('Cannot schedule visit');
    }
}

function editVisit(visitId) {
    console.log('Edit visit:', visitId);
    // Implement edit functionality
}

function completeVisit(visitId) {
    console.log('Complete visit:', visitId);
    // Implement completion functionality
}

function getStatusClass(status) {
    const classes = {
        'pending': 'bg-warning',
        'in_progress': 'bg-primary',
        'completed': 'bg-success',
        'cancelled': 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
}

function getStatusText(status) {
    const texts = {
        'pending': 'Pending',
        'in_progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    return texts[status] || status;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function showError(message) {
    Swal.fire('Error', message, 'error');
}

function showSuccess(message) {
    Swal.fire('Success', message, 'success');
}
</script>
@endsection


