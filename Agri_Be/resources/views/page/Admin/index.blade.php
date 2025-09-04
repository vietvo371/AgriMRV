@extends('master')

@section('title')
    <div>
        <h1 class="mb-1">Government Registry</h1>
        <p class="text-muted">Tổng hợp MRV, Verification và Carbon Credit</p>
    </div>
@endsection

@section('content')
    <div id="govApp">
        <div class="row g-3 mb-3">
            <div class="col-md-4">
                <div class="stat-card">
                    <div class="stat-card-header">
                        <span>MRV Declarations</span>
                        <div class="stat-card-icon primary"><i class="fa fa-list"></i></div>
                    </div>
                    <div class="stat-value">@{{ counts.declarations }}</div>
                    <div class="stat-label">Bản ghi</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card">
                    <div class="stat-card-header">
                        <span>Verifications</span>
                        <div class="stat-card-icon info"><i class="fa fa-shield"></i></div>
                    </div>
                    <div class="stat-value">@{{ counts.verifications }}</div>
                    <div class="stat-label">Bản ghi</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card">
                    <div class="stat-card-header">
                        <span>Carbon Credits</span>
                        <div class="stat-card-icon success"><i class="fa fa-certificate"></i></div>
                    </div>
                    <div class="stat-value">@{{ counts.credits }}</div>
                    <div class="stat-label">Bản ghi</div>
                </div>
            </div>
        </div>

        <div class="table-card mb-3">
            <div class="table-card-header"><h5>Anchors</h5></div>
            <div class="table-responsive">
                <table class="table mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Type</th>
                            <th>Record</th>
                            <th>Tx Hash</th>
                            <th>Block</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(a, idx) in anchors" :key="a.id">
                            <td>@{{ idx + 1 }}</td>
                            <td>@{{ a.record_type }}</td>
                            <td>#@{{ a.record_id }}</td>
                            <td><code>@{{ a.transaction_hash }}</code></td>
                            <td>@{{ a.block_number }}</td>
                            <td>@{{ a.anchor_timestamp }}</td>
                        </tr>
                        <tr v-if="anchors.length === 0">
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
    if (token) axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

    new Vue({
        el: '#govApp',
        data: { counts: { declarations: 0, verifications: 0, credits: 0 }, anchors: [] },
        mounted() {
            axios.get('/api/government/registry').then(r => {
                const d = r.data.data;
                this.counts.declarations = d.mrv_declarations.length;
                this.counts.verifications = d.verification_records.length;
                this.counts.credits = d.carbon_credits.length;
            }).catch(() => {});
            axios.get('/api/government/anchors').then(r => this.anchors = r.data.data.anchors).catch(() => {});
        }
    });
</script>
@endsection



