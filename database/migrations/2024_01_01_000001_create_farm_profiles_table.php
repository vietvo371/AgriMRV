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
        Schema::create('farm_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->decimal('total_area_hectares', 10, 2);
            $table->decimal('rice_area_hectares', 10, 2)->nullable();
            $table->decimal('agroforestry_area_hectares', 10, 2)->nullable();
            $table->string('primary_crop_type', 100)->nullable();
            $table->integer('farming_experience_years')->nullable();
            $table->string('irrigation_type', 50)->nullable();
            $table->string('soil_type', 50)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('farm_profiles');
    }
};
