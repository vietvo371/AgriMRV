<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>AgriMRV - Verifier</title>
    <link rel="icon" type="image/png" href="{{ asset('image/logo.png') }}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <style>
        :root {
            /* Agriculture theme - fresh green */
            --bs-primary: #2e7d32;
            --bs-primary-rgb: 46, 125, 50;
            --primary-color: #2e7d32;      /* Green 700 */
            --secondary-color: #1b5e20;    /* Green 900 */
            --accent-color: #81c784;       /* Light green */
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
            background: rgba(46, 125, 50, 0.08);
            color: var(--primary-color);
        }

        .sidebar-menu a.active {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: #fff;
            border-radius: 10px;
            margin: 0 12px;
            box-shadow: 0 6px 16px rgba(27, 94, 32, 0.25);
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
    <div class="admin-wrapper">
        <!-- Sidebar -->
        @include('share.Verifier.menu')
        <!-- Main Content -->
        <main class="main-content" id="mainContent">
            <!-- Header -->
            @include('share.Verifier.header')
            <div class="content-area">
                <div class="page-title">
                     @yield('title')
                </div>

                @yield('content')
            </div>

            <!-- Footer -->
            <footer class="admin-footer">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        © 2025 DZ DTU. All rights reserved.
                    </div>
                    <div>
                        <a href="#" style="color: var(--primary-color); text-decoration: none; margin-right: 20px;">Privacy Policy</a>
                        <a href="#" style="color: var(--primary-color); text-decoration: none;">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
        // Sidebar Toggle
        document.getElementById('sidebarToggle').addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');

            if (window.innerWidth > 768) {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('expanded');
            } else {
                sidebar.classList.toggle('show');
            }
        });

        document.addEventListener('click', function(e) {
            const sidebar = document.getElementById('sidebar');
            const sidebarToggle = document.getElementById('sidebarToggle');

            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('show');
                }
            }
        });

        document.querySelectorAll('.sidebar-menu a').forEach(link => {
            link.addEventListener('click', function(e) {
                document.querySelectorAll('.sidebar-menu a').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });
    </script>

    @yield('js')
</body>
</html>
