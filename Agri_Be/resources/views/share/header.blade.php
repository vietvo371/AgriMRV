<header class="admin-header">
    <div class="header-left">
        <button class="sidebar-toggle" id="sidebarToggle">
            <i class="fas fa-bars"></i>
        </button>
    </div>
    <div class="header-right">
        <button class="notification-btn">
            <i class="fas fa-bell"></i>
            <span class="notification-badge">3</span>
        </button>

        <!-- User Profile Dropdown -->
        <div class="dropdown" id="userProfileDropdown">
            <div class="user-profile" data-bs-toggle="dropdown">
                <div class="user-avatar" id="userAvatar">U</div>
                <div class="d-none d-md-block">
                    <div style="font-weight: 500; font-size: 0.9rem;" id="userName">User</div>
                    <div style="font-size: 0.8rem; color: #6c757d;" id="userEmail">user@example.com</div>
                </div>
                <i class="fas fa-chevron-down ms-2"></i>
            </div>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#" onclick="showProfile()"><i class="fas fa-user me-2"></i>Profile</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" onclick="logout()"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
            </ul>
        </div>
    </div>
</header>

<script>
// Load user info from localStorage
function loadUserInfo() {
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            document.getElementById('userName').textContent = userData.full_name || 'User';
            document.getElementById('userEmail').textContent = userData.email || 'user@example.com';
            document.getElementById('userAvatar').textContent = (userData.full_name || 'U').charAt(0).toUpperCase();
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
}

// Logout function
function logout() {
    Swal.fire({
        title: 'Đăng xuất?',
        text: 'Bạn có chắc muốn đăng xuất?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Đăng xuất',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    });
}

// Show profile function
function showProfile() {
    Swal.fire({
        title: 'Thông tin cá nhân',
        text: 'Tính năng đang phát triển',
        icon: 'info'
    });
}

// Load user info when page loads
document.addEventListener('DOMContentLoaded', loadUserInfo);
</script>
