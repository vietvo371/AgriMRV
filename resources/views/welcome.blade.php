<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AgriMRV - Carbon MRV Platform</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
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
      background-color: var(--dark-blue);
      font-family: 'Space Grotesk', sans-serif;
      color: var(--text-primary);
      line-height: 1.6;
    }

    .navbar {
      padding: 0;
      height: 70px;
      position: fixed;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 1000;
      background: rgba(11, 17, 32, 0.9);
      backdrop-filter: blur(10px);
      transition: all 0.3s;
    }

    .navbar.scrolled {
      background: rgba(11, 17, 32, 1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .nav-container {
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-logo {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 10px 0;
    }

    .nav-logo a {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(to right, var(--light-blue), #fff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-decoration: none;
      letter-spacing: 1px;
      position: relative;
    }

    .nav-logo a:after {
      content: 'Carbon MRV & Credits Platform';
      position: absolute;
      bottom: -15px;
      left: 0;
      font-size: 12px;
      font-weight: 400;
      color: var(--text-secondary);
      letter-spacing: 0;
      white-space: nowrap;
    }

    .nav-menu {
      display: flex;
      gap: 40px;
      align-items: center;
    }

    .nav-link {
      color: var(--text-primary);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
      position: relative;
      padding: 5px 0;
    }

    .nav-link:after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: 0;
      left: 0;
      background: var(--light-blue);
      transition: width 0.3s;
    }

    .nav-link:hover {
      color: var(--light-blue);
    }

    .nav-link:hover:after {
      width: 100%;
    }

    .nav-buttons {
      display: flex;
      gap: 15px;
      align-items: center;
    }

    .dropdown {
      position: relative;
    }

    .dropdown-toggle {
      background: var(--light-blue);
      color: var(--dark-blue);
      padding: 12px 24px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      border: none;
      transition: all 0.3s;
    }

    .dropdown-toggle:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px var(--shadow);
    }

    .dropdown-toggle i {
      font-size: 1.2rem;
      transition: transform 0.3s;
    }

    .dropdown-toggle.active i {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      background: var(--dark-blue);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 8px;
      min-width: 220px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: all 0.3s;
    }

    .dropdown-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      color: var(--text-primary);
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.3s;
    }

    .dropdown-item i {
      font-size: 1.2rem;
      color: var(--light-blue);
    }

    .dropdown-item:hover {
      background: rgba(38, 208, 206, 0.1);
    }

    .mobile-menu-toggle {
      display: none;
      background: none;
      border: none;
      color: var(--text-primary);
      font-size: 1.5rem;
      cursor: pointer;
    }

    @media (max-width: 992px) {
      .nav-menu {
        position: fixed;
        top: 80px;
        left: 0;
        width: 100%;
        background: var(--dark-blue);
        padding: 20px;
        flex-direction: column;
        gap: 20px;
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s;
      }

      .nav-menu.show {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }

      .mobile-menu-toggle {
        display: block;
      }
    }

    .main-content {
      padding-top: 120px;
      min-height: 100vh;
    }

    .section-title {
      text-align: center;
      color: var(--light-blue);
      font-size: 2rem;
      margin: 50px 0;
    }

    .actors-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
      margin-bottom: 50px;
    }

    .actor-card {
      background: var(--card-bg);
      border-radius: 20px;
      padding: 20px;
      border: 1px solid var(--border);
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }

    .actor-card:hover {
      transform: translateY(-10px);
      border-color: var(--light-blue);
      box-shadow: 0 0 30px rgba(38, 208, 206, 0.4);
    }

    .actor-icon {
      width: 60px;
      height: 60px;
      background: var(--light-blue);
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .actor-icon i {
      font-size: 30px;
      color: var(--dark-blue);
    }

    .actor-title {
      font-size: 1.5rem;
      margin-bottom: 20px;
      color: var(--light-blue);
      text-align: center;
    }

    .actor-list {
      list-style: none;
      text-align: left;
    }

    .actor-list li {
      color: var(--text-secondary);
      margin-bottom: 12px;
      padding-left: 24px;
      position: relative;
    }

    .actor-list li::before {
      content: '→';
      position: absolute;
      left: 0;
      color: var(--light-blue);
    }

    .cta-section {
      text-align: center;
      margin-top: 80px;
    }

    .cta-title {
      color: var(--light-blue);
      font-size: 1.8rem;
      margin-bottom: 40px;
    }

    .cta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
      max-width: 800px;
      margin: 0 auto;
    }

    .cta-card {
      background: var(--card-bg);
      border-radius: 20px;
      padding: 30px;
      border: 1px solid var(--border);
      text-align: center;
      transition: transform 0.3s;
    }

    .cta-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px var(--shadow);
    }

    .cta-card h3 {
      color: var(--light-blue);
      margin-bottom: 15px;
    }

    .cta-card p {
      color: var(--text-secondary);
      margin-bottom: 20px;
    }

    .cta-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
    }

    .cta-button {
      color: var(--text-primary);
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 8px;
      transition: all 0.3s;
      border: 1px solid var(--border);
    }

    .cta-button:hover {
      border-color: var(--light-blue);
      color: var(--light-blue);
    }

    .footer {
      margin-top: 100px;
      padding: 60px 0 30px;
      border-top: 1px solid var(--border);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 40px;
    }

    .footer-brand img {
      height: 100px;
      margin-bottom: 20px;
    }

    .footer-brand p {
      color: var(--text-secondary);
      margin-bottom: 20px;
    }

    .footer-title {
      color: var(--light-blue);
      margin-bottom: 20px;
      font-size: 1.2rem;
    }

    .footer-links {
      list-style: none;
    }

    .footer-link {
      margin-bottom: 12px;
    }

    .footer-link a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.3s;
    }

    .footer-link a:hover {
      color: var(--light-blue);
    }

    .social-links {
      display: flex;
      gap: 15px;
    }

    .social-link {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--card-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-primary);
      text-decoration: none;
      transition: all 0.3s;
      border: 1px solid var(--border);
    }

    .social-link:hover {
      background: var(--light-blue);
      color: var(--dark-blue);
    }

    @media (max-width: 768px) {
      .actors-grid {
        grid-template-columns: 1fr;
      }

      .cta-grid {
        grid-template-columns: 1fr;
      }

      .footer-grid {
        grid-template-columns: 1fr;
      }

      .nav-menu {
        display: none;
      }
    }

    .hero-section {
      position: relative;
      min-height: 100vh;
      padding: 120px 0 80px;
      background: linear-gradient(45deg, var(--dark-blue) 0%, var(--accent-blue) 100%);
      overflow: hidden;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 60px;
      align-items: center;
    }

    .hero-content h1 {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 24px;
      line-height: 1.2;
      background: linear-gradient(to right, #fff, var(--light-blue));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-content p {
      font-size: 1.2rem;
      color: var(--text-secondary);
      margin-bottom: 40px;
      max-width: 600px;
    }

    .hero-buttons {
      display: flex;
      gap: 20px;
    }

    .hero-button {
      padding: 15px 30px;
      border-radius: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s;
    }

    .hero-button.primary {
      background: var(--light-blue);
      color: var(--dark-blue);
    }

    .hero-button.secondary {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-primary);
    }

    .hero-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px var(--shadow);
    }

    .hero-image {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    .hero-image img {
      width: 100%;
      max-width: 400px;
      height: auto;
      object-fit: contain;
    }

    .features-section {
      padding: 100px 0;
      background: rgba(29, 63, 114, 0.1);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
      margin-top: 50px;
    }

    .feature-card {
      background: var(--card-bg);
      border-radius: 20px;
      padding: 30px;
      border: 1px solid var(--border);
      transition: all 0.3s;
      text-align: center;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px var(--shadow);
    }

    .feature-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: linear-gradient(45deg, var(--light-blue), var(--accent-blue));
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: var(--text-primary);
    }

    .feature-title {
      font-size: 1.5rem;
      color: var(--light-blue);
      margin-bottom: 15px;
    }

    .feature-description {
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .stats-section {
      padding: 80px 0;
      text-align: center;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 30px;
      margin-top: 50px;
    }

    .stat-card {
      padding: 30px;
      background: var(--card-bg);
      border-radius: 20px;
      border: 1px solid var(--border);
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--light-blue);
      margin-bottom: 10px;
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }

    @media (max-width: 992px) {
      .hero-grid {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .hero-content p {
        margin: 0 auto 40px;
      }

      .hero-buttons {
        justify-content: center;
      }

      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2.5rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <nav class="navbar">
    <div class="container nav-container">
      <div class="nav-logo">
        <a href="/" class="nav-logo">
          AgriMRV
        </a>
      </div>
      <button class="mobile-menu-toggle">
        <i class="bi bi-list"></i>
      </button>
      <div class="nav-menu">
        <a href="#features" class="nav-link">Features</a>
        <a href="#workflow" class="nav-link">MRV Workflow</a>
        <a href="#stakeholders" class="nav-link">Stakeholders</a>
        <a href="#get-started" class="nav-link">Get Started</a>
      </div>
      <div class="nav-buttons">
        <div class="dropdown">
          <button class="dropdown-toggle" onclick="toggleDropdown()">
            <span>Sign in</span>
            <i class="bi bi-chevron-down"></i>
          </button>
          <div class="dropdown-menu" id="loginDropdown">
            <a href="/login" class="dropdown-item">
              <i class="bi bi-person"></i>
              <span>Farmer</span>
            </a>
            <a href="/login" class="dropdown-item">
              <i class="bi bi-shield-check"></i>
              <span>Verifier</span>
            </a>
            <a href="/login" class="dropdown-item">
              <i class="bi bi-bank"></i>
              <span>Bank / Buyer</span>
            </a>
            <a href="/login" class="dropdown-item">
              <i class="bi bi-building"></i>
              <span>Government</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <section id="introduction" class="hero-section">
    <div class="container">
      <div class="hero-grid">
        <div class="hero-content">
          <h1>Carbon MRV & Credits Management Platform</h1>
          <p>Measure-Report-Verify carbon performance for farms, anchor evidence, run AI analysis, and issue carbon credits with transparent lifecycle and pricing.</p>
          <div class="hero-buttons">
            <a href="#features" class="hero-button primary">Learn More</a>
            <a href="#get-started" class="hero-button secondary">Get Started</a>
          </div>
        </div>
        <div class="hero-image">
          <img src="{{ asset('image/logo.png') }}" alt="AgriMR">
        </div>
      </div>
    </div>
  </section>

  <section id="features" class="features-section">
    <div class="container">
      <h2 class="section-title">Key Features</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <i class="bi bi-clipboard-data"></i>
          </div>
          <h3 class="feature-title">MRV Declarations</h3>
          <p class="feature-description">Submit seasonal MRV data (AWD cycles, straw management, tree density) and compute Carbon Performance.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="bi bi-robot"></i>
          </div>
          <h3 class="feature-title">AI Evidence Analysis</h3>
          <p class="feature-description">Run AI on satellite, drone, and field photos to estimate reliability and detect anomalies.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="bi bi-currency-exchange"></i>
          </div>
          <h3 class="feature-title">Credits & Marketplace</h3>
          <p class="feature-description">Issue, price, and transact carbon credits once declarations are verified by verifiers.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="workflow" class="stats-section">
    <div class="container">
      <h2 class="section-title">MRV Workflow</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">1</div>
          <div class="stat-label">Declare & Upload Evidence</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">2</div>
          <div class="stat-label">AI Analysis</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">3</div>
          <div class="stat-label">Verify & Approve</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">4</div>
          <div class="stat-label">Issue Credits</div>
        </div>
      </div>
    </div>
  </section>

  <section id="statistics" class="stats-section">
    <div class="container">
      <h2 class="section-title">Impressive Statistics</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">50+</div>
          <div class="stat-label">Universities</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">100K+</div>
          <div class="stat-label">Students</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">5K+</div>
          <div class="stat-label">Lecturers</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">1M+</div>
          <div class="stat-label">NFT Certificates</div>
        </div>
      </div>
    </div>
  </section>

  <section id="stakeholders" class="main-content">
    <div class="container">
      <h2 class="section-title">Stakeholders</h2>

      <div class="actors-grid">
        <div class="actor-card">
          <div class="actor-icon">
            <i class="bi bi-people"></i>
          </div>
          <h3 class="actor-title">Farmers</h3>
          <ul class="actor-list">
            <li>Submit MRV declarations with evidence</li>
            <li>Track carbon performance and estimated credits</li>
            <li>Receive verification outcomes</li>
            <li>Benefit from credit sales</li>
          </ul>
        </div>

        <div class="actor-card">
          <div class="actor-icon">
            <i class="bi bi-shield-check"></i>
          </div>
          <h3 class="actor-title">Verifiers</h3>
          <ul class="actor-list">
            <li>Schedule field visits and review evidence</li>
            <li>Run approval/revision/rejection workflows</li>
            <li>Anchor verification records</li>
          </ul>
        </div>

        <div class="actor-card">
          <div class="actor-icon">
            <i class="bi bi-bank"></i>
          </div>
          <h3 class="actor-title">Banks & Buyers</h3>
          <ul class="actor-list">
            <li>View verified credits and pricing</li>
            <li>Finance and purchase carbon credits</li>
            <li>Track portfolio impact</li>
          </ul>
        </div>
      </div>

      <div class="actor-card" style="max-width: 400px; margin: 0 auto;">
        <div class="actor-icon">
          <i class="bi bi-building"></i>
        </div>
        <h3 class="actor-title">Government & Cooperatives</h3>
        <ul class="actor-list">
          <li>Monitor program performance and compliance</li>
          <li>Support training and cooperative memberships</li>
          <li>Enable policy incentives</li>
        </ul>
      </div>

      <section id="get-started" class="cta-section">
        <h2 class="cta-title">Get Started with AgriMRV</h2>
        <div class="cta-grid">
          <div class="cta-card">
            <h3>For Farmers & Verifiers</h3>
            <p>Access MRV declarations and verification tools</p>
            <div class="cta-buttons">
              <a href="/login" class="cta-button">Farmer</a>
              <a href="#" class="cta-button">Verifier</a>
            </div>
          </div>
          <div class="cta-card">
            <h3>For Institutions</h3>
            <p>Manage financing, credits, and oversight</p>
            <div class="cta-buttons">
              <a href="/login" class="cta-button">Bank/Buyer</a>
              <a href="/login" class="cta-button">Government</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>

  <footer id="footer" class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="{{ asset('image/logo.png') }}" alt="AgriMR">
          <p>A carbon MRV and credits platform for agriculture, ensuring transparency, reliability, and real-world impact.</p>
        </div>
        <div class="footer-menu">
          <h4 class="footer-title">Products</h4>
          <ul class="footer-links">
            <li class="footer-link"><a href="/login">MRV Declarations</a></li>
            <li class="footer-link"><a href="/login">AI Analysis</a></li>
            <li class="footer-link"><a href="/login">Verification Suite</a></li>
            <li class="footer-link"><a href="/login">Credits & Market</a></li>
          </ul>
        </div>
        <div class="footer-menu">
          <h4 class="footer-title">Support</h4>
          <ul class="footer-links">
            <li class="footer-link"><a href="#">User Guide</a></li>
            <li class="footer-link"><a href="#">FAQ</a></li>
            <li class="footer-link"><a href="#">Support Contact</a></li>
            <li class="footer-link"><a href="#">Terms of Service</a></li>
          </ul>
        </div>
        <div class="footer-menu">
          <h4 class="footer-title">Resources</h4>
          <ul class="footer-links">
            <li class="footer-link"><a href="#">Blog</a></li>
            <li class="footer-link"><a href="#">Whitepaper</a></li>
            <li class="footer-link"><a href="#">Documentation</a></li>
            <li class="footer-link"><a href="#">API Reference</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>

  <script>
    // Dropdown toggle
    function toggleDropdown() {
      const dropdownToggle = document.querySelector('.dropdown-toggle');
      const dropdownMenu = document.getElementById('loginDropdown');
      dropdownToggle.classList.toggle('active');
      dropdownMenu.classList.toggle('show');
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const dropdown = document.querySelector('.dropdown');
      const dropdownMenu = document.getElementById('loginDropdown');
      const dropdownToggle = document.querySelector('.dropdown-toggle');

      if (!dropdown.contains(e.target)) {
        dropdownMenu.classList.remove('show');
        dropdownToggle.classList.remove('active');
      }
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('show');
      });
    });
  </script>
</body>
</html>
