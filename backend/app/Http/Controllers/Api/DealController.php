<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Deal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DealController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $deals = Deal::whereIn(
            'organization_id',
            $request->user()->organizations()->pluck('organizations.id')
        )
            ->latest()
            ->get();

        return response()->json([
            'data' => $deals,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'organization_id' => ['required', 'integer', 'exists:organizations,id'],
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'lead_id' => ['nullable', 'integer', 'exists:leads,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'value' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'stage' => ['nullable', 'string', 'max:30'],
            'probability' => ['nullable', 'integer', 'min:0', 'max:100'],
            'expected_close_date' => ['nullable', 'date'],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
        ]);

        abort_unless(
            $request->user()
                ->organizations()
                ->whereKey($validated['organization_id'])
                ->exists(),
            403,
            'You do not have access to this organization.'
        );

        $deal = Deal::create([
            ...$validated,
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Deal created successfully.',
            'data' => $deal,
        ], 201);
    }

    public function show(Request $request, Deal $deal): JsonResponse
    {
        abort_unless(
            $request->user()
                ->organizations()
                ->whereKey($deal->organization_id)
                ->exists(),
            403,
            'You do not have access to this deal.'
        );

        return response()->json([
            'data' => $deal,
        ]);
    }

    public function update(Request $request, Deal $deal): JsonResponse
    {
        abort_unless(
            $request->user()
                ->organizations()
                ->whereKey($deal->organization_id)
                ->exists(),
            403,
            'You do not have access to this deal.'
        );

        $validated = $request->validate([
            'customer_id' => ['sometimes', 'required', 'integer', 'exists:customers,id'],
            'lead_id' => ['nullable', 'integer', 'exists:leads,id'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'value' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'stage' => ['nullable', 'string', 'max:30'],
            'probability' => ['nullable', 'integer', 'min:0', 'max:100'],
            'expected_close_date' => ['nullable', 'date'],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
        ]);

        $deal->update($validated);

        return response()->json([
            'message' => 'Deal updated successfully.',
            'data' => $deal->fresh(),
        ]);
    }

    public function destroy(Request $request, Deal $deal): JsonResponse
    {
        abort_unless(
            $request->user()
                ->organizations()
                ->whereKey($deal->organization_id)
                ->exists(),
            403,
            'You do not have access to this deal.'
        );

        $deal->delete();

        return response()->json([
            'message' => 'Deal deleted successfully.',
        ]);
    }
}
