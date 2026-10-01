<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTeamRequest;
use App\Http\Requests\UpdateTeamRequest;
use App\Models\Organization;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class TeamController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $organizationId = $request->validate([
            'organization_id' => ['required', 'integer', 'exists:organizations,id'],
        ])['organization_id'];

        abort_unless(
            $request->user()->organizations()->whereKey($organizationId)->exists(),
            403,
            'You do not have access to this organization.'
        );

        $organization = Organization::findOrFail($organizationId);
        $members = $organization->users()
            ->withPivot('role_id', 'joined_at')->with('organizations')->get();

        return response()->json([
            'data' => $members,
        ]);
    }

    public function store(StoreTeamRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $roleId = $validated['role_id'] ?? null;
        if ($roleId) {
            abort_unless(
                Role::whereKey($roleId)
                    ->where(fn($q) => $q->whereNull('organization_id')
                        ->orWhere('organization_id', $validated['organization_id']))
                    ->exists(),
                422,
                'The selected role is not available for this organization.'
            );
        }
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'is_active' => true,
        ]);

        $user->organizations()->attach($validated['organization_id'], [
            'role_id' => $roleId,
            'joined_at' => now(),
        ]);
        return response()->json([
            'message' => 'Team member created successfully.',
            'data' => $user->load('organizations'),
        ], 201);
    }

    public function update(UpdateTeamRequest $request, User $user): JsonResponse
    {
        $validated = $request->validated();
        if (array_key_exists('role_id', $validated) && $validated['role_id']) {
            abort_unless(
                Role::whereKey($validated['role_id'])
                    ->where(fn($q) => $q->whereNull('organization_id')
                        ->orWhere('organization_id', $validated['organization_id']))
                    ->exists(),
                422,
                'The selected role is not available for this organization.'
            );
        }
        $user->update(
            collect($validated)->except(['organization_id', 'role_id'])->toArray()
        );
        if (array_key_exists('role_id', $validated)) {
            $user->organizations()->updateExistingPivot(
                $validated['organization_id'],
                ['role_id' => $validated['role_id']]
            );
        }
        return response()->json([
            'message' => 'Team member updated successfully.',
            'data' => $user->fresh()->load('organizations'),
        ]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        $organizationId = $request->validate([
            'organization_id' => ['required', 'integer', 'exists:organizations,id'],
        ])['organization_id'];
        abort_unless(
            $request->user()->organizations()->whereKey($organizationId)->exists(),
            403,
            'You do not have access to this organization.'
        );
        abort_unless(
            $user->organizations()->whereKey($organizationId)->exists(),
            404,
            'Team member not found in this organization.'
        );
        $user->organizations()->detach($organizationId);
        return response()->json([
            'message' => 'Team member removed successfully.',
        ]);
    }
}
