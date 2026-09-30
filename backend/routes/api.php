<?php

use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DealController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OrganizationController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TeamController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

Route::middleware('auth:sanctum')->group(function () {

    // Organizations
    Route::apiResource('organizations', OrganizationController::class)
        ->only(['index', 'show', 'store']);

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index']);

    // Customers
    Route::apiResource('customers', CustomerController::class)
        ->middleware([
            'index' => 'permission:customers.view',
            'show' => 'permission:customers.view',
            'store' => 'permission:customers.create',
            'update' => 'permission:customers.update',
            'destroy' => 'permission:customers.delete',
        ]);

    // Leads
    Route::apiResource('leads', LeadController::class)
        ->middleware([
            'index' => 'permission:leads.view',
            'show' => 'permission:leads.view',
            'store' => 'permission:leads.create',
            'update' => 'permission:leads.update',
        ]);

    // Deals
    Route::apiResource('deals', DealController::class)
        ->middleware([
            'index' => 'permission:deals.view',
            'show' => 'permission:deals.view',
            'store' => 'permission:deals.create',
            'update' => 'permission:deals.update',
        ]);

    // Tasks
    Route::apiResource('tasks', TaskController::class)
        ->middleware([
            'index' => 'permission:tasks.view',
            'show' => 'permission:tasks.view',
            'store' => 'permission:tasks.create',
            'update' => 'permission:tasks.update',
        ]);

    // Team
    Route::get('team', [TeamController::class, 'index'])
        ->middleware('permission:team.manage');

    Route::post('team', [TeamController::class, 'store'])
        ->middleware('permission:team.manage');

    Route::put('team/{user}', [TeamController::class, 'update'])
        ->middleware('permission:team.manage');

    Route::delete('team/{user}', [TeamController::class, 'destroy'])
        ->middleware('permission:team.manage');

    // Activities
    Route::get('activities', [ActivityController::class, 'index']);
    Route::post('activities', [ActivityController::class, 'store']);
    Route::get('activities/{activity}', [ActivityController::class, 'show']);
    Route::delete('activities/{activity}', [ActivityController::class, 'destroy']);

    // Notifications
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::post('notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy']);
});
