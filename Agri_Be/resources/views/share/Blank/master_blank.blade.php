<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>AgriMRV</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    @yield('css')
    <style>
        :root {
            --bs-primary: #f16226;
            --bs-primary-rgb: 241, 98, 38;
            --primary-color: #f16226;
            --secondary-color: #ee3127;
            --accent-color: #f59321;
            --sidebar-width: 260px;
            --header-height: 70px;
            --dark-bg: #1a1d29;
            --sidebar-bg: #252837;
            --content-bg: #f8f9fa;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html, body {
            height: 100%;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--content-bg);
            font-size: 14px;
            min-height: 100vh;
        }

        /* Override Bootstrap Primary */
        .btn-primary {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
        }

        .btn-primary:hover {
            background-color: var(--secondary-color);
            border-color: var(--secondary-color);
        }

        .btn-primary:focus {
            box-shadow: 0 0 0 0.2rem rgba(241, 98, 38, 0.25);
        }

        .text-primary {
            color: var(--primary-color) !important;
        }

        .bg-primary {
            background-color: var(--primary-color) !important;
        }

        .border-primary {
            border-color: var(--primary-color) !important;
        }

        /* Layout */
        .admin-wrapper {
            display: flex;
            min-height: 100vh;
            flex: 1; /* Thêm dòng này */
        }

        /* Sidebar */
        .sidebar {
            width: var(--sidebar-width);
            background: var(--sidebar-bg);
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 1000;
            transition: all 0.3s ease;
            overflow-y: auto;
        }

        .sidebar.collapsed {
            width: 80px;
        }

        .sidebar-header {
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .sidebar-header img {
            width: 35px;
            height: 35px;
            border-radius: 8px;
        }

        .sidebar-header h4 {
            color: var(--primary-color);
            font-weight: 700;
            font-size: 1.2rem;
            margin: 0;
            white-space: nowrap;
        }

        .sidebar-menu {
            padding: 0;
            list-style: none;
            margin-top: 20px;
        }

        .sidebar-menu li {
            margin-bottom: 5px;
        }

        .sidebar-menu a {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            color: #b8bcc8;
            text-decoration: none;
            transition: all 0.3s ease;
            position: relative;
        }

        .sidebar-menu a:hover {
            background: rgba(241, 98, 38, 0.1);
            color: var(--primary-color);
        }

        .sidebar-menu a.active {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            border-radius: 0 25px 25px 0;
            margin-right: 20px;
        }

        .sidebar-menu a i {
            width: 20px;
            margin-right: 12px;
            font-size: 16px;
        }

        .sidebar-menu a span {
            white-space: nowrap;
        }

        /* Main Content */
        .main-content {
            flex: 1;
            margin-left: var(--sidebar-width);
            transition: all 0.3s ease;
            min-height: calc(100vh - 0px); /* Thêm dòng này */
            display: flex;
            flex-direction: column;
        }

        .main-content.expanded {
            margin-left: 80px;
        }

        /* Header */
        .admin-header {
            background: white;
            height: var(--header-height);
            padding: 0 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #e9ecef;
            position: sticky;
            top: 0;
            z-index: 999;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .sidebar-toggle {
            background: none;
            border: none;
            font-size: 18px;
            color: #6c757d;
            cursor: pointer;
        }

        .breadcrumb {
            background: none;
            padding: 0;
            margin: 0;
        }

        .breadcrumb-item a {
            color: var(--primary-color);
            text-decoration: none;
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .notification-btn {
            position: relative;
            background: none;
            border: none;
            font-size: 18px;
            color: #6c757d;
            cursor: pointer;
        }

        .notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 18px;
            height: 18px;
            background: var(--secondary-color);
            color: white;
            border-radius: 50%;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .user-profile {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .user-profile:hover {
            background: #f8f9fa;
        }

        .user-avatar {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
        }

        /* Content Area */
        .content-area {
            padding: 30px;
            flex: 1;
            min-height: calc(100vh - var(--header-height) - 61px); /* 61px là chiều cao footer */
        }

        .page-title {
            margin-bottom: 30px;
        }

        .page-title h1 {
            font-size: 1.8rem;
            font-weight: 600;
            color: #2c3e50;
            margin: 0;
        }

        .page-title p {
            color: #6c757d;
            margin: 5px 0 0 0;
        }

        /* Dashboard Cards */
        .stat-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            border: 1px solid #e9ecef;
            transition: all 0.3s ease;
            height: 100%;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .stat-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .stat-card-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: white;
        }

        .stat-card-icon.primary {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        }

        .stat-card-icon.success {
            background: linear-gradient(135deg, #28a745, #20c997);
        }

        .stat-card-icon.warning {
            background: linear-gradient(135deg, #ffc107, var(--accent-color));
        }

        .stat-card-icon.info {
            background: linear-gradient(135deg, #17a2b8, #007bff);
        }

        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 5px;
        }

        .stat-label {
            color: #6c757d;
            font-size: 0.9rem;
            margin-bottom: 10px;
        }

        .stat-change {
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .stat-change.positive {
            color: #28a745;
        }

        .stat-change.negative {
            color: #dc3545;
        }

        /* Chart Cards */
        .chart-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            border: 1px solid #e9ecef;
            margin-bottom: 30px;
        }

        .chart-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 20px;
        }

        .chart-header h5 {
            font-weight: 600;
            color: #2c3e50;
            margin: 0;
        }

        /* Table */
        .table-card {
            background: white;
            border-radius: 12px;
            border: 1px solid #e9ecef;
            overflow: hidden;
        }

        .table-card-header {
            padding: 20px 25px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }

        .table-card-header h5 {
            font-weight: 600;
            color: #2c3e50;
            margin: 0;
        }

        .table-responsive {
            border-radius: 0;
        }

        .table th {
            background: #f8f9fa;
            font-weight: 600;
            color: #495057;
            border-top: none;
            padding: 15px;
        }

        .table td {
            padding: 15px;
            vertical-align: middle;
        }

        .status-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
        }

        .status-active {
            background: rgba(40, 167, 69, 0.1);
            color: #28a745;
        }

        .status-inactive {
            background: rgba(220, 53, 69, 0.1);
            color: #dc3545;
        }

        .status-pending {
            background: rgba(255, 193, 7, 0.1);
            color: #ffc107;
        }

        /* Footer */
        .admin-footer {
            background: white;
            padding: 20px 30px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 0.9rem;
            margin-top: auto;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
            }

            .sidebar.show {
                transform: translateX(0);
            }

            .main-content {
                margin-left: 0;
            }

            .admin-header {
                padding: 0 15px;
            }

            .content-area {
                padding: 20px 15px;
            }

            .header-right .d-none {
                display: none !important;
            }
        }

        @media (max-width: 576px) {
            .stat-card {
                padding: 20px;
                margin-bottom: 20px;
            }

            .stat-value {
                font-size: 1.5rem;
            }

            .chart-card {
                padding: 20px;
            }
        }

        /* Sidebar Collapsed State */
        .sidebar.collapsed .sidebar-header h4,
        .sidebar.collapsed .sidebar-menu a span {
            display: none;
        }

        .sidebar.collapsed .sidebar-header {
            justify-content: center;
        }

        .sidebar.collapsed .sidebar-menu a {
            justify-content: center;
            padding: 12px;
        }

        .sidebar.collapsed .sidebar-menu a i {
            margin-right: 0;
        }

        /* Custom Scrollbar */
        .sidebar::-webkit-scrollbar {
            width: 6px;
        }

        .sidebar::-webkit-scrollbar-track {
            background: transparent;
        }

        .sidebar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body>
    <div class="container mt-4">
        <div class="eco-background">
            <div class="container d-flex justify-content-center align-items-center" style="min-height: 100vh;">
                <div class="login-card">
                    <!-- Header -->
                    <div class="text-center mb-4">
                        <div class="eco-icon mb-3">
                            <i class="fas fa-seedling"></i>
                        </div>
                        <h2 class="eco-title">AgriMRV</h2>
                        <p class="eco-subtitle">Carbon Farming Management</p>
                    </div>

                    <!-- Error Alerts -->
                    <div id="errorAlert" class="alert alert-danger d-none" role="alert">
                        <span id="errorMessage"></span>
                    </div>

                    @if(session('error'))
                    <div class="alert alert-danger" role="alert">
                        {{ session('error') }}
                    </div>
                    @endif

                    <!-- Login Form -->
                    <form id="loginForm" action="{{ route('login.post') }}" method="POST">
                        @csrf
                        <div class="form-group">
                            <input type="email" class="eco-input" id="email" name="email"
                                   placeholder="Email Address" required autocomplete="email">
                        </div>

                        <div class="form-group">
                            <input type="password" class="eco-input" id="password" name="password"
                                   placeholder="Password" required autocomplete="current-password">
                        </div>

                        <button type="submit" class="eco-btn" id="loginBtn">
                            <span id="btnText">Sign In</span>
                        </button>
                    </form>

                    <!-- Demo Info -->
                    <div class="demo-section">
                        <div class="demo-title">Demo Accounts</div>
                        <div class="demo-account">
                            <span class="demo-label">Verifier:</span>
                            <span class="demo-value">verifier1@example.com</span>
                        </div>
                        <div class="demo-account">
                            <span class="demo-label">Bank:</span>
                            <span class="demo-value">bank@example.com</span>
                        </div>
                        <div class="demo-password">
                            <i class="fas fa-key"></i> Password: 12345678
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <style>
        /* Green Environmental Theme */
        :root {
            --eco-primary: #2d5016;
            --eco-secondary: #4a7c59;
            --eco-accent: #7cb342;
            --eco-light: #a5d6a7;
            --eco-bg: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
            --eco-shadow: rgba(45, 80, 22, 0.15);
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* .eco-background {
            background: var(--eco-bg);
            min-height: 100vh;
            position: relative;
        } */

        .eco-background::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image:
                radial-gradient(circle at 20% 50%, rgba(139, 195, 74, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(104, 159, 56, 0.1) 0%, transparent 50%);
            pointer-events: none;
        }

        .login-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 20px 40px var(--eco-shadow);
            border: 1px solid rgba(139, 195, 74, 0.2);
        }

        .eco-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, var(--eco-accent), var(--eco-secondary));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            box-shadow: 0 8px 25px rgba(139, 195, 74, 0.3);
        }

        .eco-icon i {
            font-size: 2rem;
            color: white;
        }

        .eco-title {
            color: var(--eco-primary);
            font-weight: 700;
            font-size: 2rem;
            margin: 0;
            letter-spacing: -0.5px;
        }

        .eco-subtitle {
            color: var(--eco-secondary);
            font-size: 0.95rem;
            margin: 8px 0 0 0;
            font-weight: 500;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .eco-input {
            width: 100%;
            padding: 16px 20px;
            border: 2px solid #e8f5e8;
            border-radius: 12px;
            font-size: 1rem;
            background: rgba(255, 255, 255, 0.8);
            transition: all 0.3s ease;
            outline: none;
        }

        .eco-input:focus {
            border-color: var(--eco-accent);
            background: white;
            box-shadow: 0 0 0 4px rgba(139, 195, 74, 0.1);
        }

        .eco-input::placeholder {
            color: #81c784;
            font-weight: 500;
        }

        .eco-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, var(--eco-accent), var(--eco-secondary));
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 30px;
        }

        .eco-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(139, 195, 74, 0.4);
        }

        .eco-btn:active {
            transform: translateY(0);
        }

        .eco-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }

        .demo-section {
            background: rgba(232, 245, 232, 0.6);
            border-radius: 12px;
            padding: 20px;
            border: 1px solid rgba(139, 195, 74, 0.2);
        }

        .demo-title {
            color: var(--eco-primary);
            font-weight: 600;
            font-size: 0.95rem;
            margin-bottom: 15px;
            text-align: center;
        }

        .demo-account {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 0.85rem;
        }

        .demo-label {
            color: var(--eco-secondary);
            font-weight: 600;
        }

        .demo-value {
            color: var(--eco-primary);
            font-family: 'Monaco', 'Menlo', monospace;
        }

        .demo-password {
            text-align: center;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(139, 195, 74, 0.3);
            color: var(--eco-secondary);
            font-size: 0.85rem;
            font-weight: 600;
        }

        .demo-password i {
            color: var(--eco-accent);
            margin-right: 5px;
        }

        .alert {
            border-radius: 12px;
            border: none;
            margin-bottom: 20px;
            padding: 12px 16px;
            font-size: 0.9rem;
        }

        .alert-danger {
            background: rgba(244, 67, 54, 0.1);
            color: #c62828;
            border-left: 4px solid #f44336;
        }

        /* Loading Animation */
        .spinner-border {
            width: 20px;
            height: 20px;
            border-width: 2px;
        }

        /* Responsive */
        @media (max-width: 480px) {
            .login-card {
                margin: 20px;
                padding: 30px 25px;
            }

            .eco-title {
                font-size: 1.75rem;
            }

            .eco-icon {
                width: 70px;
                height: 70px;
            }

            .eco-icon i {
                font-size: 1.75rem;
            }
        }
    </style>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('loginForm');
        const errorAlert = document.getElementById('errorAlert');
        const errorMessage = document.getElementById('errorMessage');
        const loginBtn = document.getElementById('loginBtn');
        const btnText = document.getElementById('btnText');

        loginForm.addEventListener('submit', function(e) {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                e.preventDefault();
                showError('Please enter both email and password');
                return;
            }

            setLoading(true);
            hideError();
        });

        function setLoading(loading) {
            if (loading) {
                loginBtn.disabled = true;
                btnText.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Signing In...';
            } else {
                loginBtn.disabled = false;
                btnText.innerHTML = 'Sign In';
            }
        }

        function showError(message) {
            errorMessage.textContent = message;
            errorAlert.classList.remove('d-none');
            setTimeout(() => hideError(), 5000);
        }

        function hideError() {
            errorAlert.classList.add('d-none');
        }

        // Add subtle animations to inputs
        const inputs = document.querySelectorAll('.eco-input');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.transform = 'scale(1.02)';
            });

            input.addEventListener('blur', function() {
                this.style.transform = 'scale(1)';
            });
        });
    });
    </script>
</body>
</html>
