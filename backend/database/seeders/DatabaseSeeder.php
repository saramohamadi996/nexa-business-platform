<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Customer;
use App\Models\Deal;
use App\Models\Lead;
use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        /*
         * Organization
         */
        $organization = Organization::create([
            'name' => 'Nexa Demo',
            'slug' => 'nexa-demo',
            'industry' => 'Technology',
            'timezone' => 'UTC',
            'currency' => 'USD',
        ]);

        /*
         * Permissions
         */
        $permissions = collect([
            ['name' => 'View Customers', 'slug' => 'customers.view', 'group' => 'customers'],
            ['name' => 'Create Customers', 'slug' => 'customers.create', 'group' => 'customers'],
            ['name' => 'Update Customers', 'slug' => 'customers.update', 'group' => 'customers'],
            ['name' => 'Delete Customers', 'slug' => 'customers.delete', 'group' => 'customers'],

            ['name' => 'View Leads', 'slug' => 'leads.view', 'group' => 'leads'],
            ['name' => 'Create Leads', 'slug' => 'leads.create', 'group' => 'leads'],
            ['name' => 'Update Leads', 'slug' => 'leads.update', 'group' => 'leads'],

            ['name' => 'View Deals', 'slug' => 'deals.view', 'group' => 'deals'],
            ['name' => 'Create Deals', 'slug' => 'deals.create', 'group' => 'deals'],
            ['name' => 'Update Deals', 'slug' => 'deals.update', 'group' => 'deals'],

            ['name' => 'View Tasks', 'slug' => 'tasks.view', 'group' => 'tasks'],
            ['name' => 'Create Tasks', 'slug' => 'tasks.create', 'group' => 'tasks'],
            ['name' => 'Update Tasks', 'slug' => 'tasks.update', 'group' => 'tasks'],

            ['name' => 'Manage Team', 'slug' => 'team.manage', 'group' => 'team'],
        ])->map(fn (array $permission) => Permission::create($permission));

        /*
         * Roles
         */
        $ownerRole = Role::create([
            'organization_id' => null,
            'name' => 'Owner',
            'slug' => 'owner',
        ]);

        $adminRole = Role::create([
            'organization_id' => null,
            'name' => 'Admin',
            'slug' => 'admin',
        ]);

        $memberRole = Role::create([
            'organization_id' => null,
            'name' => 'Member',
            'slug' => 'member',
        ]);

        $ownerRole->permissions()->sync($permissions->pluck('id'));

        $adminRole->permissions()->sync(
            $permissions
                ->where('group', '!=', 'team')
                ->pluck('id')
        );

        $memberRole->permissions()->sync(
            $permissions
                ->whereIn('group', ['customers', 'leads', 'deals', 'tasks'])
                ->pluck('id')
        );

        /*
         * Users
         */
        $owner = User::create([
            'name' => 'Nexa Owner',
            'email' => 'owner@nexa.test',
            'password' => Hash::make('password'),
            'phone' => '+10000000001',
            'is_active' => true,
        ]);

        $admin = User::create([
            'name' => 'Nexa Admin',
            'email' => 'admin@nexa.test',
            'password' => Hash::make('password'),
            'phone' => '+10000000002',
            'is_active' => true,
        ]);

        $member = User::create([
            'name' => 'Nexa Member',
            'email' => 'member@nexa.test',
            'password' => Hash::make('password'),
            'phone' => '+10000000003',
            'is_active' => true,
        ]);

        /*
         * Organization membership
         */
        $organization->users()->attach($owner->id, [
            'role_id' => $ownerRole->id,
            'joined_at' => now(),
        ]);

        $organization->users()->attach($admin->id, [
            'role_id' => $adminRole->id,
            'joined_at' => now(),
        ]);

        $organization->users()->attach($member->id, [
            'role_id' => $memberRole->id,
            'joined_at' => now(),
        ]);

        $users = collect([$owner, $admin, $member]);

        /*
         * Customers
         */
        $customers = Customer::factory()
            ->count(15)
            ->create([
                'organization_id' => $organization->id,
                'created_by' => $owner->id,
            ]);

        /*
         * Leads
         */
        $leads = Lead::factory()
            ->count(12)
            ->create([
                'organization_id' => $organization->id,
                'assigned_to' => $member->id,
                'created_by' => $owner->id,
            ]);

        /*
         * Deals
         */
        $deals = Deal::factory()
            ->count(10)
            ->create([
                'organization_id' => $organization->id,
                'customer_id' => $customers->random()->id,
                'assigned_to' => $admin->id,
                'created_by' => $owner->id,
            ]);

        /*
         * Tasks
         */
        $tasks = Task::factory()
            ->count(20)
            ->create([
                'organization_id' => $organization->id,
                'assigned_to' => $member->id,
                'created_by' => $owner->id,
            ]);

        foreach ($tasks as $task) {
            $relationType = fake()->randomElement([
                'customer',
                'lead',
                'deal',
                null,
            ]);

            if ($relationType === 'customer') {
                $task->update([
                    'customer_id' => $customers->random()->id,
                ]);
            }

            if ($relationType === 'lead') {
                $task->update([
                    'lead_id' => $leads->random()->id,
                ]);
            }

            if ($relationType === 'deal') {
                $task->update([
                    'deal_id' => $deals->random()->id,
                ]);
            }
        }

        /*
         * Activities
         */
        foreach (range(1, 30) as $index) {
            $subject = $customers->random();

            Activity::create([
                'organization_id' => $organization->id,
                'user_id' => $users->random()->id,
                'subject' => fake()->sentence(4),
                'description' => fake()->optional()->paragraph(),
                'type' => fake()->randomElement([
                    'created',
                    'updated',
                    'note',
                    'call',
                    'email',
                    'meeting',
                ]),
                'subject_type' => $subject->getMorphClass(),
                'subject_id' => $subject->id,
                'metadata' => [
                    'source' => 'demo',
                ],
            ]);
        }
    }
}
