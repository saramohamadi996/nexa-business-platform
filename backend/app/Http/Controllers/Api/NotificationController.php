<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'unread_count' => $user->unreadNotifications()->count(),
                'notifications' => $user->notifications()
                    ->latest()
                    ->get(),
            ],
        ]);
    }

    public function markAsRead(Request $request, string $notification): JsonResponse
    {
        $user = $request->user();

        $item = $user->notifications()
            ->whereKey($notification)
            ->firstOrFail();

        $item->markAsRead();

        return response()->json([
            'message' => 'Notification marked as read.',
            'data' => $item->fresh(),
        ]);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()
            ->unreadNotifications
            ->markAsRead();

        return response()->json([
            'message' => 'All notifications marked as read.',
        ]);
    }

    public function destroy(Request $request, string $notification): JsonResponse
    {
        $user = $request->user();

        $item = $user->notifications()
            ->whereKey($notification)
            ->firstOrFail();

        $item->delete();

        return response()->json([
            'message' => 'Notification deleted successfully.',
        ]);
    }
}
