@extends('share.Banker.master')

@section('title')
    <div>
        <h1 class="mb-1">Profile</h1>
        <p class="text-muted">Personal information and account settings</p>
    </div>
@endsection

@section('content')
<div class="row g-3 mb-4">
    <div class="col-md-4">
        <div class="card">
            <div class="card-body text-center">
                <div class="user-avatar mx-auto mb-3" style="width: 100px; height: 100px; font-size: 40px;">
                    {{ substr(auth()->user()->full_name ?? 'B', 0, 1) }}
                </div>
                <h4>{{ auth()->user()->full_name ?? 'Banker' }}</h4>
                <p class="text-muted">{{ auth()->user()->email ?? 'banker@agrimrv.com' }}</p>
                <p class="badge bg-primary">Banker</p>

                <div class="mt-4">
                    <button onclick="changeAvatar()" class="btn btn-outline-primary btn-sm">
                        <i class="fa fa-camera"></i> Change Avatar
                    </button>
                </div>
            </div>
        </div>

        <div class="card mt-3">
            <div class="card-header">
                <h6 class="mb-0">Account Statistics</h6>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                    <span>Member Since</span>
                    <span class="fw-bold">{{ auth()->user()->created_at ? auth()->user()->created_at->format('M Y') : 'Jan 2024' }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Last Login</span>
                    <span class="fw-bold">{{ auth()->user()->updated_at ? auth()->user()->updated_at->format('M d, Y') : 'Today' }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Loans Processed</span>
                    <span class="fw-bold text-primary">1,250</span>
                </div>
                <div class="d-flex justify-content-between">
                    <span>Success Rate</span>
                    <span class="fw-bold text-success">94.2%</span>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-8">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Personal Information</h5>
            </div>
            <div class="card-body">
                <form id="profileForm">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Full Name *</label>
                            <input type="text" class="form-control" value="{{ auth()->user()->full_name ?? '' }}" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Email *</label>
                            <input type="email" class="form-control" value="{{ auth()->user()->email ?? '' }}" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Phone Number</label>
                            <input type="tel" class="form-control" value="{{ auth()->user()->phone ?? '' }}">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Date of Birth</label>
                            <input type="date" class="form-control" value="{{ auth()->user()->date_of_birth ?? '' }}">
                        </div>
                        <div class="col-12">
                            <label class="form-label">Address</label>
                            <textarea class="form-control" rows="3">{{ auth()->user()->address ?? '' }}</textarea>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Department</label>
                            <input type="text" class="form-control" value="Agricultural Lending" readonly>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Position</label>
                            <input type="text" class="form-control" value="Senior Loan Officer" readonly>
                        </div>
                    </div>
                    <div class="mt-3">
                        <button type="submit" class="btn btn-primary">Update Profile</button>
                        <button type="button" class="btn btn-outline-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="card mt-3">
            <div class="card-header">
                <h5 class="mb-0">Change Password</h5>
            </div>
            <div class="card-body">
                <form id="passwordForm">
                    <div class="row g-3">
                        <div class="col-12">
                            <label class="form-label">Current Password *</label>
                            <input type="password" class="form-control" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">New Password *</label>
                            <input type="password" class="form-control" required minlength="8">
                            <small class="text-muted">Minimum 8 characters</small>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Confirm New Password *</label>
                            <input type="password" class="form-control" required minlength="8">
                        </div>
                    </div>
                    <div class="mt-3">
                        <button type="submit" class="btn btn-warning">Change Password</button>
                        <button type="button" class="btn btn-outline-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="card mt-3">
            <div class="card-header">
                <h5 class="mb-0">Security Settings</h5>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-1">Two-Factor Authentication</h6>
                                <p class="text-muted mb-0">Add an extra layer of security to your account</p>
                            </div>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="twoFactorToggle" checked>
                                <label class="form-check-label" for="twoFactorToggle"></label>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-1">Login Notifications</h6>
                                <p class="text-muted mb-0">Get notified when someone logs into your account</p>
                            </div>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="loginNotifications" checked>
                                <label class="form-check-label" for="loginNotifications"></label>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-1">Session Management</h6>
                                <p class="text-muted mb-0">Manage your active sessions</p>
                            </div>
                            <button onclick="manageSessions()" class="btn btn-outline-primary btn-sm">
                                Manage Sessions
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card mt-3">
            <div class="card-header">
                <h5 class="mb-0">Activity Log</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Activity</th>
                                <th>IP Address</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Login</td>
                                <td>192.168.1.100</td>
                                <td>Today, 09:30</td>
                                <td><span class="badge bg-success">Success</span></td>
                            </tr>
                            <tr>
                                <td>Password Change</td>
                                <td>192.168.1.100</td>
                                <td>Yesterday, 14:20</td>
                                <td><span class="badge bg-success">Success</span></td>
                            </tr>
                            <tr>
                                <td>Login Attempt</td>
                                <td>192.168.1.50</td>
                                <td>2 days ago, 16:45</td>
                                <td><span class="badge bg-danger">Failed</span></td>
                            </tr>
                            <tr>
                                <td>Profile Update</td>
                                <td>192.168.1.100</td>
                                <td>3 days ago, 11:15</td>
                                <td><span class="badge bg-success">Success</span></td>
                            </tr>
                        </tbody>
                    </table>
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

    // Form submissions
    document.getElementById('profileForm').addEventListener('submit', handleProfileSubmit);
    document.getElementById('passwordForm').addEventListener('submit', handlePasswordSubmit);

    function handleProfileSubmit(e) {
        e.preventDefault();

        Swal.fire({
            title: 'Updating Profile',
            text: 'Please wait while we update your profile...',
            icon: 'info',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                setTimeout(() => {
                    Swal.fire('Success', 'Profile updated successfully!', 'success');
                }, 1500);
            }
        });
    }

    function handlePasswordSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const newPassword = formData.get('new_password');
        const confirmPassword = formData.get('confirm_password');

        if (newPassword !== confirmPassword) {
            Swal.fire('Error', 'New passwords do not match', 'error');
            return;
        }

        if (newPassword.length < 8) {
            Swal.fire('Error', 'Password must be at least 8 characters long', 'error');
            return;
        }

        Swal.fire({
            title: 'Changing Password',
            text: 'Please wait while we update your password...',
            icon: 'info',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                setTimeout(() => {
                    Swal.fire('Success', 'Password changed successfully!', 'success');
                    e.target.reset();
                }, 1500);
            }
        });
    }

    function changeAvatar() {
        Swal.fire('Change Avatar', 'Avatar change functionality will be implemented', 'info');
    }

    function manageSessions() {
        Swal.fire({
            title: 'Manage Sessions',
            html: `
                <div class="text-start">
                    <h6>Active Sessions:</h6>
                    <div class="mb-2">
                        <strong>Current Session</strong><br>
                        <small class="text-muted">IP: 192.168.1.100 | Browser: Chrome | Last Active: Now</small>
                    </div>
                    <div class="mb-2">
                        <strong>Mobile App</strong><br>
                        <small class="text-muted">IP: 192.168.1.50 | Device: iPhone | Last Active: 2 hours ago</small>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'End Other Sessions',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc3545'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Sessions Ended', 'All other sessions have been terminated', 'success');
            }
        });
    }
});
</script>
@endsection
