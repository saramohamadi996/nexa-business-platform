import { useEffect, useState } from 'react'
import { notificationApi } from '../../api/notificationApi'
import type { Notification } from '../../types/notification'

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [refreshKey, setRefreshKey] = useState(0)

    const loadNotifications = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await notificationApi.list()

            setNotifications(response.data.notifications)
            setUnreadCount(response.data.unread_count)
        } catch {
            setError('Failed to load notifications.')
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        const load = async () => {
            await loadNotifications()
        }

        void load()
    }, [refreshKey])

    const handleMarkAsRead = async (id: string) => {
        try {
            setError('')
            setSuccess('')

            await notificationApi.markAsRead(id)

            setSuccess('Notification marked as read.')
            setRefreshKey((value) => value + 1)
        } catch {
            setError('Failed to mark notification as read.')
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            setError('')
            setSuccess('')

            await notificationApi.markAllAsRead()

            setSuccess('All notifications marked as read.')
            setRefreshKey((value) => value + 1)
        } catch {
            setError('Failed to mark notifications as read.')
        }
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this notification?')) {
            return
        }

        try {
            setError('')
            setSuccess('')

            await notificationApi.delete(id)

            setSuccess('Notification deleted successfully.')
            setRefreshKey((value) => value + 1)
        } catch {
            setError('Failed to delete notification.')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Notifications
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View and manage your notifications.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                        {unreadCount} unread
                    </span>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>
            </div>

            {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                </div>
            )}

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="rounded-xl bg-white shadow-sm">
                {loading ? (
                    <div className="p-8 text-center text-sm text-gray-500">
                        Loading notifications...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-500">
                        No notifications found.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`flex items-center justify-between gap-4 p-6 ${
                                    notification.read_at
                                        ? 'bg-white'
                                        : 'bg-gray-50'
                                }`}
                            >
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">
                                            {notification.type}
                                        </span>

                                        {!notification.read_at && (
                                            <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs text-white">
                                                Unread
                                            </span>
                                        )}
                                    </div>

                               <div className="mt-2">
    {(() => {
        try {
            const data = JSON.parse(notification.data)

            return (
                <>
                    {data.title && (
                        <p className="font-medium text-gray-800">
                            {data.title}
                        </p>
                    )}

                    {data.message && (
                        <p className="mt-1 text-sm text-gray-600">
                            {data.message}
                        </p>
                    )}
                </>
            )
        } catch {
            return (
                <p className="text-sm text-gray-600">
                    {notification.data}
                </p>
            )
        }
    })()}
</div>

                                    <p className="mt-2 text-xs text-gray-400">
                                        {new Date(
                                            notification.created_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    {!notification.read_at && (
                                        <button
                                            onClick={() =>
                                                handleMarkAsRead(notification.id)
                                            }
                                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            Mark as read
                                        </button>
                                    )}

                                    <button
                                        onClick={() =>
                                            handleDelete(notification.id)
                                        }
                                        className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}