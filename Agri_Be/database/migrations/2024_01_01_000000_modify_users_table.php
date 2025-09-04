<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add new columns safely
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone', 20)->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'full_name')) {
                $table->string('full_name', 255)->nullable()->after('phone');
            }
            if (!Schema::hasColumn('users', 'date_of_birth')) {
                $table->date('date_of_birth')->nullable()->after('full_name');
            }
            if (!Schema::hasColumn('users', 'user_type')) {
                $table->string('user_type', 20)->nullable()->after('date_of_birth')->comment('farmer, bank, cooperative, verifier, government, buyer');
            }
            if (!Schema::hasColumn('users', 'gps_latitude')) {
                $table->decimal('gps_latitude', 10, 8)->nullable()->after('user_type');
            }
            if (!Schema::hasColumn('users', 'gps_longitude')) {
                $table->decimal('gps_longitude', 11, 8)->nullable()->after('gps_latitude');
            }
            if (!Schema::hasColumn('users', 'organization_name')) {
                $table->string('organization_name', 255)->nullable()->after('gps_longitude');
            }
            if (!Schema::hasColumn('users', 'organization_type')) {
                $table->string('organization_type', 50)->nullable()->after('organization_name');
            }
            if (!Schema::hasColumn('users', 'address')) {
                $table->text('address')->nullable()->after('organization_type');
            }

            if (Schema::hasColumn('users', 'name')) {
                $table->dropColumn('name');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'name')) {
                $table->string('name')->after('id');
            }
            foreach ([
                'phone',
                'full_name',
                'date_of_birth',
                'user_type',
                'gps_latitude',
                'gps_longitude',
                'organization_name',
                'organization_type',
                'address',
            ] as $col) {
                if (Schema::hasColumn('users', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
