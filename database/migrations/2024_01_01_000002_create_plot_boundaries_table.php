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
        Schema::create('plot_boundaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_profile_id')->constrained('farm_profiles')->onDelete('cascade');
            $table->string('plot_name', 100)->nullable();
            $table->json('boundary_coordinates');
            $table->decimal('area_hectares', 10, 2);
            $table->string('plot_type', 50)->comment('rice, agroforestry, mixed');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plot_boundaries');
    }
};
