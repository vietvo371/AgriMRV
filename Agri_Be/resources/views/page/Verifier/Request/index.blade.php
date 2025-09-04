@extends('share.Verifier.master')

@section('title')
    <div>
        <h1 class="mb-1">Request Review</h1>
        <p class="text-muted">Details and review of MRV verification requests</p>
    </div>
@endsection

@section('content')
<div class="row g-3 mb-4">
    <!-- Request Status -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Request Status</span>
                <div class="stat-card-icon primary"><i class="fa fa-clipboard-check"></i></div>
            </div>
            <div class="stat-value" id="requestStatus">Pending</div>
            <div class="stat-label">Current status</div>
        </div>
    </div>

    <!-- Carbon Performance Score -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Carbon Performance</span>
                <div class="stat-card-icon success"><i class="fa fa-leaf"></i></div>
            </div>
            <div class="stat-value" id="carbonPerformanceScore">0</div>
            <div class="stat-label">Out of 100</div>
        </div>
    </div>

    <!-- MRV Reliability Score -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>MRV Reliability</span>
                <div class="stat-card-icon warning"><i class="fa fa-shield-alt"></i></div>
            </div>
            <div class="stat-value" id="mrvReliabilityScore">0</div>
            <div class="stat-label">Out of 100</div>
        </div>
    </div>

    <!-- Final Score & Grade -->
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Final Score</span>
                <div class="stat-card-icon primary"><i class="fa fa-star"></i></div>
            </div>
            <div class="stat-value" id="finalScore">0</div>
            <div class="stat-label" id="gradeLabel">Grade: -</div>
        </div>
    </div>
</div>

<!-- Request Details -->
<div class="row g-3 mb-4">
    <div class="col-md-8">
        <!-- Farmer Information -->
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0"><i class="fa fa-user me-2"></i>Farmer Information</h5>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Full Name</label>
                        <p id="farmerName">Loading...</p>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Phone</label>
                        <p id="farmerPhone">Loading...</p>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Email</label>
                        <p id="farmerEmail">Loading...</p>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Location</label>
                        <p id="farmerLocation">Loading...</p>
                    </div>
                    <div class="col-md-12">
                        <label class="form-label fw-bold">Farm Profile</label>
                        <div class="row g-2">
                            <div class="col-md-4">
                                <small class="text-muted">Total Area</small>
                                <p class="mb-0" id="totalArea">Loading...</p>
                            </div>
                            <div class="col-md-4">
                                <small class="text-muted">Rice Area</small>
                                <p class="mb-0" id="riceArea">Loading...</p>
                            </div>
                            <div class="col-md-4">
                                <small class="text-muted">Agroforestry Area</small>
                                <p class="mb-0" id="agroArea">Loading...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- MRV Declaration Details -->
        <div class="card mt-3">
            <div class="card-header">
                <h5 class="mb-0"><i class="fa fa-file-text me-2"></i>MRV Declaration Details</h5>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Declaration Period</label>
                        <p id="declarationPeriod">Loading...</p>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Submission Date</label>
                        <p id="submissionDate">Loading...</p>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Rice Sowing Date</label>
                        <p id="riceSowingDate">Loading...</p>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Rice Harvest Date</label>
                        <p id="riceHarvestDate">Loading...</p>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold">AWD Cycles</label>
                        <p id="awdCycles">Loading...</p>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Water Management</label>
                        <p id="waterManagement">Loading...</p>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Straw Management</label>
                        <p id="strawManagement">Loading...</p>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Tree Density</label>
                        <p id="treeDensity">Loading...</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Scores Breakdown -->
        <div class="card mt-3">
            <div class="card-header">
                <h5 class="mb-0"><i class="fa fa-calculator me-2"></i>Scores Breakdown</h5>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <div class="text-center">
                            <h6 class="text-success">Carbon Performance</h6>
                            <div class="h4 text-success" id="carbonPerformanceDetail">0</div>
                            <small class="text-muted">60% Rice + 40% Agroforestry</small>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="text-center">
                            <h6 class="text-warning">MRV Reliability</h6>
                            <div class="h4 text-warning" id="mrvReliabilityDetail">0</div>
                            <small class="text-muted">50% Rice + 50% Agroforestry</small>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="text-center">
                            <h6 class="text-primary">Final Score</h6>
                            <div class="h4 text-primary" id="finalScoreDetail">0</div>
                            <small class="text-muted">70% CP + 30% MR</small>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-12">
                        <h6>Score Calculation Formula:</h6>
                        <ul class="small text-muted">
                            <li><strong>Carbon Performance:</strong> 60% Rice AWD (0.66 tCO₂e/ha) + 40% Agroforestry (0.022 tCO₂/tree/year)</li>
                            <li><strong>MRV Reliability:</strong> 50% Rice (Base 75 + AI confidence) + 50% Agroforestry (Base 70 + verification score)</li>
                            <li><strong>Final Score:</strong> 70% Carbon Performance + 30% MRV Reliability</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-4">
        <!-- Verification Actions -->
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0"><i class="fa fa-tasks me-2"></i>Verification Actions</h5>
            </div>
            <div class="card-body">
                <div class="d-grid gap-2">
                    <button class="btn btn-secondary" onclick="submitDeclaration()" id="submitBtn" style="display:none;">
                        <i class="fa fa-paper-plane me-2"></i>Submit Declaration
                    </button>
                    <button class="btn btn-primary" onclick="scheduleFieldVisit()">
                        <i class="fa fa-calendar me-2"></i>Schedule Field Visit
                    </button>
                    <button class="btn btn-info" onclick="requestAdditionalEvidence()">
                        <i class="fa fa-file-plus me-2"></i>Request Evidence
                    </button>
                    <button class="btn btn-success" onclick="approveRequest()">
                        <i class="fa fa-check me-2"></i>Approve Request
                    </button>
                    <button class="btn btn-warning" onclick="requestRevision()">
                        <i class="fa fa-edit me-2"></i>Request Revision
                    </button>
                    <button class="btn btn-danger" onclick="rejectRequest()">
                        <i class="fa fa-times me-2"></i>Reject Request
                    </button>
                </div>
            </div>
        </div>

        <!-- Verification Notes -->
        <div class="card mt-3">
            <div class="card-header">
                <h5 class="mb-0"><i class="fa fa-sticky-note me-2"></i>Verification Notes</h5>
            </div>
            <div class="card-body">
                <textarea class="form-control" id="verificationNotes" rows="4" placeholder="Add your verification notes here..."></textarea>
                <button class="btn btn-outline-primary btn-sm mt-2" onclick="saveNotes()">
                    <i class="fa fa-save me-1"></i>Save Notes
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Evidence Files -->
<div class="card">
    <div class="card-header">
        <h5 class="mb-0"><i class="fa fa-images me-2"></i>Evidence Files</h5>
    </div>
    <div class="card-body">
        <div id="evidenceFiles" class="row g-3">
            <div class="col-12 text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- AI Analysis Results -->
<div class="card mt-3">
    <div class="card-header">
        <h5 class="mb-0"><i class="fa fa-robot me-2"></i>AI Analysis Results</h5>
    </div>
    <div class="card-body">
        <div id="aiAnalysis" class="row g-3">
            <div class="col-12 text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('js')
<script>
let currentRequest = null;
let requestId = null;

document.addEventListener('DOMContentLoaded', function() {
    // Set up axios with CSRF token for session authentication
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    if (csrfToken) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    }

    // Get request ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    requestId = urlParams.get('id') || window.location.pathname.split('/').pop();

    if (requestId) {
        loadRequestDetails(requestId);
    } else {
        showError('Request ID not found');
    }
});

async function loadRequestDetails(requestId) {
    try {
        // Prefer consolidated detail endpoint
        const detailUrl = `/verifier/api/request/detail/${requestId}`;
        const resp = await axios.get(detailUrl);
        const { declaration, farmer, farmProfile, evidenceFiles, aiResults } = resp.data.data || {};

        currentRequest = { declaration, farmer, farmProfile, evidenceFiles, aiResults };
        updateUI();
    } catch (error) {
        console.error('Error loading request details:', error);
        showError('Unable to load request details');
    }
}

function updateUI() {
    if (!currentRequest) return;

    const { declaration, farmer, farmProfile, evidenceFiles, aiResults } = currentRequest;

    // Update farmer information
    document.getElementById('farmerName').textContent = farmer.full_name || 'N/A';
    document.getElementById('farmerPhone').textContent = farmer.phone || 'N/A';
    document.getElementById('farmerEmail').textContent = farmer.email || 'N/A';
    document.getElementById('farmerLocation').textContent = farmer.address || 'N/A';

    // Update farm profile
    document.getElementById('totalArea').textContent = `${farmProfile.total_area_hectares || 0} ha`;
    document.getElementById('riceArea').textContent = `${farmProfile.rice_area_hectares || 0} ha`;
    document.getElementById('agroArea').textContent = `${farmProfile.agroforestry_area_hectares || 0} ha`;

    // Update MRV declaration
    document.getElementById('declarationPeriod').textContent = declaration.declaration_period || 'N/A';
    document.getElementById('submissionDate').textContent = formatDate(declaration.created_at);
    document.getElementById('riceSowingDate').textContent = formatDate(declaration.rice_sowing_date);
    document.getElementById('riceHarvestDate').textContent = formatDate(declaration.rice_harvest_date);
    document.getElementById('awdCycles').textContent = declaration.awd_cycles_per_season || 'N/A';
    document.getElementById('waterManagement').textContent = declaration.water_management_method || 'N/A';
    document.getElementById('strawManagement').textContent = declaration.straw_management || 'N/A';
    document.getElementById('treeDensity').textContent = `${declaration.tree_density_per_hectare || 0} trees/ha`;


    // Update scores theo công thức backend
    const carbonPerformance = declaration.carbon_performance_score || 0;
    const mrvReliability = declaration.mrv_reliability_score || 0;
    const finalScore = Math.min(100, carbonPerformance * 0.7 + mrvReliability * 0.3);
    const grade = getGradeFromScore(finalScore);

    document.getElementById('carbonPerformanceScore').textContent = carbonPerformance.toFixed(1);
    document.getElementById('mrvReliabilityScore').textContent = mrvReliability.toFixed(1);
    document.getElementById('finalScore').textContent = finalScore.toFixed(1);
    document.getElementById('gradeLabel').textContent = `Grade: ${grade}`;

    // Update scores breakdown section
    document.getElementById('carbonPerformanceDetail').textContent = carbonPerformance.toFixed(1);
    document.getElementById('mrvReliabilityDetail').textContent = mrvReliability.toFixed(1);
    document.getElementById('finalScoreDetail').textContent = finalScore.toFixed(1);

    // Add grade-specific styling
    const finalScoreElement = document.getElementById('finalScore');
    finalScoreElement.className = 'stat-value';
    switch (grade) {
        case 'A': finalScoreElement.classList.add('text-success'); break;
        case 'B': finalScoreElement.classList.add('text-primary'); break;
        case 'C': finalScoreElement.classList.add('text-warning'); break;
        case 'D': finalScoreElement.classList.add('text-orange'); break;
        case 'F': finalScoreElement.classList.add('text-danger'); break;
        default: finalScoreElement.classList.add('text-muted');
    }

    // Update request status
    const statusElement = document.getElementById('requestStatus');
    const statusText = declaration.status || 'Unknown';
    statusElement.textContent = statusText.charAt(0).toUpperCase() + statusText.slice(1);

    // Add status-specific styling
    statusElement.className = 'stat-value';
    switch (declaration.status) {
        case 'draft':
            statusElement.classList.add('text-warning');
            break;
        case 'submitted':
            statusElement.classList.add('text-info');
            break;
        case 'verified':
            statusElement.classList.add('text-success');
            break;
        case 'rejected':
            statusElement.classList.add('text-danger');
            break;
        default:
            statusElement.classList.add('text-muted');
    }

    // Toggle submit button if status is draft
    const submitBtn = document.getElementById('submitBtn');
    if (declaration.status === 'draft') {
        submitBtn.style.display = 'block';
    } else {
        submitBtn.style.display = 'none';
    }

    // Update evidence files
    updateEvidenceFiles(evidenceFiles);

    // Update AI analysis
    updateAIAnalysis(aiResults);
}

function updateEvidenceFiles(files) {
    const container = document.getElementById('evidenceFiles');

    if (files.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-muted">No evidence files</div>';
        return;
    }

    container.innerHTML = files.map(file => {
        const url = resolveEvidenceUrl(file.file_url || file.path || '');
        return `
        <div class="col-md-4 col-lg-3">
            <div class="card h-100">
                <img src="${url}" class="card-img-top" alt="${file.file_type}" style="height: 150px; object-fit: cover;">
                <div class="card-body">
                    <h6 class="card-title">${file.file_type}</h6>
                    <p class="card-text small">${file.description || 'No description'}</p>
                    <small class="text-muted">${formatDate(file.capture_timestamp)}</small>
                </div>
                <div class="card-footer">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewFile('${url}')">
                        <i class="fa fa-eye"></i> View
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function updateAIAnalysis(results) {
    const container = document.getElementById('aiAnalysis');

    if (!results || results.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-muted">No AI analysis results</div>';
        return;
    }

    container.innerHTML = results.map(result => `
        <div class="col-md-6">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title">${result.analysis_type}</h6>
                    <div class="mb-2">
                        <strong>Confidence:</strong>
                        <span class="badge bg-${getConfidenceClass(Number(result.confidence_score ?? 0))}">
                            ${Number(result.confidence_score ?? 0).toFixed(1)}%
                        </span>
                    </div>
                    <div class="mb-2">
                        <strong>Findings:</strong>
                        <p class="mb-0">${result.analysis_findings || 'No findings'}</p>
                    </div>
                    <small class="text-muted">Analyzed: ${formatDate(result.analysis_timestamp)}</small>
                </div>
            </div>
        </div>
    `).join('');
}

function getConfidenceClass(score) {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
}

/**
 * Tính grade theo công thức backend
 * A: ≥75, B: ≥60, C: ≥45, D: ≥30, F: <30
 */
function getGradeFromScore(score) {
    if (score >= 75) return 'A'; // Xuất sắc
    if (score >= 60) return 'B'; // Tốt
    if (score >= 45) return 'C'; // Trung bình
    if (score >= 30) return 'D'; // Yếu
    return 'F'; // Kém
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Chuẩn hóa URL evidence về dạng tuyệt đối: http(s)://host/storage/uploads/evidence/...,
// đồng thời loại bỏ tiền tố không mong muốn như '@' hoặc '/verifier/request'
function resolveEvidenceUrl(raw) {
    if (!raw) return '';
    let url = String(raw).trim();

    // Bỏ ký tự '@' nếu có
    if (url.startsWith('@')) url = url.slice(1);

    // Nếu là URL đầy đủ, chỉ cần loại bỏ phần '/verifier/request' nếu có
    if (/^https?:\/\//i.test(url)) {
        return url.replace('/verifier/request', '');
    }

    // Loại bỏ prefix route không mong muốn
    url = url.replace(/^\/?verifier\/request\/?/i, '/');

    // Chuẩn hóa các trường hợp đường dẫn tương đối
    if (url.startsWith('/storage/uploads/evidence')) {
        // đã đúng định dạng gốc storage
    } else if (url.startsWith('/uploads/evidence')) {
        url = '/storage' + url;
    } else if (url.startsWith('uploads/evidence')) {
        url = '/storage/' + url;
    }

    if (!url.startsWith('/')) url = '/' + url;

    return window.location.origin + url;
}

// Verification Actions
function scheduleFieldVisit() {
    if (!currentRequest) return;

    // Status check
    if (currentRequest.declaration?.status !== 'submitted') {
        showError('You can only schedule a field visit for submitted declarations');
        return;
    }

    Swal.fire({
        title: 'Schedule Field Visit',
        html: `
            <div class="mb-3">
                <label class="form-label">Verification Date *</label>
                <input type="date" id="fieldVisitDate" class="form-control"
                       min="${new Date().toISOString().slice(0,10)}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Notes (Optional)</label>
                <textarea id="fieldVisitNotes" class="form-control" rows="3"
                          placeholder="Add notes for field visit..."></textarea>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Schedule',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
            const date = document.getElementById('fieldVisitDate').value;
            if (!date) {
                Swal.showValidationMessage('Please select a verification date');
                return false;
            }
            return {
                verification_date: date,
                notes: document.getElementById('fieldVisitNotes').value || null,
                verification_type: 'field'
            };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axios.post(`/verifier/api/declarations/${requestId}/schedule`, result.value);
                showSuccess('Field visit scheduled successfully');
                // Reload details to update status
                await loadRequestDetails(requestId);
            } catch (e) {
                showError('Unable to schedule field visit: ' + (e.response?.data?.message || e.message));
            }
        }
    });
}

function requestAdditionalEvidence() {
    if (!currentRequest) return;

    // Status check
    if (currentRequest.declaration?.status !== 'submitted') {
        showError('You can only request evidence for submitted declarations');
        return;
    }

    Swal.fire({
        title: 'Request Additional Evidence',
        input: 'textarea',
        inputLabel: 'Evidence Requirements',
        inputPlaceholder: 'Describe what additional evidence is needed...',
        inputValidator: (value) => {
            if (!value || value.trim().length < 10) {
                return 'Please enter at least 10 characters describing the evidence requirements';
            }
        },
        showCancelButton: true,
        confirmButtonText: 'Send Request',
        cancelButtonText: 'Cancel'
    }).then(async (result) => {
        if (result.isConfirmed && result.value) {
            try {
                await axios.post(`/verifier/api/declarations/${requestId}/request-revision`, {
                    comments: result.value,
                    verification_type: 'remote'
                });
                showSuccess('Evidence request sent successfully');
                // Reload details to update status
                await loadRequestDetails(requestId);
            } catch (e) {
                showError('Unable to send evidence request: ' + (e.response?.data?.message || e.message));
            }
        }
    });
}

function approveRequest() {
    if (!currentRequest) return;

    // Status check
    if (currentRequest.declaration?.status !== 'submitted') {
        showError('You can only approve submitted declarations');
        return;
    }

    Swal.fire({
        title: 'Approve Request',
        html: `
            <div class="mb-3">
                <label class="form-label">Verification Score (0-100)</label>
                <input type="number" id="verificationScore" class="form-control"
                       min="0" max="100" value="85"
                       placeholder="Enter verification score">
            </div>
            <div class="mb-3">
                <label class="form-label">Verification Type</label>
                <select id="verificationType" class="form-control">
                    <option value="remote">Remote Verification</option>
                    <option value="field">Field Verification</option>
                    <option value="hybrid">Hybrid Verification</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Comments (Optional)</label>
                <textarea id="approvalComments" class="form-control" rows="3"
                          placeholder="Add verification comments..."></textarea>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Approve',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
            const score = document.getElementById('verificationScore').value;
            if (!score || score < 0 || score > 100) {
                Swal.showValidationMessage('Please enter a valid score between 0-100');
                return false;
            }
            return {
                score: parseInt(score),
                verification_type: document.getElementById('verificationType').value,
                comments: document.getElementById('approvalComments').value
            };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axios.post(`/verifier/api/declarations/${requestId}/approve`, {
                    score: result.value.score,
                    verification_type: result.value.verification_type,
                    comments: result.value.comments || null
                });
                showSuccess('Request approved successfully');
                // Reload details to update status
                await loadRequestDetails(requestId);
            } catch (e) {
                showError('Unable to approve request: ' + (e.response?.data?.message || e.message));
            }
        }
    });
}

function requestRevision() {
    if (!currentRequest) return;

    // Status check
    if (currentRequest.declaration?.status !== 'submitted') {
        showError('You can only request revision for submitted declarations');
        return;
    }

    Swal.fire({
        title: 'Request Revision',
        input: 'textarea',
        inputLabel: 'Revision Requirements',
        inputPlaceholder: 'Describe what needs to be revised...',
        inputValidator: (value) => {
            if (!value || value.trim().length < 10) {
                return 'Please enter at least 10 characters describing the revision requirements';
            }
        },
        showCancelButton: true,
        confirmButtonText: 'Send Request',
        cancelButtonText: 'Cancel'
    }).then(async (result) => {
        if (result.isConfirmed && result.value) {
            try {
                await axios.post(`/verifier/api/declarations/${requestId}/request-revision`, {
                    comments: result.value,
                    verification_type: 'remote'
                });
                showSuccess('Revision request sent successfully');
                // Reload details to update status
                await loadRequestDetails(requestId);
            } catch (e) {
                showError('Unable to send revision request: ' + (e.response?.data?.message || e.message));
            }
        }
    });
}

function rejectRequest() {
    if (!currentRequest) return;

    // Status check - only allow reject for submitted
    if (currentRequest.declaration?.status !== 'submitted') {
        showError('You can only reject submitted declarations');
        return;
    }

    Swal.fire({
        title: 'Reject Request',
        html: `
            <div class="mb-3">
                <label class="form-label">Rejection Reason *</label>
                <textarea id="rejectionReason" class="form-control" rows="4"
                          placeholder="Provide detailed reason for rejection..." required></textarea>
            </div>
            <div class="mb-3">
                <label class="form-label">Verification Type</label>
                <select id="rejectionVerificationType" class="form-control">
                    <option value="remote">Remote Verification</option>
                    <option value="field">Field Verification</option>
                    <option value="hybrid">Hybrid Verification</option>
                </select>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Reject',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#dc3545',
        preConfirm: () => {
            const reason = document.getElementById('rejectionReason').value;
            if (!reason || reason.trim().length < 10) {
                Swal.showValidationMessage('Please provide a detailed rejection reason (at least 10 characters)');
                return false;
            }
            return {
                reason: reason.trim(),
                verification_type: document.getElementById('rejectionVerificationType').value
            };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axios.post(`/verifier/api/declarations/${requestId}/reject`, {
                    reason: result.value.reason,
                    verification_type: result.value.verification_type
                });
                showSuccess('Request rejected successfully');
                // Reload details to update status
                await loadRequestDetails(requestId);
            } catch (e) {
                showError('Unable to reject request: ' + (e.response?.data?.message || e.message));
            }
        }
    });
}

function saveNotes() {
    const notes = document.getElementById('verificationNotes').value;
    if (!notes.trim()) {
        showError('Please enter verification notes');
        return;
    }
    showSuccess('Notes saved locally');
}

async function submitDeclaration() {
    if (!currentRequest) return;

    // Status check
    if (currentRequest.declaration?.status !== 'draft') {
        showError('You can only submit declarations in draft status');
        return;
    }

    // Xác nhận trước khi submit
    const result = await Swal.fire({
        title: 'Submit Declaration',
        text: 'Are you sure you want to submit this declaration for verification?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            await axios.post(`/verifier/api/declarations/${requestId}/submit`);
            showSuccess('Declaration submitted successfully');
            // Reload details to update status
            await loadRequestDetails(requestId);
        } catch (e) {
            showError('Unable to submit declaration: ' + (e.response?.data?.message || e.message));
        }
    }
}

function viewFile(fileUrl) {
    window.open(fileUrl, '_blank');
}

function showError(message) {
    Swal.fire('Error', message, 'error');
}

function showSuccess(message) {
    Swal.fire('Success', message, 'success');
}
</script>
@endsection


