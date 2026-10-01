<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDealRequest;
use App\Http\Requests\UpdateDealRequest;
use App\Models\Deal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Resources\DealResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DealController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $deals = Deal::whereIn(
            'organization_id',
            $request->user()->organizations()->pluck('organizations.id')
        )->latest()->get();
        return DealResource::collection($deals);
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
        return DealResource::make($deal)
            ->additional([
                'message' => 'Deal created successfully.',
            ])
            ->response()->setStatusCode(201);
    }

    public function show(Request $request, Deal $deal): JsonResponse
    {
        abort_unless(
            $request->user()->organizations()->whereKey($deal->organization_id)->exists(),
            403,
            'You do not have access to this deal.'
        );
        return DealResource::make($deal);
    }

    public function update(UpdateDealRequest $request, Deal $deal): JsonResponse
    {
        abort_unless(
            $request->user()->organizations()->whereKey($deal->organization_id)->exists(),
            403,
            'You do not have access to this deal.'
        );

        $deal->update($request->validated());
        return DealResource::make($deal->fresh())
            ->additional([
                'message' => 'Deal updated successfully.',
            ]);
    }

    public function destroy(Request $request, Deal $deal): JsonResponse
    {
        abort_unless(
            $request->user()->organizations()->whereKey($deal->organization_id)->exists(),
            403,
            'You do not have access to this deal.'
        );
        $deal->delete();
        return response()->json([
            'message' => 'Deal deleted successfully.',
        ]);
    }
}
