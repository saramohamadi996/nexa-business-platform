<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ActivityController extends Controller
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

        $activities = Activity::where('organization_id', $organizationId)
            ->with('user')
            ->latest()
            ->get();

        return response()->json([
            'data' => $activities,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'organization_id' => ['required', 'integer', 'exists:organizations,id'],
            'subject' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => [
                'required',
                'string',
                Rule::in([
                    'created',
                    'updated',
                    'deleted',
                    'note',
                    'call',
                    'email',
                    'meeting',
                ]),
            ],
            'subject_type' => ['nullable', 'string', 'max:255'],
            'subject_id' => ['nullable', 'integer'],
            'metadata' => ['nullable', 'array'],
        ]);

        abort_unless(
            $request->user()->organizations()->whereKey($validated['organization_id'])->exists(),
            403,
            'You do not have access to this organization.'
        );

        $activity = Activity::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Activity created successfully.',
            'data' => $activity->load('user'),
        ], 201);
    }

    public function show(Request $request, Activity $activity): JsonResponse
    {
        abort_unless(
            $request->user()->organizations()->whereKey($activity->organization_id)->exists(),
            403,
            'You do not have access to this activity.'
        );

        return response()->json([
            'data' => $activity->load('user'),
        ]);
    }

    public function destroy(Request $request, Activity $activity): JsonResponse
    {
        abort_unless(
            $request->user()->organizations()->whereKey($activity->organization_id)->exists(),
            403,
            'You do not have access to this activity.'
        );

        $activity->delete();

        return response()->json([
            'message' => 'Activity deleted successfully.',
        ]);
    }
}
