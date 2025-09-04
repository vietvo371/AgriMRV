<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FarmProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'total_area_hectares' => (float) $this->total_area_hectares,
            'rice_area_hectares' => $this->rice_area_hectares !== null ? (float) $this->rice_area_hectares : null,
            'agroforestry_area_hectares' => $this->agroforestry_area_hectares !== null ? (float) $this->agroforestry_area_hectares : null,
            'primary_crop_type' => $this->primary_crop_type,
            'farming_experience_years' => $this->farming_experience_years,
            'irrigation_type' => $this->irrigation_type,
            'soil_type' => $this->soil_type,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}


