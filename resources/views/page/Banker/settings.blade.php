@extends('share.Banker.master')

@section('title')
    <div>
        <h1 class="mb-1">Settings</h1>
        <p class="text-muted">System settings and customization</p>
    </div>
@endsection

@section('content')
<div class="row g-3 mb-4">
    <div class="col-md-3">
        <div class="card">
            <div class="card-body">
                <div class="list-group list-group-flush">
                    <a href="#general" class="list-group-item list-group-item-action active" data-bs-toggle="tab">
                        <i class="fa fa-cog me-2"></i>General Settings
                    </a>
                    <a href="#loan" class="list-group-item list-group-item-action" data-bs-toggle="tab">
                        <i class="fa fa-hand-holding-usd me-2"></i>Loan Settings
                    </a>
                    <a href="#risk" class="list-group-item list-group-item-action" data-bs-toggle="tab">
                        <i class="fa fa-shield-alt me-2"></i>Risk Management
                    </a>
                    <a href="#notifications" class="list-group-item list-group-item-action" data-bs-toggle="tab">
                        <i class="fa fa-bell me-2"></i>Notifications
                    </a>
                    <a href="#security" class="list-group-item list-group-item-action" data-bs-toggle="tab">
                        <i class="fa fa-lock me-2"></i>Security
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-9">
        <div class="tab-content">
            <!-- General Settings -->
            <div class="tab-pane fade show active" id="general">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">General Settings</h5>
                    </div>
                    <div class="card-body">
                        <form id="generalSettingsForm">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">Bank Name</label>
                                    <input type="text" class="form-control" value="AgriBank Vietnam" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Currency</label>
                                    <select class="form-select">
                                        <option value="USD" selected>USD</option>
                                        <option value="VND">VND</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Time Zone</label>
                                    <select class="form-select">
                                        <option value="Asia/Ho_Chi_Minh" selected>Asia/Ho_Chi_Minh</option>
                                        <option value="UTC">UTC</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Language</label>
                                    <select class="form-select">
                                        <option value="vi" selected>Tiếng Việt</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Default Page Size</label>
                                    <select class="form-select">
                                        <option value="10">10 items</option>
                                        <option value="25" selected>25 items</option>
                                        <option value="50">50 items</option>
                                        <option value="100">100 items</option>
                                    </select>
                                </div>
                            </div>
                            <div class="mt-3">
                                <button type="submit" class="btn btn-primary">Save Changes</button>
                                <button type="button" class="btn btn-outline-secondary">Reset</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Loan Settings -->
            <div class="tab-pane fade" id="loan">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Loan Settings</h5>
                    </div>
                    <div class="card-body">
                        <form id="loanSettingsForm">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">Minimum Loan Amount</label>
                                    <div class="input-group">
                                        <span class="input-group-text">$</span>
                                        <input type="number" class="form-control" value="1000" min="0">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Maximum Loan Amount</label>
                                    <div class="input-group">
                                        <span class="input-group-text">$</span>
                                        <input type="number" class="form-control" value="100000" min="0">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Default Interest Rate (%)</label>
                                    <input type="number" class="form-control" value="8.5" step="0.1" min="0" max="30">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Default Loan Term (months)</label>
                                    <input type="number" class="form-control" value="12" min="1" max="60">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Processing Fee (%)</label>
                                    <input type="number" class="form-control" value="2.0" step="0.1" min="0" max="10">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Late Payment Fee (%)</label>
                                    <input type="number" class="form-control" value="5.0" step="0.1" min="0" max="20">
                                </div>
                                <div class="col-12">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="autoApproval" checked>
                                        <label class="form-check-label" for="autoApproval">
                                            Enable auto-approval for low-risk loans
                                        </label>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="carbonCredits" checked>
                                        <label class="form-check-label" for="carbonCredits">
                                            Consider carbon credits in risk assessment
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-3">
                                <button type="submit" class="btn btn-primary">Save Changes</button>
                                <button type="button" class="btn btn-outline-secondary">Reset</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Risk Management -->
            <div class="tab-pane fade" id="risk">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Risk Management Settings</h5>
                    </div>
                    <div class="card-body">
                        <form id="riskSettingsForm">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">High Risk Threshold</label>
                                    <input type="number" class="form-control" value="80" min="0" max="100">
                                    <small class="text-muted">Loans with risk score above this will be flagged</small>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Medium Risk Threshold</label>
                                    <input type="number" class="form-control" value="60" min="0" max="100">
                                    <small class="text-muted">Loans with risk score above this will require review</small>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Maximum Default Rate (%)</label>
                                    <input type="number" class="form-control" value="5.0" step="0.1" min="0" max="20">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Risk Assessment Frequency</label>
                                    <select class="form-select">
                                        <option value="daily">Daily</option>
                                        <option value="weekly" selected>Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <h6>Risk Factors Weight</h6>
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label">Credit History</label>
                                            <input type="range" class="form-range" min="0" max="100" value="25" id="creditHistory">
                                            <div class="d-flex justify-content-between">
                                                <small>0%</small>
                                                <small id="creditHistoryValue">25%</small>
                                                <small>100%</small>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Farm Performance</label>
                                            <input type="range" class="form-range" min="0" max="100" value="30" id="farmPerformance">
                                            <div class="d-flex justify-content-between">
                                                <small>0%</small>
                                                <small id="farmPerformanceValue">30%</small>
                                                <small>100%</small>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Carbon Credits</label>
                                            <input type="range" class="form-range" min="0" max="100" value="20" id="carbonCredits">
                                            <div class="d-flex justify-content-between">
                                                <small>0%</small>
                                                <small id="carbonCreditsValue">20%</small>
                                                <small>100%</small>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Market Conditions</label>
                                            <input type="range" class="form-range" min="0" max="100" value="15" id="marketConditions">
                                            <div class="d-flex justify-content-between">
                                                <small>0%</small>
                                                <small id="marketConditionsValue">15%</small>
                                                <small>100%</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-3">
                                <button type="submit" class="btn btn-primary">Save Changes</button>
                                <button type="button" class="btn btn-outline-secondary">Reset</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Notifications -->
            <div class="tab-pane fade" id="notifications">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Notification Settings</h5>
                    </div>
                    <div class="card-body">
                        <form id="notificationSettingsForm">
                            <div class="row g-3">
                                <div class="col-12">
                                    <h6>Email Notifications</h6>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="emailNewApplications" checked>
                                        <label class="form-check-label" for="emailNewApplications">
                                            New loan applications
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="emailHighRisk" checked>
                                        <label class="form-check-label" for="emailHighRisk">
                                            High-risk loan alerts
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="emailDefaults">
                                        <label class="form-check-label" for="emailDefaults">
                                            Loan defaults
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="emailReports" checked>
                                        <label class="form-check-label" for="emailReports">
                                            Monthly reports
                                        </label>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <h6>SMS Notifications</h6>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="smsUrgent">
                                        <label class="form-check-label" for="smsUrgent">
                                            Urgent alerts only
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="smsDaily">
                                        <label class="form-check-label" for="smsDaily">
                                            Daily summary
                                        </label>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <h6>System Notifications</h6>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="systemMaintenance" checked>
                                        <label class="form-check-label" for="systemMaintenance">
                                            System maintenance alerts
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="systemUpdates" checked>
                                        <label class="form-check-label" for="systemUpdates">
                                            System updates
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-3">
                                <button type="submit" class="btn btn-primary">Save Changes</button>
                                <button type="button" class="btn btn-outline-secondary">Reset</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Security -->
            <div class="tab-pane fade" id="security">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Security Settings</h5>
                    </div>
                    <div class="card-body">
                        <form id="securitySettingsForm">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">Session Timeout (minutes)</label>
                                    <input type="number" class="form-control" value="30" min="5" max="480">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Password Expiry (days)</label>
                                    <input type="number" class="form-control" value="90" min="30" max="365">
                                </div>
                                <div class="col-12">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="twoFactor" checked>
                                        <label class="form-check-label" for="twoFactor">
                                            Enable two-factor authentication
                                        </label>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="loginAlerts" checked>
                                        <label class="form-check-label" for="loginAlerts">
                                            Login alerts for suspicious activity
                                        </label>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="auditLog" checked>
                                        <label class="form-check-label" for="auditLog">
                                            Enable audit logging
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-3">
                                <button type="submit" class="btn btn-primary">Save Changes</button>
                                <button type="button" class="btn btn-outline-secondary">Reset</button>
                            </div>
                        </form>
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

    // Initialize range sliders
    initializeRangeSliders();

    // Form submissions
    document.getElementById('generalSettingsForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('loanSettingsForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('riskSettingsForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('notificationSettingsForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('securitySettingsForm').addEventListener('submit', handleFormSubmit);

    function initializeRangeSliders() {
        const sliders = [
            { id: 'creditHistory', valueId: 'creditHistoryValue' },
            { id: 'farmPerformance', valueId: 'farmPerformanceValue' },
            { id: 'carbonCredits', valueId: 'carbonCreditsValue' },
            { id: 'marketConditions', valueId: 'marketConditionsValue' }
        ];

        sliders.forEach(slider => {
            const rangeInput = document.getElementById(slider.id);
            const valueDisplay = document.getElementById(slider.valueId);

            rangeInput.addEventListener('input', function() {
                valueDisplay.textContent = this.value + '%';
            });
        });
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const formName = e.target.id;

        Swal.fire({
            title: 'Saving Settings',
            text: 'Please wait while we save your settings...',
            icon: 'info',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                // Simulate saving
                setTimeout(() => {
                    Swal.fire('Success', 'Settings saved successfully!', 'success');
                }, 1500);
            }
        });
    }

    // Tab switching
    document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(e) {
            // Update active state
            document.querySelectorAll('.list-group-item').forEach(item => {
                item.classList.remove('active');
            });
            e.target.classList.add('active');
        });
    });
});
</script>
@endsection
