@extends('share.Verifier.master')

@section('title')
    <div>
        <h1 class="mb-1">Verification Requests</h1>
        <p class="text-muted">List of verification requests</p>
    </div>
@endsection

@section('content')
<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Requests</h5>
        <input id="search" class="form-control" placeholder="Search by farmer/location" style="max-width: 280px;">
    </div>
    <div class="table-responsive">
        <table class="table mb-0">
            <thead>
                <tr>
                    <th>Farmer</th>
                    <th>Request ID</th>
                    <th>Status</th>
                    <th>Carbon Claims</th>
                    <th>Evidence</th>
                    <th>Submitted</th>
                    <th></th>
                </tr>
            </thead>
            <tbody id="tbody">
                @forelse($requests as $req)
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="user-avatar me-2" style="width: 35px; height: 35px; font-size: 12px;">
                                {{ Str::of($req->farmProfile->user->full_name ?? 'U')->explode(' ')->map(fn($n)=>Str::substr($n,0,1))->implode('') }}
                            </div>
                            <div>
                                <div class="fw-bold">{{ $req->farmProfile->user->full_name ?? 'Unknown' }}</div>
                                <small class="text-muted">{{ $req->farmProfile->user->address ?? 'N/A' }}</small>
                            </div>
                        </div>
                    </td>
                    <td><span class="badge bg-secondary">VR{{ str_pad($req->id, 3, '0', STR_PAD_LEFT) }}</span></td>
                    <td>
                        <span class="badge {{ $req->status === 'submitted' ? 'bg-warning' : 'bg-secondary' }}">{{ ucfirst($req->status) }}</span>
                    </td>
                    <td>{{ number_format((float)($req->estimated_carbon_credits ?? 0), 1) }} tCO₂e</td>
                    <td>{{ $req->evidence_files_count ?? 0 }}</td>
                    <td>{{ optional($req->created_at)->format('Y-m-d') }}</td>
                    <td>
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('verifier.request.show', ['id' => $req->id]) }}">
                            <i class="fa fa-eye"></i> Review
                        </a>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="7" class="text-center text-muted">No requests</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection

@section('js')
<script>
document.getElementById('search').addEventListener('input', function() {
    const q = this.value.toLowerCase();
    Array.from(document.querySelectorAll('#tbody tr')).forEach(tr => {
        const text = tr.textContent.toLowerCase();
        tr.style.display = text.includes(q) ? '' : 'none';
    });
});
</script>
@endsection


