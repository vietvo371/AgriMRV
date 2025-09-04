<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MrvDeclarationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'farm_profile_id' => $this->farm_profile_id,
            'declaration_period' => $this->declaration_period,
            'rice_sowing_date' => optional($this->rice_sowing_date)->format('Y-m-d'),
            'rice_harvest_date' => optional($this->rice_harvest_date)->format('Y-m-d'),
            'awd_cycles_per_season' => $this->awd_cycles_per_season,
            'water_management_method' => $this->water_management_method,
            'straw_management' => $this->straw_management,
            'tree_density_per_hectare' => $this->tree_density_per_hectare,
            'tree_species' => $this->tree_species,
            'intercrop_species' => $this->intercrop_species,
            'planting_date' => optional($this->planting_date)->format('Y-m-d'),
            'carbon_performance_score' => $this->carbon_performance_score !== null ? (float) $this->carbon_performance_score : null,
            'mrv_reliability_score' => $this->mrv_reliability_score !== null ? (float) $this->mrv_reliability_score : null,
            'estimated_carbon_credits' => $this->estimated_carbon_credits !== null ? (float) $this->estimated_carbon_credits : null,
            'status' => $this->status,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}


