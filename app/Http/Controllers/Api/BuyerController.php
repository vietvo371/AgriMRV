<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CarbonCredit;
use App\Models\CarbonTransaction;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class BuyerController extends Controller
{
    use ApiResponseTrait;

    public function marketplace(Request $request)
    {
        // Danh sách credit đang ở trạng thái issued (sẵn sàng bán)
        $credits = CarbonCredit::where('status', 'issued')
            ->orderBy('issued_date', 'desc')
            ->take(100)
            ->get();

        return $this->success(['credits' => $credits]);
    }

    public function purchase(Request $request, CarbonCredit $credit)
    {
        $validated = $request->validate([
            'quantity' => ['required', 'numeric', 'min:1']
        ]);

        $buyer = $request->user();

        $quantity = min($validated['quantity'], $credit->credit_amount);
        $totalAmount = round($quantity * ($credit->price_per_credit ?? 0), 2);

        $tx = CarbonTransaction::create([
            'carbon_credit_id' => $credit->id,
            'seller_id' => $credit->mrvDeclaration?->user_id,
            'buyer_id' => $buyer->id,
            'quantity' => $quantity,
            'price_per_credit' => $credit->price_per_credit ?? 0,
            'total_amount' => $totalAmount,
            'transaction_date' => now()->format('Y-m-d'),
            'payment_status' => 'completed',
            'transaction_hash' => '0x' . substr(md5(uniqid('tx_', true)), 0, 40),
        ]);

        $credit->status = 'sold';
        $credit->save();

        return $this->success($tx, 'Purchase completed');
    }
}



