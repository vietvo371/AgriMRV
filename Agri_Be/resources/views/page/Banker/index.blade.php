@extends('master')

@section('title')
    <div>
        <h1 class="mb-1">Banker Portal</h1>
        <p class="text-muted">Manage loan applications</p>
    </div>
@endsection

@section('content')
    <div id="bankApp">
        <div class="table-card">
            <div class="table-card-header d-flex justify-content-between align-items-center">
                <h5>Loan Applications</h5>
                <button @click="load" class="btn btn-sm btn-outline-primary"><i class="fa fa-rotate"></i> Refresh</button>
            </div>
            <div class="table-responsive">
                <table class="table mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Farmer</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(r, idx) in rows" :key="r.id">
                            <td>@{{ idx + 1 }}</td>
                            <td>#@{{ r.user_id }}</td>
                            <td>$ @{{ r.amount }}</td>
                            <td><span :class="['status-badge', r.status==='approved'?'status-active':(r.status==='pending'?'status-pending':'status-inactive')]">@{{ r.status }}</span></td>
                            <td>@{{ r.transaction_date }}</td>
                            <td>
                                <div class="btn-group btn-group-sm">
                                    <button class="btn btn-success" @click="approve(r)"><i class="fa fa-check"></i></button>
                                    <button class="btn btn-danger" @click="reject(r)"><i class="fa fa-times"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="rows.length === 0">
                            <td colspan="6" class="text-center text-muted">No applications</td>
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
    if (token) axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

    new Vue({
        el: '#bankApp',
        data: { rows: [] },
        methods: {
            load() { axios.get('/api/bank/loan-applications').then(r => this.rows = r.data.data.applications).catch(() => {}); },
            approve(r) { axios.post(`/api/bank/loans/${r.id}/approve`, { status: 'approved' }).then(() => { this.load(); Swal.fire('OK', 'Approved', 'success'); }); },
            reject(r) { axios.post(`/api/bank/loans/${r.id}/approve`, { status: 'rejected' }).then(() => { this.load(); Swal.fire('OK', 'Rejected', 'info'); }); }
        },
        mounted() { this.load(); }
    });
</script>
@endsection



