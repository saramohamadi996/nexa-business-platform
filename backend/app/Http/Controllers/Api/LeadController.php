<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'organization_id' => ['required', 'integer', 'exists:organizations,id'],
            'name' => ['required', 'string', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'source' => ['nullable', 'string', 'max:50'],
            'status' => ['nullable', 'string', 'max:30'],
            'priority' => ['nullable', 'string', 'max:30'],
            'estimated_value' => ['nullable', 'numeric', 'min:0'],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
            'converted_customer_id' => ['nullable', 'integer', 'exists:customers,id'],
            'notes' => ['nullable', 'string'],
        ]);

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

    public function update(Request $request, Lead $lead): JsonResponse
    {
        abort_unless(
            $request->user()
                ->organizations()
                ->whereKey($lead->organization_id)
                ->exists(),
            403,
            'You do not have access to this lead.'
        );

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'source' => ['nullable', 'string', 'max:50'],
            'status' => ['nullable', 'string', 'max:30'],
            'priority' => ['nullable', 'string', 'max:30'],
            'estimated_value' => ['nullable', 'numeric', 'min:0'],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
            'converted_customer_id' => ['nullable', 'integer', 'exists:customers,id'],
            'notes' => ['nullable', 'string'],
        ]);

        $lead->update($validated);

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
