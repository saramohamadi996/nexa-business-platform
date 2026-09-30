<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class OrganizationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'slug' => fake()->unique()->slug(),
            'logo' => null,
            'website' => fake()->optional()->url(),
            'industry' => fake()->randomElement([
                'Technology',
                'Consulting',
                'Retail',
                'Finance',
                'Healthcare',
            ]),
            'timezone' => 'UTC',
            'currency' => 'USD',
        ];
    }
}
