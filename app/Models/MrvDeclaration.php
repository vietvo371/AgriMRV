<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MrvDeclaration extends Model
{
    use HasFactory;

    protected $fillable = [
        'plot_boundary_id',
        'farm_profile_id',
        'declaration_period',
        'rice_sowing_date',
        'rice_harvest_date',
        'awd_cycles_per_season',
        'water_management_method',
        'straw_management',
        'tree_density_per_hectare',
        'tree_species',
        'intercrop_species',
        'planting_date',
        'carbon_performance_score',
        'mrv_reliability_score',
        'estimated_carbon_credits',
        'status',
    ];

    protected $casts = [
        'rice_sowing_date' => 'date',
        'rice_harvest_date' => 'date',
        'planting_date' => 'date',
        'awd_cycles_per_season' => 'integer',
        'tree_density_per_hectare' => 'integer',
        'tree_species' => 'array',
        'intercrop_species' => 'array',
        'carbon_performance_score' => 'float',
        'mrv_reliability_score' => 'float',
        'estimated_carbon_credits' => 'float',
    ];

    // Relationships
    public function plotBoundary()
    {
        return $this->belongsTo(PlotBoundary::class, 'plot_boundary_id');
    }

    public function farmProfile()
    {
        return $this->belongsTo(FarmProfile::class);
    }

    public function evidenceFiles()
    {
        return $this->hasMany(EvidenceFile::class);
    }

    public function verificationRecords()
    {
        return $this->hasMany(VerificationRecord::class);
    }

    public function carbonCredits()
    {
        return $this->hasMany(CarbonCredit::class);
    }
}
