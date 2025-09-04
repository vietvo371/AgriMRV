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
        Schema::create('financial_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('bank_id')->constrained('users')->onDelete('cascade');
            $table->string('record_type', 20)->comment('loan, payment, carbon_revenue');
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3);
            $table->date('transaction_date');
            $table->text('description')->nullable();
            $table->string('status', 20);
            $table->string('reference_number', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('financial_records');
    }
};
