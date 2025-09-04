<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlotBoundaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'farm_profile_id' => $this->farm_profile_id,
            'plot_name' => $this->plot_name,
            'boundary_coordinates' => $this->boundary_coordinates,
            'area_hectares' => $this->area_hectares !== null ? (float) $this->area_hectares : null,
            'plot_type' => $this->plot_type,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}


