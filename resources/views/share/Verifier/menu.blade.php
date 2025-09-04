<aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
        <img src="{{ asset('image/logo.png') }}" alt="AgriMRV">
        <h4>AgriMRV</h4>
    </div>
    <div class="sidebar-menu">
        <ul class="menu">
            <li class="sidebar-item">
                <a href="/verifier" class="sidebar-link" {{ request()->routeIs('verifier.dashboard') ? 'active' : '' }}>
                    <i class="fa fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                </a>
            </li>

            <li class="sidebar-item">
                <a href="/verifier/schedule" class="sidebar-link" {{ request()->routeIs('verifier.schedule') ? 'active' : '' }}>
                    <i class="fa fa-calendar"></i>
                    <span>Schedule</span>
                </a>
            </li>

            <li class="sidebar-item">
                <a href="/verifier/request" class="sidebar-link" {{ request()->routeIs('verifier.request') ? 'active' : '' }}>
                    <i class="fa fa-clipboard-check"></i>
                    <span>Request</span>
                </a>
            </li>

            <li class="sidebar-item">
                <a href="/verifier/reports" class="sidebar-link" {{ request()->routeIs('verifier.reports') ? 'active' : '' }}>
                    <i class="fa fa-chart-bar"></i>
                    <span>Reports</span>
                </a>
            </li>

            <li class="sidebar-item">
                <a href="/verifier/analytics" class="sidebar-link" {{ request()->routeIs('verifier.analytics') ? 'active' : '' }}>
                    <i class="fa fa-chart-line"></i>
                    <span>Analytics</span>
                </a>
            </li>

            <li class="sidebar-title">Tools</li>

            <li class="sidebar-item">
                <a href="/verifier/queue" class="sidebar-link" {{ request()->routeIs('verifier.queue') ? 'active' : '' }}>
                    <i class="fa fa-list"></i>
                    <span>Verification Queue</span>
                </a>
            </li>

            <li class="sidebar-item">
                <a href="/verifier/history" class="sidebar-link" {{ request()->routeIs('verifier.history') ? 'active' : '' }}>
                    <i class="fa fa-history"></i>
                    <span>Verification History</span>
                </a>
            </li>

            <li class="sidebar-item">
                <a href="/verifier/settings" class="sidebar-link" {{ request()->routeIs('verifier.settings') ? 'active' : '' }}>
                    <i class="fa fa-cog"></i>
                    <span>Settings</span>
                </a>
            </li>
        </ul>
    </div>
</aside>
