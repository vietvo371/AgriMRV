<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FarmProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_area_hectares',
        'rice_area_hectares',
        'agroforestry_area_hectares',
        'primary_crop_type',
        'farming_experience_years',
        'irrigation_type',
        'soil_type',
    ];

    protected $casts = [
        'total_area_hectares' => 'decimal:2',
        'rice_area_hectares' => 'decimal:2',
        'agroforestry_area_hectares' => 'decimal:2',
        'farming_experience_years' => 'integer',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plotBoundaries()
    {
        return $this->hasMany(PlotBoundary::class);
    }

    public function mrvDeclarations()
    {
        return $this->hasMany(MrvDeclaration::class);
    }
}
