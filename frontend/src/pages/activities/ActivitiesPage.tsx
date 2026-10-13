import { useEffect, useState } from 'react'
import { activityApi } from '../../api/activityApi'
import type { Activity } from '../../types/activity'
import ActivityForm from './ActivityForm'

export default function ActivitiesPage() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [creating, setCreating] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [success, setSuccess] = useState('')
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        const loadActivities = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await activityApi.list({ page })

                setActivities(response.data)
                setLastPage(response.meta.last_page)
                setTotal(response.meta.total)
            } catch {
                setError('Failed to load activities.')
            } finally {
                setLoading(false)
            }
        }

        void loadActivities()
    }, [page, refreshKey])

    const handleCreateActivity = async (
        data: Parameters<
            React.ComponentProps<typeof ActivityForm>['onSubmit']
        >[0],
    ) => {
        try {
            setCreating(true)
            setError('')
            setSuccess('')

            await activityApi.create(data)

            setShowCreateModal(false)
            setSuccess('Activity created successfully.')
            setPage(1)
            setRefreshKey((value) => value + 1)
        } catch {
            setError('Failed to create activity.')
        } finally {
            setCreating(false)
        }
    }

    const handleDeleteActivity = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this activity?')) {
            return
        }

        try {
            setDeletingId(id)
            setError('')
            setSuccess('')

            await activityApi.delete(id)

            setSuccess('Activity deleted successfully.')
            setRefreshKey((value) => value + 1)
        } catch {
            setError('Failed to delete activity.')
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Activities
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Track organization activities and notes.
                    </p>
                </div>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    Add Activity
                </button>
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
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-gray-50 text-gray-600">
                        <tr>
                            <th className="px-6 py-4 font-medium">
                                Subject
                            </th>
                            <th className="px-6 py-4 font-medium">
                                Type
                            </th>
                            <th className="px-6 py-4 font-medium">
                                Subject Type
                            </th>
                            <th className="px-6 py-4 font-medium">
                                Subject ID
                            </th>
                            <th className="px-6 py-4 font-medium">
                                Created
                            </th>
                            <th className="px-6 py-4 text-right font-medium">
                                Actions
                            </th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-8 text-center text-gray-500"
                                >
                                    Loading activities...
                                </td>
                            </tr>
                        ) : activities.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-8 text-center text-gray-500"
                                >
                                    No activities found.
                                </td>
                            </tr>
                        ) : (
                            activities.map((activity) => (
                                <tr key={activity.id}>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {activity.subject}
                                        </div>

                                        {activity.description && (
                                            <div className="mt-1 max-w-md truncate text-gray-500">
                                                {activity.description}
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                                {activity.type}
                                            </span>
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        {activity.subject_type || '—'}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        {activity.subject_id ?? '—'}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        {new Date(
                                            activity.created_at,
                                        ).toLocaleDateString()}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() =>
                                                handleDeleteActivity(
                                                    activity.id,
                                                )
                                            }
                                            disabled={
                                                deletingId === activity.id
                                            }
                                            className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                                        >
                                            {deletingId === activity.id
                                                ? 'Deleting...'
                                                : 'Delete'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {!loading && activities.length > 0 && (
                    <div className="flex items-center justify-between border-t px-6 py-4">
                        <p className="text-sm text-gray-500">
                            {total} activities
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    setPage((value) => Math.max(1, value - 1))
                                }
                                disabled={page === 1}
                                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
                            >
                                Previous
                            </button>

                            <span className="px-3 py-2 text-sm text-gray-600">
                                {page} / {lastPage}
                            </span>

                            <button
                                onClick={() =>
                                    setPage((value) =>
                                        Math.min(lastPage, value + 1),
                                    )
                                }
                                disabled={page === lastPage}
                                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Create Activity
                            </h2>
                        </div>

                        <ActivityForm
                            onSubmit={handleCreateActivity}
                            onCancel={() => setShowCreateModal(false)}
                            isSubmitting={creating}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}