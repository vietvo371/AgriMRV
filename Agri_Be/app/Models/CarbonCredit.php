<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarbonCredit extends Model
{
    use HasFactory;

    protected $fillable = [
        'mrv_declaration_id',
        'verification_record_id',
        'credit_amount',
        'credit_type',
        'vintage_year',
        'certification_standard',
        'serial_number',
        'status',
        'price_per_credit',
        'issued_date',
        'expiry_date',
    ];

    protected $casts = [
        'credit_amount' => 'decimal:2',
        'price_per_credit' => 'decimal:2',
        'vintage_year' => 'integer',
        'issued_date' => 'date',
        'expiry_date' => 'date',
    ];

    public $timestamps = false;

    // Relationships
    public function mrvDeclaration()
    {
        return $this->belongsTo(MrvDeclaration::class);
    }

    public function verificationRecord()
    {
        return $this->belongsTo(VerificationRecord::class);
    }

    public function carbonTransactions()
    {
        return $this->hasMany(CarbonTransaction::class);
    }
}
