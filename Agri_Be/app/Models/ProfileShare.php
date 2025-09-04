<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileShare extends Model
{
    use HasFactory;

    protected $fillable = [
        'share_code',
        'user_id',
        'expires_at',
        'is_active',
        'view_count',
        'last_viewed_at'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'last_viewed_at' => 'datetime',
        'is_active' => 'boolean'
    ];

    /**
     * Relationship với User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Kiểm tra xem share code có còn hạn không
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Tăng view count
     */
    public function incrementViewCount(): void
    {
        $this->increment('view_count');
        $this->update(['last_viewed_at' => now()]);
    }

    /**
     * Tạo share code mới
     */
    public static function generateShareCode(): string
    {
        do {
            $code = 'AGC-' . strtoupper(substr(md5(uniqid()), 0, 8));
        } while (static::where('share_code', $code)->exists());

        return $code;
    }

    /**
     * Scope để lấy active shares
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                    ->where('expires_at', '>', now());
    }

    /**
     * Scope để lấy expired shares
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', now());
    }
}
