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
        Schema::create('evidence_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mrv_declaration_id')->constrained('mrv_declarations')->onDelete('cascade');
            $table->string('file_type', 20);
            $table->text('file_url');
            $table->string('file_name', 255);
            $table->bigInteger('file_size_bytes');
            $table->decimal('gps_latitude', 10, 8)->nullable();
            $table->decimal('gps_longitude', 11, 8)->nullable();
            $table->timestamp('capture_timestamp')->nullable();
            $table->text('description')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evidence_files');
    }
};
