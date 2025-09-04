<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use App\Models\FarmProfile;
use Illuminate\Http\Request;

class FarmProfileController extends Controller
{
    use ApiResponseTrait;

    public function index()
    {
        return $this->success(FarmProfile::with('user')->paginate());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required','exists:users,id'],
            'total_area_hectares' => ['required','numeric'],
            'rice_area_hectares' => ['nullable','numeric'],
            'agroforestry_area_hectares' => ['nullable','numeric'],
            'primary_crop_type' => ['nullable','string','max:100'],
            'farming_experience_years' => ['nullable','integer'],
            'irrigation_type' => ['nullable','string','max:50'],
            'soil_type' => ['nullable','string','max:50'],
        ]);
        $profile = FarmProfile::create($validated);
        return $this->success($profile, 'Created', 201);
    }

    public function show(FarmProfile $farmProfile)
    {
        return $this->success($farmProfile->load('user','plotBoundaries'));
    }

    public function update(Request $request, FarmProfile $farmProfile)
    {
        $farmProfile->update($request->all());
        return $this->success($farmProfile, 'Updated');
    }

    public function destroy(FarmProfile $farmProfile)
    {
        $farmProfile->delete();
        return $this->success(null, 'Deleted');
    }
}


