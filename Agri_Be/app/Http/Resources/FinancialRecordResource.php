<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FinancialRecordResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'bank_id' => $this->bank_id,
            'record_type' => $this->record_type,
            'amount' => $this->amount !== null ? (float) $this->amount : null,
            'currency' => $this->currency,
            'transaction_date' => optional($this->transaction_date)->format('Y-m-d'),
            'description' => $this->description,
            'status' => $this->status,
            'reference_number' => $this->reference_number,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}


