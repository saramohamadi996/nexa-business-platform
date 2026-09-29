<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Deal;
use App\Models\Lead;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'title' => fake()->sentence(5),
            'description' => fake()->optional()->paragraph(),
            'status' => 'todo',
            'priority' => 'medium',
            'due_date' => fake()->optional()->dateTimeBetween('now', '+1 month'),
            'customer_id' => null,
            'lead_id' => null,
            'deal_id' => null,
            'assigned_to' => User::factory(),
            'created_by' => User::factory(),
            'completed_at' => null,
        ];
    }
}
