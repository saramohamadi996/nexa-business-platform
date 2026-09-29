<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('deals', function (Blueprint $table) {
            $table->id();

            $table->foreignId('organization_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('customer_id')
                ->constrained()
                ->restrictOnDelete();

            $table->foreignId('lead_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->string('title');
            $table->text('description')->nullable();

            $table->decimal('value', 15, 2)->default(0);
            $table->string('currency', 10)->default('USD');

            $table->string('stage', 30)->default('new');
            $table->unsignedTinyInteger('probability')->default(0);

            $table->date('expected_close_date')->nullable();

            $table->foreignId('assigned_to')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('created_by')
                ->constrained('users')
                ->restrictOnDelete();

            $table->timestamp('won_at')->nullable();
            $table->timestamp('lost_at')->nullable();

            $table->timestamps();

            $table->index('organization_id');
            $table->index(['organization_id', 'stage']);
            $table->index('assigned_to');
            $table->index('expected_close_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deals');
    }
};
