<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadFactory extends Factory
{
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'name' => fake()->name(),
            'company_name' => fake()->optional()->company(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'source' => fake()->randomElement([
                'website',
                'referral',
                'linkedin',
                'email',
                'other',
            ]),
            'status' => 'new',
            'priority' => 'medium',
            'estimated_value' => fake()->randomFloat(2, 500, 50000),
            'assigned_to' => User::factory(),
            'converted_customer_id' => null,
            'notes' => fake()->optional()->sentence(),
            'converted_at' => null,
            'created_by' => User::factory(),
        ];
    }
}
