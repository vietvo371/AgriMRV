<div class="user-info" onclick="toggleUserMenu()">
    <div class="user-avatar">
        {{ substr(auth()->user()->full_name ?? 'B', 0, 1) }}
    </div>
    <div class="user-details">
        <div class="user-name">{{ auth()->user()->full_name ?? 'Banker' }}</div>
        <div class="user-role">Banker</div>
    </div>
    <i class="fas fa-chevron-down" style="font-size: 12px; color: #6c757d;"></i>
</div>

<!-- User Dropdown Menu -->
<div class="dropdown-menu" id="userDropdown" style="display: none; position: absolute; top: 100%; right: 0; background: white; border: 1px solid #e9ecef; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); min-width: 200px; z-index: 1000;">
    <div class="dropdown-header" style="padding: 0.75rem 1rem; border-bottom: 1px solid #e9ecef; background: #f8f9fa;">
        <div style="font-weight: 600; color: #2c3e50;">{{ auth()->user()->full_name ?? 'Banker' }}</div>
        <div style="font-size: 12px; color: #6c757d;">{{ auth()->user()->email ?? 'banker@agrimrv.com' }}</div>
    </div>

    <a href="{{ route('banker.profile') }}" class="dropdown-item" style="display: block; padding: 0.75rem 1rem; color: #495057; text-decoration: none; transition: background 0.3s ease;">
        <i class="fas fa-user" style="margin-right: 0.5rem; width: 16px;"></i>
        Profile
    </a>

    <a href="{{ route('banker.settings') }}" class="dropdown-item" style="display: block; padding: 0.75rem 1rem; color: #495057; text-decoration: none; transition: background 0.3s ease;">
        <i class="fas fa-cog" style="margin-right: 0.5rem; width: 16px;"></i>
        Settings
    </a>

    <div style="border-top: 1px solid #e9ecef;"></div>

    <a href="{{ route('logout') }}" class="dropdown-item" style="display: block; padding: 0.75rem 1rem; color: #dc3545; text-decoration: none; transition: background 0.3s ease;" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
        <i class="fas fa-sign-out-alt" style="margin-right: 0.5rem; width: 16px;"></i>
        Logout
    </a>
</div>

<script>
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const userInfo = document.querySelector('.user-info');
    const dropdown = document.getElementById('userDropdown');

    if (!userInfo.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

// Add hover effects
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#f8f9fa';
    });

    item.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'transparent';
    });
});
</script>
