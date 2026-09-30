<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganizationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $organizations = $request->user()
            ->organizations()
            ->withPivot('role_id', 'joined_at')
            ->get();

        return response()->json([
            'data' => $organizations,
        ]);
    }

    public function show(Request $request, Organization $organization): JsonResponse
    {
        $organization->load([
            'users',
            'roles',
        ]);

        return response()->json([
            'data' => $organization,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:organizations,slug'],
            'logo' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'industry' => ['nullable', 'string', 'max:100'],
            'timezone' => ['nullable', 'string', 'max:100'],
            'currency' => ['nullable', 'string', 'max:10'],
        ]);

        $organization = Organization::create([
            ...$validated,
            'timezone' => $validated['timezone'] ?? 'UTC',
            'currency' => $validated['currency'] ?? 'USD',
        ]);

        return response()->json([
            'message' => 'Organization created successfully.',
            'data' => $organization,
        ], 201);
    }
}
