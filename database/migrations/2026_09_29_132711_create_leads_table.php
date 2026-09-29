<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();

            $table->foreignId('organization_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('name');
            $table->string('company_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 50)->nullable();

            $table->string('source', 50)->nullable();
            $table->string('status', 30)->default('new');
            $table->string('priority', 30)->default('medium');

            $table->decimal('estimated_value', 15, 2)->nullable();

            $table->foreignId('assigned_to')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('converted_customer_id')
                ->nullable()
                ->constrained('customers')
                ->nullOnDelete();

            $table->text('notes')->nullable();

            $table->timestamp('converted_at')->nullable();

            $table->foreignId('created_by')
                ->constrained('users')
                ->restrictOnDelete();

            $table->timestamps();

            $table->index('organization_id');
            $table->index(['organization_id', 'status']);
            $table->index('assigned_to');
            $table->index('converted_customer_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
