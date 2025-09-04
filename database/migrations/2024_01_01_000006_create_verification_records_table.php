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
        Schema::create('verification_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mrv_declaration_id')->constrained('mrv_declarations')->onDelete('cascade');
            $table->foreignId('verifier_id')->constrained('users')->onDelete('cascade');
            $table->string('verification_type', 50)->comment('remote, field, hybrid');
            $table->date('verification_date');
            $table->string('verification_status', 20)->default('pending')->comment('pending, approved, rejected, requires_revision');
            $table->decimal('verification_score', 5, 2)->nullable();
            $table->text('field_visit_notes')->nullable();
            $table->json('verification_evidence')->nullable();
            $table->text('verifier_comments')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('verification_records');
    }
};
