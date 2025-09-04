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
        Schema::create('blockchain_anchors', function (Blueprint $table) {
            $table->id();
            $table->string('record_type', 50)->comment('mrv_declaration, verification, carbon_credit');
            $table->bigInteger('record_id');
            $table->string('blockchain_network', 50);
            $table->string('transaction_hash', 255);
            $table->bigInteger('block_number');
            $table->integer('gas_used');
            $table->json('anchor_data');
            $table->timestamp('anchor_timestamp');
            $table->text('verification_url')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blockchain_anchors');
    }
};
