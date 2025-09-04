@extends('master')

@section('title')
    <div>
        <h1 class="mb-1">Carbon Marketplace</h1>
        <p class="text-muted">Mua tín chỉ carbon đã phát hành</p>
    </div>
@endsection

@section('content')
    <div id="buyerApp">
        <div class="table-card">
            <div class="table-card-header d-flex justify-content-between align-items-center">
                <h5>Credits đang phát hành</h5>
                <button @click="load" class="btn btn-sm btn-outline-primary"><i class="fa fa-rotate"></i> Refresh</button>
            </div>
            <div class="table-responsive">
                <table class="table mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Serial</th>
                            <th>Amount</th>
                            <th>Price</th>
                            <th>Issued</th>
                            <th>Buy</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(c, idx) in credits" :key="c.id">
                            <td>@{{ idx + 1 }}</td>
                            <td>@{{ c.serial_number }}</td>
                            <td>@{{ c.credit_amount }}</td>
                            <td>$ @{{ c.price_per_credit || 0 }}</td>
                            <td>@{{ c.issued_date }}</td>
                            <td>
                                <div class="input-group input-group-sm" style="width: 160px;">
                                    <input type="number" v-model.number="c.buyQty" class="form-control" min="1" :max="c.credit_amount" placeholder="Qty">
                                    <button class="btn btn-primary" @click="buy(c)"><i class="fa fa-shopping-cart"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="credits.length === 0">
                            <td colspan="6" class="text-center text-muted">Không có tín chỉ</td>
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
        el: '#buyerApp',
        data: { credits: [] },
        methods: {
            load() { axios.get('/api/buyer/marketplace').then(r => { this.credits = (r.data.data.credits||[]).map(x => ({...x, buyQty: 1})); }).catch(() => {}); },
            buy(c) {
                const qty = c.buyQty || 1;
                axios.post(`/api/buyer/purchase/${c.id}`, { quantity: qty }).then(() => {
                    Swal.fire('Success', 'Đã mua tín chỉ', 'success');
                    this.load();
                }).catch(() => Swal.fire('Error', 'Không thể mua', 'error'));
            }
        },
        mounted() { this.load(); }
    });

</script>
@endsection



