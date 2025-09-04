<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreatePlotRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        // Chuẩn hoá các field có thể được gửi dưới dạng string JSON từ FE (FormData)
        foreach (['boundary_coordinates', 'tree_species', 'intercrop_species'] as $key) {
            $value = $this->input($key);
            if (is_string($value)) {
                $decoded = json_decode($value, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $this->merge([$key => $decoded]);
                }
            }
        }

        // Alias: nếu FE gửi name/total_area thay cho plot_name/area_hectares
        if (!$this->has('plot_name') && $this->has('name')) {
            $this->merge(['plot_name' => $this->input('name')]);
        }
        if (!$this->has('area_hectares') && $this->has('total_area')) {
            $this->merge(['area_hectares' => $this->input('total_area')]);
        }
    }

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            // Có thể không gửi farm_profile_id: backend sẽ tự tạo FarmProfile cho user nếu thiếu
            'farm_profile_id' => ['nullable','exists:farm_profiles,id'],
            // Support both plot_name and name
            'plot_name' => ['required_without:name','string','max:100'],
            'name' => ['required_without:plot_name','string','max:100'],
            'plot_type' => ['required','in:rice,agroforestry,mixed'],
            // Support both area_hectares and total_area
            'area_hectares' => ['required_without:total_area','numeric','min:0.1'],
            'total_area' => ['required_without:area_hectares','numeric','min:0.1'],
            'boundary_coordinates' => ['required','array'],
            'boundary_coordinates.*.lat' => ['required','numeric','between:-90,90'],
            'boundary_coordinates.*.lng' => ['required','numeric','between:-180,180'],
            'gps_latitude' => ['nullable','numeric','between:-90,90'],
            'gps_longitude' => ['nullable','numeric','between:-180,180'],

            // Rice
            'rice_sowing_date' => ['nullable','date','before:tomorrow'],
            'awd_cycles_per_season' => ['nullable','integer','min:0','max:6'],
            'water_management_method' => ['nullable','string','max:100'],
            'straw_management' => ['nullable','string','max:100'],

            // Agroforestry
            'tree_density_per_hectare' => ['nullable','integer','min:0','max:1000'],
            'tree_species' => ['nullable','array'],
            'tree_species.*' => ['string','max:100'],
            'intercrop_species' => ['nullable','array'],
            'intercrop_species.*' => ['string','max:100'],
            'planting_date' => ['nullable','date','before:tomorrow'],

            // Evidence
            'evidence_files' => ['sometimes','array'],
            'evidence_files.*' => ['file','max:10240'],
        ];
    }
}


