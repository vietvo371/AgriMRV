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
        Schema::create('carbon_credits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mrv_declaration_id')->constrained('mrv_declarations')->onDelete('cascade');
            $table->foreignId('verification_record_id')->constrained('verification_records')->onDelete('cascade');
            $table->decimal('credit_amount', 10, 2);
            $table->string('credit_type', 50);
            $table->integer('vintage_year');
            $table->string('certification_standard', 100);
            $table->string('serial_number', 255)->unique();
            $table->string('status', 20)->default('issued')->comment('issued, sold, retired, cancelled');
            $table->decimal('price_per_credit', 10, 2)->nullable();
            $table->date('issued_date');
            $table->date('expiry_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carbon_credits');
    }
};
