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
        Schema::create('ai_analysis_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evidence_file_id')->constrained('evidence_files')->onDelete('cascade');
            $table->string('analysis_type', 50);
            $table->decimal('confidence_score', 5, 2);
            $table->json('analysis_results');
            $table->decimal('crop_health_score', 5, 2)->nullable();
            $table->decimal('authenticity_score', 5, 2)->nullable();
            $table->json('quality_indicators')->nullable();
            $table->text('recommendations')->nullable();
            $table->timestamp('processed_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_analysis_results');
    }
};
