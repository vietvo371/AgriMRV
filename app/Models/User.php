<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'email',
        'phone',
        'full_name',
        'date_of_birth',
        'user_type',
        'gps_latitude',
        'gps_longitude',
        'organization_name',
        'organization_type',
        'address',
        'password',
        'otp',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'otp',
        'avatar',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_of_birth' => 'date',
            'gps_latitude' => 'decimal:8',
            'gps_longitude' => 'decimal:8',
        ];
    }

    // Simplified OTP sender placeholder
    public function sendOtp(string $otp): void
    {
        // Integrate mail/SMS here. For now, just log or no-op.
    }

    // Relationships
    public function farmProfile()
    {
        return $this->hasOne(FarmProfile::class);
    }

    public function mrvDeclarations()
    {
        return $this->hasMany(MrvDeclaration::class);
    }

    public function verificationRecords()
    {
        return $this->hasMany(VerificationRecord::class, 'verifier_id');
    }

    public function carbonTransactionsAsSeller()
    {
        return $this->hasMany(CarbonTransaction::class, 'seller_id');
    }

    public function carbonTransactionsAsBuyer()
    {
        return $this->hasMany(CarbonTransaction::class, 'buyer_id');
    }

    public function cooperativeMemberships()
    {
        return $this->hasMany(CooperativeMembership::class);
    }

    public function cooperativeMembers()
    {
        return $this->hasMany(CooperativeMembership::class, 'cooperative_id');
    }

    public function trainingRecords()
    {
        return $this->hasMany(TrainingRecord::class);
    }

    public function financialRecords()
    {
        return $this->hasMany(FinancialRecord::class);
    }

    public function financialRecordsAsBank()
    {
        return $this->hasMany(FinancialRecord::class, 'bank_id');
    }

    public function profileShares()
    {
        return $this->hasMany(ProfileShare::class);
    }
}
