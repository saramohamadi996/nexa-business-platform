<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
class TaskController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tasks = Task::whereIn(
            'organization_id',
            $request->user()->organizations()->pluck('organizations.id')
        )
            ->latest()
            ->get();

        return response()->json([
            'data' => $tasks,
        ]);
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

        return response()->json([
            'message' => 'Task created successfully.',
            'data' => $task,
        ], 201);
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

        return response()->json([
            'data' => $task,
        ]);
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

        return response()->json([
            'message' => 'Task updated successfully.',
            'data' => $task->fresh(),
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
