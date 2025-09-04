<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VerificationRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'mrv_declaration_id',
        'verifier_id',
        'verification_type',
        'verification_date',
        'verification_status',
        'verification_score',
        'field_visit_notes',
        'verification_evidence',
        'verifier_comments',
    ];

    protected $casts = [
        'verification_date' => 'date',
        'verification_score' => 'decimal:2',
        'verification_evidence' => 'array',
    ];

    // Relationships
    public function mrvDeclaration()
    {
        return $this->belongsTo(MrvDeclaration::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verifier_id');
    }

    public function carbonCredits()
    {
        return $this->hasMany(CarbonCredit::class);
    }
}
