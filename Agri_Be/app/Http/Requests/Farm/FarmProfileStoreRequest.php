<?php

namespace App\Http\Requests\Farm;

use Illuminate\Foundation\Http\FormRequest;

class FarmProfileStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required','exists:users,id'],
            'total_area_hectares' => ['required','numeric'],
            'rice_area_hectares' => ['nullable','numeric'],
            'agroforestry_area_hectares' => ['nullable','numeric'],
            'primary_crop_type' => ['nullable','string','max:100'],
            'farming_experience_years' => ['nullable','integer'],
            'irrigation_type' => ['nullable','string','max:50'],
            'soil_type' => ['nullable','string','max:50'],
        ];
    }
}


