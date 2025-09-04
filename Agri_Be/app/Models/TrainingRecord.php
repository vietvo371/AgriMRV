<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'training_type',
        'training_title',
        'completion_date',
        'completion_status',
        'score',
        'certificate_url',
    ];

    protected $casts = [
        'completion_date' => 'date',
        'score' => 'decimal:2',
    ];

    public $timestamps = false;

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
