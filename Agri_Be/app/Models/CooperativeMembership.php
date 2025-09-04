<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CooperativeMembership extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'cooperative_id',
        'membership_number',
        'join_date',
        'membership_status',
        'membership_fee_paid',
    ];

    protected $casts = [
        'join_date' => 'date',
        'membership_fee_paid' => 'boolean',
    ];

    public $timestamps = false;

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cooperative()
    {
        return $this->belongsTo(User::class, 'cooperative_id');
    }
}
