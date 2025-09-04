<ul class="nav flex-column">
    <li class="nav-item">
        <a href="{{ route('banker.dashboard') }}" class="nav-link {{ request()->routeIs('banker.dashboard') ? 'active' : '' }}">
            <i class="fas fa-tachometer-alt nav-icon"></i>
            Dashboard
        </a>
    </li>

    <li class="nav-item">
        <a href="{{ route('banker.loan-applications') }}" class="nav-link {{ request()->routeIs('banker.loan-applications*') ? 'active' : '' }}">
            <i class="fas fa-file-invoice-dollar nav-icon"></i>
            Loan Applications
        </a>
    </li>

    <li class="nav-item">
        <a href="{{ route('banker.portfolio') }}" class="nav-link {{ request()->routeIs('banker.portfolio*') ? 'active' : '' }}">
            <i class="fas fa-briefcase nav-icon"></i>
            Portfolio
        </a>
    </li>

    <li class="nav-item">
        <a href="{{ route('banker.risk-assessment') }}" class="nav-link {{ request()->routeIs('banker.risk-assessment*') ? 'active' : '' }}">
            <i class="fas fa-shield-alt nav-icon"></i>
            Risk Assessment
        </a>
    </li>

    <li class="nav-item">
        <a href="{{ route('banker.reports') }}" class="nav-link {{ request()->routeIs('banker.reports*') ? 'active' : '' }}">
            <i class="fas fa-chart-bar nav-icon"></i>
            Reports
        </a>
    </li>

    <li class="nav-item">
        <a href="{{ route('banker.analytics') }}" class="nav-link {{ request()->routeIs('banker.analytics*') ? 'active' : '' }}">
            <i class="fas fa-chart-line nav-icon"></i>
            Analytics
        </a>
    </li>

    <li class="nav-item">
        <a href="{{ route('banker.share-profile') }}" class="nav-link {{ request()->routeIs('banker.share-profile*') ? 'active' : '' }}">
            <i class="fas fa-qrcode nav-icon"></i>
            Share Profile
        </a>
    </li>

    <li class="nav-item">
        <a href="{{ route('banker.settings') }}" class="nav-link {{ request()->routeIs('banker.settings*') ? 'active' : '' }}">
            <i class="fas fa-cog nav-icon"></i>
            Settings
        </a>
    </li>

    <li class="nav-item mt-3">
        <hr style="border-color: rgba(255, 255, 255, 0.2); margin: 0.5rem 0;">
    </li>

    <li class="nav-item">
        <a href="{{ route('logout') }}" class="nav-link" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
            <i class="fas fa-sign-out-alt nav-icon"></i>
            Logout
        </a>
        <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
            @csrf
        </form>
    </li>
</ul>
