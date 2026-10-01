<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\StoreActivityRequest;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ActivityController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $organizationId = $request->validate([
            'organization_id' => ['required', 'integer', 'exists:organizations,id'],
        ])['organization_id'];
        abort_unless(
            $request->user()->organizations()->whereKey($organizationId)->exists(),
            403,
            'You do not have access to this organization.'
        );
        $activities = Activity::where('organization_id', $organizationId)->with('user')->latest()->get();
        return ActivityResource::collection($activities);
    }

    public function store(StoreActivityRequest $request): JsonResponse
    {
        $activity = Activity::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);
        return ActivityResource::make($activity->load('user'))
            ->additional(['message' => 'Activity created successfully.'])
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, Activity $activity): JsonResponse
    {
        abort_unless(
            $request->user()->organizations()->whereKey($activity->organization_id)->exists(),
            403,
            'You do not have access to this activity.'
        );
        return ActivityResource::make($activity->load('user'));
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
