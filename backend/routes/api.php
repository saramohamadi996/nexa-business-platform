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
    Route::apiResource('organizations', OrganizationController::class)
        ->only(['index', 'show', 'store']);
    Route::get('dashboard', [DashboardController::class, 'index']);
    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('leads', LeadController::class);
    Route::apiResource('deals', DealController::class);
    Route::apiResource('tasks', TaskController::class);
    Route::get('team', [TeamController::class, 'index']);
    Route::post('team', [TeamController::class, 'store']);
    Route::put('team/{user}', [TeamController::class, 'update']);
    Route::delete('team/{user}', [TeamController::class, 'destroy']);
    Route::get('activities', [ActivityController::class, 'index']);
    Route::post('activities', [ActivityController::class, 'store']);
    Route::get('activities/{activity}', [ActivityController::class, 'show']);
    Route::delete('activities/{activity}', [ActivityController::class, 'destroy']);
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::post('notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy']);
});
