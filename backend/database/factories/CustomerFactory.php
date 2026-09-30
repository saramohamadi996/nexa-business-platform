<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'name' => fake()->name(),
            'company_name' => fake()->optional()->company(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'website' => fake()->optional()->url(),
            'industry' => fake()->optional()->randomElement([
                'Technology',
                'Retail',
                'Finance',
                'Healthcare',
                'Education',
            ]),
            'status' => 'active',
            'source' => fake()->randomElement([
                'website',
                'referral',
                'linkedin',
                'email',
                'other',
            ]),
            'notes' => fake()->optional()->sentence(),
            'created_by' => User::factory(),
        ];
    }
}
