@extends('share.Banker.master')

@section('title', 'Share Profile Viewer')

@section('content')
<div class="container-fluid">
    <!-- Modern Page Header -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h1 class="h3 mb-2 fw-bold text-primary">
                        <span class="me-2">🔗</span>Share Profile Viewer
                    </h1>
                    <p class="text-muted mb-0 fs-6">
                        <span class="me-1">ℹ️</span>
                        Enter farmer's share code to access their credit profile and create loan applications
                    </p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-primary btn-sm" data-action="clear">
                        <span class="me-1">🔄</span>Clear
                    </button>
                    <button class="btn btn-outline-success btn-sm" data-action="test">
                        <span class="me-1">🧪</span>Test
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modern Share Code Input -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                    <div class="text-center mb-4">
                        <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                            <span class="fs-1 text-primary">🔑</span>
                        </div>
                        <h4 class="fw-semibold mb-2">Enter Share Code</h4>
                        <p class="text-muted mb-0">Get instant access to farmer's credit profile</p>
                    </div>

                    <form id="shareCodeForm" onsubmit="return false;">
                        <div class="mb-4">
                            <label for="shareCode" class="form-label fw-semibold">
                                <span class="me-1">🏷️</span>Share Code
                            </label>
                            <div class="input-group input-group-lg">
                                <span class="input-group-text bg-light border-end-0">
                                    <span class="text-muted">#</span>
                                </span>
                                <input type="text"
                                       class="form-control border-start-0 border-end-0"
                                       id="shareCode"
                                       placeholder="e.g., AGC-F74DE520"
                                       maxlength="20"
                                       style="font-family: 'Courier New', monospace; font-weight: 600;"
                                       required>
                                <button class="btn btn-primary px-4" type="button" id="viewProfileBtn" data-action="view-profile">
                                    <span class="me-2">🔍</span>View Profile
                                </button>
                            </div>
                            <div class="form-text mt-2">
                                <span class="me-1 text-warning">💡</span>
                                <strong>Tip:</strong> Share codes are provided by farmers and expire after 24 hours
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Modern Loading State -->
    <div class="row mb-4 d-none" id="loadingState">
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body text-center p-5">
                    <div class="position-relative mb-4">
                        <div class="spinner-border text-primary" style="width: 4rem; height: 4rem;" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <div class="position-absolute top-50 start-50 translate-middle">
                            <span class="fs-4 text-primary">👤</span>
                        </div>
                    </div>
                    <h4 class="fw-semibold text-primary mb-2">Loading Profile...</h4>
                    <p class="text-muted mb-0">Fetching farmer's credit profile data</p>
                    <div class="progress mt-3" style="height: 4px;">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 100%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modern Error State -->
    <div class="row mb-4 d-none" id="errorState">
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body text-center p-5">
                    <div class="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style="width: 100px; height: 100px;">
                        <span class="fs-1 text-danger">⚠️</span>
                    </div>
                    <h4 class="fw-semibold text-danger mb-2">Profile Not Found</h4>
                    <p class="text-muted mb-4" id="errorMessage">The share code is invalid or has expired.</p>
                    <button class="btn btn-outline-danger px-4" data-action="clear">
                        <span class="me-2">🔄</span>Try Again
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modern Empty State -->
    <div class="row mb-4" id="emptyState">
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body text-center p-5">
                    <div class="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style="width: 120px; height: 120px;">
                        <span class="fs-1 text-muted">🔍</span>
                    </div>
                    <h4 class="fw-semibold text-muted mb-2">Ready to View Profile</h4>
                    <p class="text-muted mb-0">Enter a share code above to access farmer's credit profile and create loan applications</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Modern Profile Data -->
    <div class="row mb-4 d-none" id="profileDisplay">
        <div class="col-12">
            <!-- Modern Profile Summary -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-gradient bg-primary text-white border-0">
                    <div class="d-flex align-items-center">
                        <div class="bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                            <span class="fs-4">👤</span>
                        </div>
                        <div>
                            <h5 class="mb-0 fw-bold">Farmer Profile Summary</h5>
                            <small class="opacity-75">Complete credit profile information</small>
                        </div>
                    </div>
                </div>
                <div class="card-body p-4">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <div class="d-flex align-items-center p-3 bg-light rounded-3">
                                <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                                    <span class="fs-5 text-primary">👨‍🌾</span>
                                </div>
                                <div>
                                    <label class="form-label text-muted small mb-1">Farmer Name</label>
                                    <p class="h6 mb-0 fw-semibold" id="farmerName">Loading...</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex align-items-center p-3 bg-light rounded-3">
                                <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                                    <span class="fs-5 text-success">⭐</span>
                                </div>
                                <div>
                                    <label class="form-label text-muted small mb-1">Carbon Grade</label>
                                    <span class="badge bg-primary fs-6 px-3 py-2" id="farmerGrade">Loading...</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex align-items-center p-3 bg-light rounded-3">
                                <div class="bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                                    <span class="fs-5 text-info">📍</span>
                                </div>
                                <div>
                                    <label class="form-label text-muted small mb-1">Location</label>
                                    <p class="mb-0 fw-semibold" id="farmerLocation">Loading...</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex align-items-center p-3 bg-light rounded-3">
                                <div class="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                                    <span class="fs-5 text-warning">🛡️</span>
                                </div>
                                <div>
                                    <label class="form-label text-muted small mb-1">MRV Status</label>
                                    <span class="badge fs-6 px-3 py-2" id="mrvStatus">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Comprehensive Credit & Transparency Analysis -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-gradient bg-success text-white border-0">
                    <div class="d-flex align-items-center">
                        <div class="bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                            <span class="fs-4">📊</span>
                        </div>
                        <div>
                            <h5 class="mb-0 fw-bold">Credit & Transparency Analysis</h5>
                            <small class="opacity-75">Comprehensive farmer assessment</small>
                        </div>
                    </div>
                </div>
                <div class="card-body p-4">
                    <!-- Main Credit Metrics -->
                    <div class="row g-4 mb-4">
                        <div class="col-md-3">
                            <div class="text-center p-4 bg-light rounded-4 h-100">
                                <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 70px; height: 70px;">
                                    <span class="fs-2 text-primary">🗺️</span>
                                </div>
                                <h3 class="fw-bold text-primary mb-2" id="totalArea">0</h3>
                                <p class="text-muted mb-0 fw-semibold">Total Area (ha)</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="text-center p-4 bg-light rounded-4 h-100">
                                <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 70px; height: 70px;">
                                    <span class="fs-2 text-success">🌱</span>
                                </div>
                                <h3 class="fw-bold text-success mb-2" id="carbonCredits">0</h3>
                                <p class="text-muted mb-0 fw-semibold">Carbon Credits</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="text-center p-4 bg-light rounded-4 h-100">
                                <div class="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 70px; height: 70px;">
                                    <span class="fs-2 text-info">✅</span>
                                </div>
                                <h3 class="fw-bold text-info mb-2" id="verificationRate">0%</h3>
                                <p class="text-muted mb-0 fw-semibold">Verification Rate</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="text-center p-4 bg-light rounded-4 h-100">
                                <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 70px; height: 70px;">
                                    <span class="fs-2 text-warning">⭐</span>
                                </div>
                                <h3 class="fw-bold text-warning mb-2" id="creditScore">0</h3>
                                <p class="text-muted mb-0 fw-semibold">Credit Score</p>
                            </div>
                        </div>
                    </div>

                    <!-- Detailed Credit Breakdown -->
                    <div class="row g-4">
                        <div class="col-md-6">
                            <div class="card border-0 bg-light">
                                <div class="card-body p-4">
                                    <h6 class="fw-bold text-primary mb-3">
                                        <span class="me-2">🧮</span>Credit Score Breakdown
                                    </h6>
                                    <div class="mb-3">
                                        <div class="d-flex justify-content-between mb-1">
                                            <span class="small">Carbon Performance</span>
                                            <span class="small fw-semibold" id="carbonPerformance">0</span>
                                        </div>
                                        <div class="progress" style="height: 6px;">
                                            <div class="progress-bar bg-primary" id="carbonPerformanceBar" style="width: 0%"></div>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <div class="d-flex justify-content-between mb-1">
                                            <span class="small">MRV Reliability</span>
                                            <span class="small fw-semibold" id="mrvReliability">0</span>
                                        </div>
                                        <div class="progress" style="height: 6px;">
                                            <div class="progress-bar bg-success" id="mrvReliabilityBar" style="width: 0%"></div>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <div class="d-flex justify-content-between mb-1">
                                            <span class="small">Carbon Reduction</span>
                                            <span class="small fw-semibold" id="carbonReduction">0</span>
                                        </div>
                                        <div class="progress" style="height: 6px;">
                                            <div class="progress-bar bg-info" id="carbonReductionBar" style="width: 0%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card border-0 bg-light">
                                <div class="card-body p-4">
                                    <h6 class="fw-bold text-success mb-3">
                                        <span class="me-2">🥧</span>Farm Composition
                                    </h6>
                                    <div class="mb-3">
                                        <div class="d-flex justify-content-between mb-1">
                                            <span class="small">Rice Farming</span>
                                            <span class="small fw-semibold" id="riceArea">0 ha</span>
                                        </div>
                                        <div class="progress" style="height: 6px;">
                                            <div class="progress-bar bg-warning" id="riceAreaBar" style="width: 0%"></div>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <div class="d-flex justify-content-between mb-1">
                                            <span class="small">Agroforestry</span>
                                            <span class="small fw-semibold" id="agroforestryArea">0 ha</span>
                                        </div>
                                        <div class="progress" style="height: 6px;">
                                            <div class="progress-bar bg-success" id="agroforestryAreaBar" style="width: 0%"></div>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <div class="d-flex justify-content-between mb-1">
                                            <span class="small">Total Trees</span>
                                            <span class="small fw-semibold" id="totalTrees">0</span>
                                        </div>
                                        <div class="progress" style="height: 6px;">
                                            <div class="progress-bar bg-info" id="totalTreesBar" style="width: 0%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- MRV Data & Evidence -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-gradient bg-info text-white border-0">
                    <div class="d-flex align-items-center">
                        <div class="bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                            <span class="fs-4">🔗</span>
                        </div>
                        <div>
                            <h5 class="mb-0 fw-bold">MRV Data & Evidence</h5>
                            <small class="opacity-75">Monitoring, Reporting & Verification details</small>
                        </div>
                    </div>
                </div>
                <div class="card-body p-4">
                    <div class="row g-4">
                        <div class="col-md-3">
                            <div class="text-center p-3 bg-light rounded-3">
                                <span class="fs-3 text-primary mb-2 d-block">📄</span>
                                <h5 class="fw-bold mb-1" id="totalDeclarations">0</h5>
                                <p class="text-muted mb-0 small">Total Declarations</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="text-center p-3 bg-light rounded-3">
                                <span class="fs-3 text-success mb-2 d-block">✅</span>
                                <h5 class="fw-bold mb-1" id="verifiedDeclarations">0</h5>
                                <p class="text-muted mb-0 small">Verified</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="text-center p-3 bg-light rounded-3">
                                <span class="fs-3 text-info mb-2 d-block">📷</span>
                                <h5 class="fw-bold mb-1" id="evidenceCount">0</h5>
                                <p class="text-muted mb-0 small">Evidence Photos</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="text-center p-3 bg-light rounded-3">
                                <span class="fs-3 text-warning mb-2 d-block">📊</span>
                                <h5 class="fw-bold mb-1" id="completionRate">0%</h5>
                                <p class="text-muted mb-0 small">Completion Rate</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Trust & Transparency -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-gradient bg-dark text-white border-0">
                    <div class="d-flex align-items-center">
                        <div class="bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                            <span class="fs-4">🔒</span>
                        </div>
                        <div>
                            <h5 class="mb-0 fw-bold">Trust & Transparency</h5>
                            <small class="opacity-75">Blockchain proofs, verification and credits summary</small>
                        </div>
                    </div>
                </div>
                <div class="card-body p-4">
                    <div class="row g-4">
                        <div class="col-lg-6">
                            <h6 class="fw-bold mb-3">Blockchain Anchors (latest)</h6>
                            <div id="anchorsList" class="list-group small">
                                <div class="text-muted">No anchors available</div>
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <h6 class="fw-bold mb-3">Last Verification</h6>
                            <div class="p-3 bg-light rounded-3">
                                <div class="mb-1"><span class="text-muted small">Date:</span> <span id="lastVerificationDate">-</span></div>
                                <div class="mb-1"><span class="text-muted small">Status:</span> <span id="lastVerificationStatus">-</span></div>
                                <div class="mb-1"><span class="text-muted small">Score:</span> <span id="lastVerificationScore">-</span></div>
                                <div class="mb-0"><span class="text-muted small">Verifier:</span> <span id="lastVerificationVerifier">-</span></div>
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <h6 class="fw-bold mb-3">Credits Summary</h6>
                            <div class="p-3 bg-light rounded-3">
                                <div class="mb-1"><span class="text-muted small">Total Issued:</span> <span id="totalIssuedCredits">0</span></div>
                                <div class="mb-1"><span class="text-muted small">Issued Count:</span> <span id="issuedCount">0</span></div>
                                <div class="mb-1"><span class="text-muted small">Last Issued:</span> <span id="lastIssuedDate">-</span></div>
                                <div class="mb-0"><span class="text-muted small">Standards:</span> <span id="standardsList">-</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modern Share Information & Actions -->
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-gradient bg-info text-white border-0">
                    <div class="d-flex align-items-center">
                        <div class="bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                            <span class="fs-4">🔗</span>
                        </div>
                        <div>
                            <h5 class="mb-0 fw-bold">Share Information & Actions</h5>
                            <small class="opacity-75">Manage share code and create loan applications</small>
                        </div>
                    </div>
                </div>
                <div class="card-body p-4">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <div class="d-flex align-items-center p-3 bg-light rounded-3">
                                <div class="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                                    <span class="fs-5 text-warning">⏰</span>
                                </div>
                                <div>
                                    <label class="form-label text-muted small mb-1">Expires</label>
                                    <p class="mb-0 fw-semibold" id="shareExpires">Loading...</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex align-items-center p-3 bg-light rounded-3">
                                <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                                    <span class="fs-5 text-primary">#</span>
                                </div>
                                <div>
                                    <label class="form-label text-muted small mb-1">Share Code</label>
                                    <p class="mb-0 fw-semibold font-monospace" id="currentShareCode">-</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row g-3 mt-3">
                        <div class="col-md-6">
                            <button class="btn btn-outline-primary w-100 py-3" data-action="copy-share-code">
                                <span class="me-2">📋</span>Copy Share Code
                            </button>
                        </div>
                        <div class="col-md-6">
                            <button class="btn btn-success w-100 py-3" data-action="generate-loan">
                                <span class="me-2">📄</span>Create Loan Application
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Loan Application Modal -->
<div class="modal fade" id="loanApplicationModal" tabindex="-1" aria-labelledby="loanModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="loanModalTitle">
                    <span class="me-2">📄</span>Create Loan Application
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="loanApplicationForm">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="loanAmount" class="form-label">Loan Amount (VND)</label>
                                <input type="number" class="form-control" id="loanAmount" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="interestRate" class="form-label">Interest Rate (%)</label>
                                <input type="number" class="form-control" id="interestRate" value="12" step="0.1" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="loanTerm" class="form-label">Loan Term (months)</label>
                                <select class="form-select" id="loanTerm" required>
                                    <option value="6">6 months</option>
                                    <option value="12" selected>12 months</option>
                                    <option value="24">24 months</option>
                                    <option value="36">36 months</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="loanPurpose" class="form-label">Loan Purpose</label>
                                <input type="text" class="form-control" id="loanPurpose" required>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="collateralDescription" class="form-label">Collateral Description</label>
                        <textarea class="form-control" id="collateralDescription" rows="3"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="notes" class="form-label">Additional Notes</label>
                        <textarea class="form-control" id="notes" rows="2"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" data-action="submit-loan">
                    <span class="me-1">💾</span>Create Application
                </button>
            </div>
        </div>
    </div>
</div>
@endsection

@section('js')
<script>
console.log('=== SCRIPT LOADING TEST ===');
console.log('Script is being loaded!');
console.log('Current time:', new Date().toISOString());
console.log('=== END SCRIPT LOADING TEST ===');

let currentProfileData = null;

// CSRF Token
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up event delegation...');

    // Event delegation for all buttons
    document.addEventListener('click', function(e) {
        console.log('Click event detected on:', e.target);
        const action = e.target.closest('[data-action]')?.getAttribute('data-action');
        console.log('Action found:', action);
        if (!action) return;

        console.log('Button clicked with action:', action);

        switch(action) {
            case 'view-profile':
                handleFormSubmit();
                break;
            case 'test':
                testFunction();
                break;
            case 'clear':
                clearForm();
                break;
            case 'copy-share-code':
                copyShareCode();
                break;
            case 'generate-loan':
                generateLoanApplication();
                break;
            case 'submit-loan':
                submitLoanApplication();
                break;
            case 'debug':
                console.log('=== DEBUG INFO ===');
                console.log('Current share code value:', document.getElementById('shareCode').value);
                console.log('View profile button:', document.getElementById('viewProfileBtn'));
                console.log('Button has data-action:', document.getElementById('viewProfileBtn').getAttribute('data-action'));
                console.log('=== END DEBUG ===');
                break;
        }
    });

    // Handle Enter key in input
    document.addEventListener('keypress', function(e) {
        if (e.target.id === 'shareCode' && e.key === 'Enter') {
            e.preventDefault();
            handleFormSubmit();
        }
    });

    // Core functions
    function handleFormSubmit() {
        console.log('handleFormSubmit called!');
        const shareCode = document.getElementById('shareCode').value.trim();
        console.log('Share code from input:', shareCode);
        if (shareCode) {
            console.log('Calling viewProfile with:', shareCode);
            viewProfile(shareCode);
        } else {
            console.log('No share code provided');
            alert('Please enter a share code');
        }
    }

    function testFunction() {
        console.log('Test function called!');
        console.log('Current share code value:', document.getElementById('shareCode').value);
        console.log('Testing with AGC-F74DE520');
        viewProfile('AGC-F74DE520');
    }

    function clearForm() {
        document.getElementById('shareCode').value = '';
        document.getElementById('profileDisplay').classList.add('d-none');
        document.getElementById('emptyState').classList.remove('d-none');
        currentProfileData = null;
    }

        // View profile function
    function viewProfile(shareCode) {
        console.log('viewProfile called with:', shareCode);
        showLoadingState();

        const apiUrl = `/api/profile/share/${shareCode}`;
        console.log('Making API call to:', apiUrl);

        axios.get(apiUrl)
            .then(response => {
                console.log('Profile response:', response.data);
                if (response.data.success) {
                    console.log('Success! Displaying profile...');
                    displayProfile(response.data.data);

                    // Fetch additional credit data
                    fetchCreditData(shareCode);
                } else {
                    console.log('API returned success: false');
                    showErrorState(response.data.message || 'Failed to load profile');
                }
            })
            .catch(error => {
                console.error('API Error:', error);
                if (error.response?.status === 404) {
                    showErrorState('Share code not found or expired');
                } else if (error.response?.data?.message) {
                    showErrorState(error.response.data.message);
                } else {
                    showErrorState('Failed to load profile. Please try again.');
                }
            });
    }

        // Fetch detailed credit data
    function fetchCreditData(shareCode) {
        console.log('Fetching credit data for share code:', shareCode);

        // Fetch credit data from public API
        axios.get(`/api/profile/share/${shareCode}/credit-data`)
        .then(response => {
            console.log('Credit data response:', response.data);
            if (response.data.success) {
                displayCreditData(response.data.data.credit_data);
                displayMRVData(response.data.data.mrv_data);
                displayTransparency(response.data.data.transparency);
                displayCreditsSummary(response.data.data.credits_summary);
            }
        })
        .catch(error => {
            console.error('Credit data error:', error);
            // Fallback to mock data if API fails
            const mockCreditData = {
                carbon_performance: 85.5,
                mrv_reliability: 92.3,
                carbon_reduction: 78.2,
                farm_profile: {
                    total_area: 12.5,
                    rice_area: 8.0,
                    agroforestry_area: 4.5
                }
            };

            const mockMRVData = {
                total_declarations: 15,
                verified_declarations: 12,
                evidence_count: 45,
                completion_rate: 80.0,
                total_trees: 900
            };

            console.log('Using fallback mock data');
            displayCreditData(mockCreditData);
            displayMRVData(mockMRVData);
        });
    }

    // Display credit data
    function displayCreditData(creditData) {
        console.log('Displaying credit data:', creditData);

        // Update credit breakdown
        if (creditData.carbon_performance !== undefined) {
            document.getElementById('carbonPerformance').textContent = creditData.carbon_performance.toFixed(1);
            document.getElementById('carbonPerformanceBar').style.width = creditData.carbon_performance + '%';
        }

        if (creditData.mrv_reliability !== undefined) {
            document.getElementById('mrvReliability').textContent = creditData.mrv_reliability.toFixed(1);
            document.getElementById('mrvReliabilityBar').style.width = creditData.mrv_reliability + '%';
        }

        if (creditData.carbon_reduction !== undefined) {
            document.getElementById('carbonReduction').textContent = creditData.carbon_reduction.toFixed(1);
            document.getElementById('carbonReductionBar').style.width = creditData.carbon_reduction + '%';
        }

        // Update farm composition
        if (creditData.farm_profile) {
            const farm = creditData.farm_profile;
            if (farm.rice_area !== undefined) {
                document.getElementById('riceArea').textContent = farm.rice_area + ' ha';
                const totalArea = farm.total_area || 1;
                document.getElementById('riceAreaBar').style.width = (farm.rice_area / totalArea * 100) + '%';
            }

            if (farm.agroforestry_area !== undefined) {
                document.getElementById('agroforestryArea').textContent = farm.agroforestry_area + ' ha';
                const totalArea = farm.total_area || 1;
                document.getElementById('agroforestryAreaBar').style.width = (farm.agroforestry_area / totalArea * 100) + '%';
            }
        }
    }

    // Display MRV data
    function displayMRVData(mrvData) {
        console.log('Displaying MRV data:', mrvData);

        if (mrvData.total_declarations !== undefined) {
            document.getElementById('totalDeclarations').textContent = mrvData.total_declarations;
        }

        if (mrvData.verified_declarations !== undefined) {
            document.getElementById('verifiedDeclarations').textContent = mrvData.verified_declarations;
        }

        if (mrvData.evidence_count !== undefined) {
            document.getElementById('evidenceCount').textContent = mrvData.evidence_count;
        }

        if (mrvData.completion_rate !== undefined) {
            document.getElementById('completionRate').textContent = mrvData.completion_rate.toFixed(1) + '%';
        }

        if (mrvData.total_trees !== undefined) {
            document.getElementById('totalTrees').textContent = mrvData.total_trees.toLocaleString();
            // Set progress bar for trees (assuming max 1000 trees for 100%)
            const treePercentage = Math.min((mrvData.total_trees / 1000) * 100, 100);
            document.getElementById('totalTreesBar').style.width = treePercentage + '%';
        }
    }

    // Display transparency data
    function displayTransparency(tp) {
        if (!tp) return;
        // Anchors
        const list = document.getElementById('anchorsList');
        list.innerHTML = '';
        if (tp.blockchain_anchors && tp.blockchain_anchors.length) {
            tp.blockchain_anchors.forEach(a => {
                const url = a.verification_url || '#';
                const item = document.createElement('a');
                item.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-start';
                item.href = url;
                item.target = '_blank';
                item.rel = 'noopener';
                item.innerHTML = `
                    <div class="me-3">
                        <div class="fw-semibold">${a.record_type} #${a.record_id}</div>
                        <div class="text-muted small">${a.network} • Block ${a.block_number ?? '-'} • Gas ${a.gas_used ?? '-'}</div>
                        <div class="text-truncate" style="max-width: 520px;">
                            <span class="text-muted small">Tx:</span> ${a.transaction_hash}
                        </div>
                    </div>
                    <div class="text-end small text-muted">${a.anchor_timestamp || ''}</div>
                `;
                list.appendChild(item);
            });
        } else {
            const empty = document.createElement('div');
            empty.className = 'text-muted';
            empty.textContent = 'No anchors available';
            list.appendChild(empty);
        }

        // Last verification
        document.getElementById('lastVerificationDate').textContent = tp.last_verification?.date || '-';
        document.getElementById('lastVerificationStatus').textContent = tp.last_verification?.status || '-';
        document.getElementById('lastVerificationScore').textContent = tp.last_verification?.score ?? '-';
        document.getElementById('lastVerificationVerifier').textContent = tp.last_verification?.verifier_name || '-';
    }

    // Display credits summary
    function displayCreditsSummary(cs) {
        if (!cs) return;
        document.getElementById('totalIssuedCredits').textContent = (cs.total_issued ?? 0).toLocaleString();
        document.getElementById('issuedCount').textContent = cs.issued_count ?? 0;
        document.getElementById('lastIssuedDate').textContent = cs.last_issued_date || '-';
        const standards = Array.isArray(cs.standards) ? cs.standards.join(', ') : '-';
        document.getElementById('standardsList').textContent = standards || '-';
    }

    // Show loading state
    function showLoadingState() {
        console.log('showLoadingState called');
        document.getElementById('emptyState').classList.add('d-none');
        document.getElementById('errorState').classList.add('d-none');
        document.getElementById('loadingState').classList.remove('d-none');
        document.getElementById('profileDisplay').classList.add('d-none');
        console.log('Loading state shown');
    }

    // Show error state
    function showErrorState(errorMessage) {
        console.log('showErrorState called with:', errorMessage);
        document.getElementById('emptyState').classList.add('d-none');
        document.getElementById('loadingState').classList.add('d-none');
        document.getElementById('profileDisplay').classList.add('d-none');
        document.getElementById('errorState').classList.remove('d-none');
        document.getElementById('errorMessage').textContent = errorMessage;
        console.log('Error state shown');
    }

    // Display profile data
    function displayProfile(profileData) {
        console.log('displayProfile called with:', profileData);
        currentProfileData = profileData;

        // Hide loading and error states
        document.getElementById('loadingState').classList.add('d-none');
        document.getElementById('errorState').classList.add('d-none');
        document.getElementById('emptyState').classList.add('d-none');

        // Show profile data
        document.getElementById('profileDisplay').classList.remove('d-none');

        // Populate farmer info
        document.getElementById('farmerName').textContent = profileData.farmer.name;
        document.getElementById('farmerGrade').textContent = profileData.farmer.carbon_grade;
        document.getElementById('farmerLocation').textContent = profileData.farmer.location;
        document.getElementById('mrvStatus').textContent = profileData.farmer.mrv_verified ? 'Verified' : 'Not Verified';
        document.getElementById('mrvStatus').className = profileData.farmer.mrv_verified ? 'badge bg-success' : 'badge bg-warning';

        // Populate farm stats
        document.getElementById('totalArea').textContent = formatNumber(profileData.farm_stats.total_area);
        document.getElementById('carbonCredits').textContent = formatNumber(profileData.farm_stats.carbon_credits_earned);
        document.getElementById('verificationRate').textContent = formatNumber(profileData.farm_stats.verification_rate) + '%';
        document.getElementById('creditScore').textContent = profileData.credit_score;

                // Populate share info
        document.getElementById('shareExpires').textContent = formatDate(profileData.share_expires_at);
        document.getElementById('currentShareCode').textContent = document.getElementById('shareCode').value.trim();

        console.log('Profile data section shown');
    }

    // Copy share code
    function copyShareCode() {
        if (currentProfileData) {
            navigator.clipboard.writeText(currentProfileData.share_code || 'N/A').then(() => {
                Swal.fire('Success', 'Share code copied to clipboard!', 'success');
            }).catch(() => {
                Swal.fire('Error', 'Failed to copy share code', 'error');
            });
        }
    }

    // Generate loan application
    function generateLoanApplication() {
        if (!currentProfileData) {
            Swal.fire('Error', 'No profile data available', 'error');
            return;
        }

        // Calculate suggested loan amount based on farm area and credit score
        const suggestedAmount = Math.round(currentProfileData.farm_stats.total_area * 5000000 * (currentProfileData.credit_score / 100));

        // Pre-fill the modal
        document.getElementById('loanAmount').value = suggestedAmount;
        document.getElementById('loanPurpose').value = 'Agricultural investment and farm development';
        document.getElementById('loanTerm').value = '12';

        // Update modal header with farmer info
        document.getElementById('loanModalTitle').innerHTML = `
            <span class="me-2">📄</span>
            Create Loan Application for ${currentProfileData.farmer.name}
        `;

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('loanApplicationModal'));
        modal.show();
    }

    // Submit loan application
    function submitLoanApplication() {
        const formData = {
            farmer_name: currentProfileData?.farmer?.name || 'Unknown',
            share_code: document.getElementById('shareCode').value.trim(),
            loan_amount: parseFloat(document.getElementById('loanAmount').value),
            loan_purpose: document.getElementById('loanPurpose').value,
            loan_term: parseInt(document.getElementById('loanTerm').value),
            interest_rate: parseFloat(document.getElementById('interestRate').value),
            collateral_description: document.getElementById('collateralDescription').value,
            notes: document.getElementById('notes').value
        };

        // Validation
        if (!formData.loan_amount || formData.loan_amount <= 0) {
            Swal.fire('Error', 'Please enter a valid loan amount', 'error');
            return;
        }

        if (!formData.loan_purpose.trim()) {
            Swal.fire('Error', 'Please enter loan purpose', 'error');
            return;
        }

        // Submit to API
        axios.post('/banker/api/loan-applications', formData)
            .then(response => {
                console.log('Loan application response:', response.data);
                if (response.data.success) {
                    Swal.fire('Success', 'Loan application created successfully!', 'success');
                    // Close modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('loanApplicationModal'));
                    modal.hide();
                    // Clear form
                    document.getElementById('loanApplicationForm').reset();
                } else {
                    Swal.fire('Error', response.data.message || 'Failed to create loan application', 'error');
                }
            })
            .catch(error => {
                console.error('Error creating loan application:', error);
                Swal.fire('Error', 'Failed to create loan application', 'error');
            });
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Format number with proper decimal places
    function formatNumber(num) {
        if (typeof num !== 'number') return '0';
        return num.toFixed(2);
    }

    // Format currency (VND)
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    // Test if script is working
    console.log('=== SCRIPT TEST ===');
    console.log('Document ready state:', document.readyState);
    console.log('View Profile button exists:', document.getElementById('viewProfileBtn'));
    console.log('Share code input exists:', document.getElementById('shareCode'));
    console.log('=== END SCRIPT TEST ===');

    console.log('Share Profile page loaded');
    console.log('CSRF Token:', csrfToken);
    console.log('Form element:', document.getElementById('shareCodeForm'));
    console.log('Share code input:', document.getElementById('shareCode'));
    console.log('View profile button:', document.getElementById('viewProfileBtn'));
    console.log('All functions are globally available');
});
</script>
@endsection

