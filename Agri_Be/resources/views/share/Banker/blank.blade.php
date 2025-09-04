<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>AgriMRV - Banker</title>
    <link rel="icon" type="image/png" href="{{ asset('image/logo.png') }}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <style>
        :root {
            /* Banking theme - professional blue */
            --bs-primary: #1976d2;
            --bs-primary-rgb: 25, 118, 210;
            --primary-color: #1976d2;      /* Blue 700 */
            --secondary-color: #0d47a1;    /* Blue 900 */
            --accent-color: #64b5f6;       /* Light blue */
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: #f8f9fa;
            font-size: 14px;
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

        .text-primary {
            color: var(--primary-color) !important;
        }

        .bg-primary {
            background-color: var(--primary-color) !important;
        }

        /* Cards */
        .card {
            border: none;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            margin-bottom: 1.5rem;
        }

        .card-header {
            background: white;
            border-bottom: 1px solid #e9ecef;
            border-radius: 12px 12px 0 0 !important;
            padding: 1.25rem 1.5rem;
        }

        .card-body {
            padding: 1.5rem;
        }

        /* Stat Cards */
        .stat-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            border-left: 4px solid var(--primary-color);
        }

        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .stat-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .stat-card-header span {
            font-weight: 600;
            color: #6c757d;
            font-size: 14px;
        }

        .stat-card-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
        }

        .stat-card-icon.primary {
            background: var(--primary-color);
        }

        .stat-card-icon.success {
            background: #28a745;
        }

        .stat-card-icon.warning {
            background: #ffc107;
        }

        .stat-card-icon.info {
            background: #17a2b8;
        }

        .stat-card-icon.danger {
            background: #dc3545;
        }

        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #2c3e50;
            line-height: 1.2;
        }

        .stat-label {
            color: #6c757d;
            font-size: 13px;
            margin-top: 0.25rem;
        }

        /* Tables */
        .table-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .table-card-header {
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid #e9ecef;
            background: #f8f9fa;
        }

        .table-card-header h5 {
            margin: 0;
            color: #2c3e50;
            font-weight: 600;
        }

        .table {
            margin: 0;
        }

        .table th {
            border-top: none;
            border-bottom: 2px solid #e9ecef;
            font-weight: 600;
            color: #495057;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 1rem 0.75rem;
        }

        .table td {
            border-top: 1px solid #e9ecef;
            padding: 1rem 0.75rem;
            vertical-align: middle;
        }

        .table tbody tr:hover {
            background: #f8f9fa;
        }

        /* Buttons */
        .btn {
            border-radius: 8px;
            font-weight: 500;
            padding: 0.5rem 1rem;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .btn-sm {
            padding: 0.375rem 0.75rem;
            font-size: 12px;
        }

        .btn-group-sm > .btn {
            padding: 0.25rem 0.5rem;
            font-size: 12px;
        }

        /* Badges */
        .badge {
            font-size: 11px;
            font-weight: 500;
            padding: 0.375rem 0.75rem;
            border-radius: 6px;
        }

        /* Forms */
        .form-control, .form-select {
            border-radius: 8px;
            border: 1px solid #ced4da;
            padding: 0.5rem 0.75rem;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .form-control:focus, .form-select:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(25, 118, 210, 0.25);
        }

        .input-group-text {
            border-radius: 8px 0 0 8px;
            border: 1px solid #ced4da;
            background: #f8f9fa;
        }
    </style>
</head>
<body>
    <div class="container-fluid">
        @yield('content')
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

    @yield('js')
</body>
</html>
