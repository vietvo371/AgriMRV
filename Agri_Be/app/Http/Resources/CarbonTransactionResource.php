<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarbonTransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'carbon_credit_id' => $this->carbon_credit_id,
            'seller_id' => $this->seller_id,
            'buyer_id' => $this->buyer_id,
            'quantity' => $this->quantity !== null ? (float) $this->quantity : null,
            'price_per_credit' => $this->price_per_credit !== null ? (float) $this->price_per_credit : null,
            'total_amount' => $this->total_amount !== null ? (float) $this->total_amount : null,
            'transaction_date' => optional($this->transaction_date)->format('Y-m-d'),
            'payment_status' => $this->payment_status,
            'transaction_hash' => $this->transaction_hash,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}


