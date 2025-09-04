<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlotBoundary extends Model
{
    use HasFactory;

    protected $fillable = [
        'farm_profile_id',
        'plot_name',
        'boundary_coordinates',
        'area_hectares',
        'plot_type',
    ];

    protected $casts = [
        'boundary_coordinates' => 'array',
        'area_hectares' => 'decimal:2',
    ];

    public $timestamps = false;

    // Relationships
    public function farmProfile()
    {
        return $this->belongsTo(FarmProfile::class);
    }
}
