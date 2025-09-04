<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarbonCreditResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'mrv_declaration_id' => $this->mrv_declaration_id,
            'verification_record_id' => $this->verification_record_id,
            'credit_amount' => $this->credit_amount !== null ? (float) $this->credit_amount : null,
            'credit_type' => $this->credit_type,
            'vintage_year' => $this->vintage_year,
            'certification_standard' => $this->certification_standard,
            'serial_number' => $this->serial_number,
            'status' => $this->status,
            'price_per_credit' => $this->price_per_credit !== null ? (float) $this->price_per_credit : null,
            'issued_date' => optional($this->issued_date)->format('Y-m-d'),
            'expiry_date' => optional($this->expiry_date)->format('Y-m-d'),
        ];
    }
}


