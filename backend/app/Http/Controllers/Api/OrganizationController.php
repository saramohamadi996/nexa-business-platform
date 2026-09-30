<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrganizationResource;
use App\Models\Organization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OrganizationController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $organizations = $request->user()
            ->organizations()
            ->withPivot('role_id', 'joined_at')
            ->get();
        return OrganizationResource::collection($organizations);
    }

    public function show(Request $request, Organization $organization): JsonResponse
    {
        abort_unless(
            $request->user()
                ->organizations()
                ->whereKey($organization->id)
                ->exists(),
            403,
            'You do not have access to this organization.'
        );

        $organization->load([
            'users',
            'roles',
        ]);
        return OrganizationResource::make($organization);
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
        return OrganizationResource::make($organization)
            ->additional([
                'message' => 'Organization created successfully.',
            ])
            ->response()
            ->setStatusCode(201);
    }
}
