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

    public function store(StoreDealRequest $request): JsonResponse
    {
        $validated = $request->validated();

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

    public function update(
        UpdateDealRequest $request,
        Deal $deal
    ): JsonResponse {
        abort_unless(
            $request->user()
                ->organizations()
                ->whereKey($deal->organization_id)
                ->exists(),
            403,
            'You do not have access to this deal.'
        );

        $deal->update($request->validated());

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
