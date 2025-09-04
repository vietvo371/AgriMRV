<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlockchainAnchor extends Model
{
    use HasFactory;

    protected $fillable = [
        'record_type',
        'record_id',
        'blockchain_network',
        'transaction_hash',
        'block_number',
        'gas_used',
        'anchor_data',
        'anchor_timestamp',
        'verification_url',
    ];

    protected $casts = [
        'record_id' => 'integer',
        'block_number' => 'integer',
        'gas_used' => 'integer',
        'anchor_data' => 'array',
        'anchor_timestamp' => 'datetime',
    ];

    public $timestamps = false;
}
