<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityFactory extends Factory
{
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'user_id' => User::factory(),
            'subject' => fake()->sentence(4),
            'description' => fake()->optional()->paragraph(),
            'type' => 'note',
            'subject_type' => null,
            'subject_id' => null,
            'metadata' => null,
        ];
    }
}
