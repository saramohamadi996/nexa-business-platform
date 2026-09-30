<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TaskController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $tasks = Task::whereIn(
            'organization_id',
            $request->user()->organizations()->pluck('organizations.id')
        )
            ->latest()
            ->get();
        return TaskResource::collection($tasks);
    }

    public function store(StoreTaskRequest $request): JsonResponse
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

        $task = Task::create([
            ...$validated,
            'created_by' => $request->user()->id,
        ]);
        return TaskResource::make($task)
            ->additional([
                'message' => 'Task created successfully.',
            ])
            ->response()
            ->setStatusCode(201);
    }
    public function show(Request $request, Task $task): JsonResponse
    {
        abort_unless(
            $request->user()
                ->organizations()
                ->whereKey($task->organization_id)
                ->exists(),
            403,
            'You do not have access to this task.'
        );
        return TaskResource::make($task);
    }

    public function update(
        UpdateTaskRequest $request,
        Task $task
    ): JsonResponse {
        abort_unless(
            $request->user()
                ->organizations()
                ->whereKey($task->organization_id)
                ->exists(),
            403,
            'You do not have access to this task.'
        );

        $task->update($request->validated());
        return TaskResource::make($task->fresh())
            ->additional([
                'message' => 'Task updated successfully.',
            ]);
    }
    public function destroy(Request $request, Task $task): JsonResponse
    {
        abort_unless(
            $request->user()
                ->organizations()
                ->whereKey($task->organization_id)
                ->exists(),
            403,
            'You do not have access to this task.'
        );

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully.',
        ]);
    }
}
