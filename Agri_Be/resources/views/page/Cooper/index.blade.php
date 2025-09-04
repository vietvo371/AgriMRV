@extends('master')

@section('title')
    <div>
        <h1 class="mb-1">Cooperative Dashboard</h1>
        <p class="text-muted">Tổng quan hợp tác xã và danh sách xã viên</p>
    </div>
@endsection

@section('content')
    <div id="app">
        <div class="row g-3 mb-3">
            <div class="col-md-4">
                <div class="stat-card">
                    <div class="stat-card-header">
                        <span>Members</span>
                        <div class="stat-card-icon primary"><i class="fa fa-users"></i></div>
                    </div>
                    <div class="stat-value">@{{ stats.summary.members }}</div>
                    <div class="stat-label">Tổng thành viên</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card">
                    <div class="stat-card-header">
                        <span>Total Area (ha)</span>
                        <div class="stat-card-icon success"><i class="fa fa-seedling"></i></div>
                    </div>
                    <div class="stat-value">@{{ stats.summary.total_area }}</div>
                    <div class="stat-label">Diện tích canh tác</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card">
                    <div class="stat-card-header">
                        <span>Verified / Submitted</span>
                        <div class="stat-card-icon info"><i class="fa fa-certificate"></i></div>
                    </div>
                    <div class="stat-value">@{{ stats.summary.verified_declarations }} / @{{ stats.summary.submitted_declarations }}</div>
                    <div class="stat-label">MRV declarations</div>
                </div>
            </div>
        </div>

        <div class="table-card">
            <div class="table-card-header d-flex justify-content-between align-items-center">
                <h5>Danh sách xã viên</h5>
                <div class="input-group" style="width: 280px;">
                    <span class="input-group-text"><i class="fa fa-search"></i></span>
                    <input v-model="q" type="text" class="form-control" placeholder="Tìm theo tên, SĐT">
                </div>
            </div>
            <div class="table-responsive">
                <table class="table mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên</th>
                            <th>SĐT</th>
                            <th>Diện tích (ha)</th>
                            <th>Verified MRV</th>
                            <th>Tham gia</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(m, idx) in filteredMembers" :key="m.member_id">
                            <td>@{{ idx + 1 }}</td>
                            <td>@{{ m.name }}</td>
                            <td>@{{ m.phone }}</td>
                            <td>@{{ m.total_area }}</td>
                            <td><span class="status-badge status-active">@{{ m.verified_declarations }}</span></td>
                            <td>@{{ m.joined_at }}</td>
                        </tr>
                        <tr v-if="filteredMembers.length === 0">
                            <td colspan="6" class="text-center text-muted">Không có dữ liệu</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
@endsection

@section('js')
<script>
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }

    new Vue({
        el: '#app',
        data: {
            stats: { summary: { members: 0, total_area: 0, verified_declarations: 0, submitted_declarations: 0 } },
            members: [],
            q: ''
        },
        computed: {
            filteredMembers() {
                const q = this.q.toLowerCase().trim();
                if (!q) return this.members;
                return this.members.filter(m => (m.name || '').toLowerCase().includes(q) || (m.phone || '').toLowerCase().includes(q));
            }
        },
        mounted() {
            axios.get('/api/cooperative/stats').then(r => { this.stats = r.data.data; }).catch(() => {});
            axios.get('/api/cooperative/members').then(r => { this.members = r.data.data.members; }).catch(() => {});
        }
    });
</script>
@endsection



