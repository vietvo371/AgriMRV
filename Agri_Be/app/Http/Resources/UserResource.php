<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $gps = null;
        if (!is_null($this->gps_latitude) && !is_null($this->gps_longitude)) {
            $gps = $this->gps_latitude.','.$this->gps_longitude;
        }
        $role = $this->user_type === 'farmer' ? 'farmer' : $this->user_type;
        return [
            'user_id' => $this->id,
            'role' => $role,
            'name' => $this->full_name,
            'dob' => optional($this->date_of_birth)->format('Y-m-d'),
            'phone' => $this->phone,
            'email' => $this->email,
            'gps_location' => $gps,
            'org_name' => $this->organization_name,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}


