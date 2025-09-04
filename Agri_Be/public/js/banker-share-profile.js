// Banker Share Profile Script
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
            <i class="fas fa-file-alt me-2"></i>
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
