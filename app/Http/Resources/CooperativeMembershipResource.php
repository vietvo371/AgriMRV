<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CooperativeMembershipResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'cooperative_id' => $this->cooperative_id,
            'membership_number' => $this->membership_number,
            'join_date' => optional($this->join_date)->format('Y-m-d'),
            'membership_status' => $this->membership_status,
            'membership_fee_paid' => (bool) $this->membership_fee_paid,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}


