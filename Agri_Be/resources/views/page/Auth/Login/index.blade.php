<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>AgriMRV - Carbon MRV Platform</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        :root {
            --dark-blue: #0B1120;
            --light-blue: #26D0CE;
            --accent-blue: #1D3F72;
            --text-primary: #ffffff;
            --text-secondary: rgba(255, 255, 255, 0.7);
            --card-bg: rgba(255, 255, 255, 0.1);
            --border: rgba(255, 255, 255, 0.2);
            --shadow: rgba(38, 208, 206, 0.2);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: linear-gradient(135deg, var(--dark-blue) 0%, var(--accent-blue) 100%);
            font-family: 'Space Grotesk', sans-serif;
            color: var(--text-primary);
            line-height: 1.6;
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
        }

        /* Background Effects */
        body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image:
                radial-gradient(circle at 20% 50%, rgba(38, 208, 206, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(29, 63, 114, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(38, 208, 206, 0.08) 0%, transparent 50%);
            pointer-events: none;
        }

        .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            position: relative;
            z-index: 1;
        }

        .login-card {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 50px 40px;
            width: 100%;
            max-width: 450px;
            border: 1px solid var(--border);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            position: relative;
        }

        .login-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 24px;
            background: linear-gradient(135deg,
                rgba(38, 208, 206, 0.1) 0%,
                rgba(29, 63, 114, 0.1) 100%);
            z-index: -1;
        }

        /* Header Section */
        .login-header {
            text-align: center;
            margin-bottom: 40px;
        }

        .brand-logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background: linear-gradient(135deg, var(--light-blue), var(--accent-blue));
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 30px var(--shadow);
            animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        .brand-logo i {
            font-size: 2.5rem;
            color: white;
        }

        .brand-title {
            font-size: 2.5rem;
            font-weight: 700;
            background: linear-gradient(to right, var(--light-blue), #fff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }

        .brand-subtitle {
            color: var(--text-secondary);
            font-size: 1rem;
            font-weight: 500;
            margin-bottom: 10px;
        }

        .platform-description {
            color: var(--text-secondary);
            font-size: 0.9rem;
            opacity: 0.8;
        }

        /* Form Styles */
        .form-group {
            margin-bottom: 24px;
            position: relative;
        }

        .form-input {
            width: 100%;
            padding: 18px 20px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid var(--border);
            border-radius: 12px;
            color: var(--text-primary);
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.3s ease;
            outline: none;
        }

        .form-input::placeholder {
            color: var(--text-secondary);
            font-weight: 400;
        }

        .form-input:focus {
            border-color: var(--light-blue);
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 0 4px rgba(38, 208, 206, 0.1);
            transform: translateY(-2px);
        }

        .login-btn {
            width: 100%;
            padding: 18px;
            background: linear-gradient(135deg, var(--light-blue), var(--accent-blue));
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
        }

        .login-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent);
            transition: left 0.5s;
        }

        .login-btn:hover::before {
            left: 100%;
        }

        .login-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px var(--shadow);
        }

        .login-btn:active {
            transform: translateY(-1px);
        }

        .login-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }

        /* Alert Styles */
        .alert {
            border-radius: 12px;
            border: none;
            margin-bottom: 24px;
            padding: 16px 20px;
            font-size: 0.95rem;
            font-weight: 500;
            backdrop-filter: blur(10px);
        }

        .alert-danger {
            background: rgba(220, 53, 69, 0.15);
            color: #ff6b6b;
            border: 1px solid rgba(220, 53, 69, 0.3);
        }

        /* Demo Section */
        .demo-section {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            padding: 24px;
            border: 1px solid var(--border);
            backdrop-filter: blur(10px);
        }

        .demo-title {
            color: var(--light-blue);
            font-weight: 600;
            font-size: 1.1rem;
            margin-bottom: 20px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .demo-accounts {
            display: grid;
            gap: 12px;
        }

        .demo-account {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }

        .demo-account:hover {
            background: rgba(38, 208, 206, 0.1);
            border-color: var(--light-blue);
        }

        .demo-label {
            color: var(--text-secondary);
            font-weight: 500;
            font-size: 0.9rem;
        }

        .demo-value {
            color: var(--text-primary);
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.85rem;
            background: rgba(38, 208, 206, 0.1);
            padding: 4px 8px;
            border-radius: 6px;
        }

        .demo-password {
            text-align: center;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid var(--border);
            color: var(--text-secondary);
            font-size: 0.9rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .demo-password i {
            color: var(--light-blue);
        }

        /* Loading Animation */
        .spinner-border {
            width: 20px;
            height: 20px;
            border-width: 2px;
            border-color: currentColor;
            border-right-color: transparent;
        }

        /* Back to Home Link */
        .back-home {
            position: absolute;
            top: 30px;
            left: 30px;
            color: var(--text-secondary);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
            transition: all 0.3s ease;
            z-index: 10;
        }

        .back-home:hover {
            color: var(--light-blue);
            transform: translateX(-5px);
        }

        /* Responsive Design */
        @media (max-width: 576px) {
            .login-card {
                margin: 15px;
                padding: 40px 30px;
                border-radius: 20px;
            }

            .brand-title {
                font-size: 2rem;
            }

            .brand-logo {
                width: 70px;
                height: 70px;
            }

            .brand-logo i {
                font-size: 2rem;
            }

            .back-home {
                top: 20px;
                left: 20px;
            }

            .demo-account {
                flex-direction: column;
                gap: 8px;
                text-align: center;
            }
        }

        @media (max-width: 480px) {
            .login-container {
                padding: 15px;
            }

            .login-card {
                padding: 35px 25px;
            }

            .form-input {
                padding: 16px 18px;
            }

            .login-btn {
                padding: 16px;
            }
        }

        /* Subtle animations */
        .login-card {
            animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body>
    <a href="/" class="back-home">
        <i class="bi bi-arrow-left"></i>
        <span>Back to Home</span>
    </a>

    <div class="login-container">
        <div class="login-card">
            <!-- Header -->
            <div class="login-header">
                <div class="brand-logo">
                    <i class="fas fa-seedling"></i>
                </div>
                <h1 class="brand-title">AgriMRV</h1>
                <p class="brand-subtitle">Carbon MRV & Credits Platform</p>
                <p class="platform-description">Measure • Report • Verify</p>
            </div>

            <!-- Error Alerts -->
            <div id="errorAlert" class="alert alert-danger d-none" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <span id="errorMessage"></span>
            </div>

            @if(session('error'))
            <div class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ session('error') }}
            </div>
            @endif

            <!-- Login Form -->
            <form id="loginForm" action="{{ route('login.post') }}" method="POST">
                @csrf
                <div class="form-group">
                    <input type="email" class="form-input" id="email" name="email"
                           placeholder="Enter your email address" required autocomplete="email">
                </div>

                <div class="form-group">
                    <input type="password" class="form-input" id="password" name="password"
                           placeholder="Enter your password" required autocomplete="current-password">
                </div>

                <button type="submit" class="login-btn" id="loginBtn">
                    <span id="btnText">Sign In to Platform</span>
                </button>
            </form>

            {{-- <!-- Demo Info -->
            <div class="demo-section">
                <div class="demo-title">
                    <i class="bi bi-info-circle"></i>
                    Demo Accounts
                </div>
                <div class="demo-accounts">
                    <div class="demo-account">
                        <span class="demo-label">Verifier Account:</span>
                        <span class="demo-value">verifier1@example.com</span>
                    </div>
                    <div class="demo-account">
                        <span class="demo-label">Bank Account:</span>
                        <span class="demo-value">bank@example.com</span>
                    </div>
                </div>
                <div class="demo-password">
                    <i class="bi bi-key"></i>
                    <span>Default Password: 12345678</span>
                </div>
            </div> --}}
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
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
                btnText.innerHTML = '<i class="bi bi-arrow-clockwise spin me-2"></i>Signing In...';
            } else {
                loginBtn.disabled = false;
                btnText.innerHTML = 'Sign In to Platform';
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

        // Add interaction effects to inputs
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
            });

            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        });

        // Add click effect to demo accounts
        const demoAccounts = document.querySelectorAll('.demo-account');
        demoAccounts.forEach(account => {
            account.addEventListener('click', function() {
                const email = this.querySelector('.demo-value').textContent;
                document.getElementById('email').value = email;
                document.getElementById('password').value = '12345678';

                // Add visual feedback
                this.style.background = 'rgba(38, 208, 206, 0.2)';
                setTimeout(() => {
                    this.style.background = 'rgba(255, 255, 255, 0.05)';
                }, 200);
            });
        });
    });

    // Add CSS for spin animation
    const style = document.createElement('style');
    style.textContent = `
        .spin {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    </script>
</body>
</html>
