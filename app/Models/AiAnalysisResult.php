<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiAnalysisResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'evidence_file_id',
        'analysis_type',
        'confidence_score',
        'analysis_results',
        'crop_health_score',
        'authenticity_score',
        'quality_indicators',
        'recommendations',
    ];

    protected $casts = [
        'confidence_score' => 'decimal:2',
        'crop_health_score' => 'decimal:2',
        'authenticity_score' => 'decimal:2',
        'analysis_results' => 'array',
        'quality_indicators' => 'array',
        'processed_at' => 'datetime',
    ];

    public $timestamps = false;

    // Relationships
    public function evidenceFile()
    {
        return $this->belongsTo(EvidenceFile::class);
    }
}
