<?php

namespace App\Http\Requests\Mrv;

use Illuminate\Foundation\Http\FormRequest;

class MrvDeclarationUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'declaration_period' => ['sometimes','string','max:20'],
            'rice_sowing_date' => ['nullable','date'],
            'rice_harvest_date' => ['nullable','date','after_or_equal:rice_sowing_date'],
            'awd_cycles_per_season' => ['nullable','integer'],
            'water_management_method' => ['nullable','string','max:100'],
            'straw_management' => ['nullable','string','max:100'],
            'tree_density_per_hectare' => ['nullable','integer'],
            'tree_species' => ['nullable','array'],
            'intercrop_species' => ['nullable','array'],
            'planting_date' => ['nullable','date'],
            'carbon_performance_score' => ['nullable','numeric'],
            'mrv_reliability_score' => ['nullable','numeric'],
            'estimated_carbon_credits' => ['nullable','numeric'],
            'status' => ['nullable','in:draft,submitted,verified,rejected'],
        ];
    }
}


