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
        Schema::create('mrv_declarations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plot_boundary_id')->constrained('plot_boundaries')->onDelete('cascade');
            $table->foreignId('farm_profile_id')->constrained('farm_profiles')->onDelete('cascade');
            $table->string('declaration_period', 20);

            // Rice farming data
            $table->date('rice_sowing_date')->nullable();
            $table->date('rice_harvest_date')->nullable();
            $table->integer('awd_cycles_per_season')->nullable();
            $table->string('water_management_method', 100)->nullable();
            $table->string('straw_management', 100)->nullable();

            // Agroforestry data
            $table->integer('tree_density_per_hectare')->nullable();
            $table->json('tree_species')->nullable();
            $table->json('intercrop_species')->nullable();
            $table->date('planting_date')->nullable();

            // Performance scores
            $table->decimal('carbon_performance_score', 5, 2)->nullable();
            $table->decimal('mrv_reliability_score', 5, 2)->nullable();
            $table->decimal('estimated_carbon_credits', 10, 2)->nullable();

            $table->string('status', 20)->default('draft')->comment('draft, submitted, verified, rejected');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mrv_declarations');
    }
};
