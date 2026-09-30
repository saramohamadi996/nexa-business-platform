<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LeadResource;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\StoreLeadRequest;
use App\Http\Requests\UpdateLeadRequest;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LeadController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $leads = Lead::whereIn(
            'organization_id',
            $request->user()->organizations()->pluck('organizations.id')
        )
            ->latest()
            ->get();
        return LeadResource::collection($leads);
    }

    public function store(StoreLeadRequest $request): JsonResponse
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

        $lead = Lead::create([
            ...$validated,
            'created_by' => $request->user()->id,
        ]);
        return LeadResource::make($lead)
            ->additional([
                'message' => 'Lead created successfully.',
            ])
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, Lead $lead): JsonResponse
    {
        abort_unless(
            $request->user()
                ->organizations()
                ->whereKey($lead->organization_id)
                ->exists(),
            403,
            'You do not have access to this lead.'
        );
        return LeadResource::make($lead);
    }

    public function update(
        UpdateLeadRequest $request,
        Lead $lead
    ): JsonResponse {
        abort_unless(
            $request->user()
                ->organizations()
                ->whereKey($lead->organization_id)
                ->exists(),
            403,
            'You do not have access to this lead.'
        );

        $lead->update($request->validated());
        return LeadResource::make($lead->fresh())
            ->additional([
                'message' => 'Lead updated successfully.',
            ]);
    }
    public function destroy(Request $request, Lead $lead): JsonResponse
    {
        abort_unless(
            $request->user()
                ->organizations()
                ->whereKey($lead->organization_id)
                ->exists(),
            403,
            'You do not have access to this lead.'
        );

        $lead->delete();

        return response()->json([
            'message' => 'Lead deleted successfully.',
        ]);
    }
}
