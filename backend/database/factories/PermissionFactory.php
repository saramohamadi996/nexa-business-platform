<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PermissionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->words(2, true),
            'slug' => fake()->unique()->slug(),
            'group' => fake()->randomElement([
                'customers',
                'leads',
                'deals',
                'tasks',
                'team',
            ]),
        ];
    }
}
