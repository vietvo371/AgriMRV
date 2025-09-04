<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarbonTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'carbon_credit_id',
        'seller_id',
        'buyer_id',
        'quantity',
        'price_per_credit',
        'total_amount',
        'transaction_date',
        'payment_status',
        'transaction_hash',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'price_per_credit' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'transaction_date' => 'date',
    ];

    public $timestamps = false;

    // Relationships
    public function carbonCredit()
    {
        return $this->belongsTo(CarbonCredit::class);
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }
}
