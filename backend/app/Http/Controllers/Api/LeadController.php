<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\StoreLeadRequest;
use App\Http\Requests\UpdateLeadRequest;
class LeadController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $leads = Lead::whereIn(
            'organization_id',
            $request->user()->organizations()->pluck('organizations.id')
        )
            ->latest()
            ->get();

        return response()->json([
            'data' => $leads,
        ]);
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

        return response()->json([
            'message' => 'Lead created successfully.',
            'data' => $lead,
        ], 201);
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

        return response()->json([
            'data' => $lead,
        ]);
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

        return response()->json([
            'message' => 'Lead updated successfully.',
            'data' => $lead->fresh(),
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
