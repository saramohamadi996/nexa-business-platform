<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Lead;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DealFactory extends Factory
{
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'customer_id' => Customer::factory(),
            'lead_id' => null,
            'title' => fake()->sentence(4),
            'description' => fake()->optional()->paragraph(),
            'value' => fake()->randomFloat(2, 1000, 100000),
            'currency' => 'USD',
            'stage' => 'new',
            'probability' => 10,
            'expected_close_date' => fake()->optional()->dateTimeBetween('now', '+3 months'),
            'assigned_to' => User::factory(),
            'created_by' => User::factory(),
            'won_at' => null,
            'lost_at' => null,
        ];
    }
}
