<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvidenceFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'mrv_declaration_id',
        'file_type',
        'file_url',
        'file_name',
        'file_size_bytes',
        'gps_latitude',
        'gps_longitude',
        'capture_timestamp',
        'description',
    ];

    protected $casts = [
        'gps_latitude' => 'decimal:8',
        'gps_longitude' => 'decimal:8',
        'capture_timestamp' => 'datetime',
        'file_size_bytes' => 'integer',
    ];

    public $timestamps = false;

    // Relationships
    public function mrvDeclaration()
    {
        return $this->belongsTo(MrvDeclaration::class);
    }

    public function aiAnalysisResults()
    {
        return $this->hasMany(AiAnalysisResult::class);
    }
}
