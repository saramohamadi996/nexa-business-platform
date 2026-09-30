<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Customer;
use App\Models\Deal;
use App\Models\Lead;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $organizationId = $request->validate([
            'organization_id' => ['required', 'integer', 'exists:organizations,id'],
        ])['organization_id'];

        abort_unless(
            $request->user()
                ->organizations()
                ->whereKey($organizationId)
                ->exists(),
            403,
            'You do not have access to this organization.'
        );

        $customers = Customer::where('organization_id', $organizationId);
        $leads = Lead::where('organization_id', $organizationId);
        $deals = Deal::where('organization_id', $organizationId);
        $tasks = Task::where('organization_id', $organizationId);
        $activities = Activity::where('organization_id', $organizationId);

        return response()->json([
            'data' => [
                'customers' => [
                    'total' => (clone $customers)->count(),
                    'active' => (clone $customers)
                        ->where('status', 'active')
                        ->count(),
                ],

                'leads' => [
                    'total' => (clone $leads)->count(),
                    'by_status' => (clone $leads)
                        ->selectRaw('status, COUNT(*) as count')
                        ->groupBy('status')
                        ->pluck('count', 'status'),
                ],

                'deals' => [
                    'total' => (clone $deals)->count(),
                    'total_value' => (clone $deals)->sum('value'),
                    'by_stage' => (clone $deals)
                        ->selectRaw('stage, COUNT(*) as count')
                        ->groupBy('stage')
                        ->pluck('count', 'stage'),
                ],

                'tasks' => [
                    'total' => (clone $tasks)->count(),
                    'by_status' => (clone $tasks)
                        ->selectRaw('status, COUNT(*) as count')
                        ->groupBy('status')
                        ->pluck('count', 'status'),
                ],

                'recent_activities' => (clone $activities)
                    ->with('user')
                    ->latest()
                    ->limit(5)
                    ->get(),
            ],
        ]);
    }
}
