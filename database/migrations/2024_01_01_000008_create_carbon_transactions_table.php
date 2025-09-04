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
        Schema::create('carbon_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('carbon_credit_id')->constrained('carbon_credits')->onDelete('cascade');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->decimal('quantity', 10, 2);
            $table->decimal('price_per_credit', 10, 2);
            $table->decimal('total_amount', 12, 2);
            $table->date('transaction_date');
            $table->string('payment_status', 20);
            $table->string('transaction_hash', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carbon_transactions');
    }
};
