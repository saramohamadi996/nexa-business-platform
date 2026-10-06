import { useEffect, useState } from 'react'
import { taskApi } from '../../api/taskApi'
import type { Task } from '../../types/task'
import TaskForm from './TaskForm'

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [total, setTotal] = useState(0)
    const [lastPage, setLastPage] = useState(1)

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null)

    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        const loadTasks = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const response = await taskApi.list({
                    page,
                    search: search || undefined,
                })

                setTasks(response.data)
                setTotal(response.meta.total)
                setLastPage(response.meta.last_page)
            } catch {
                setError('Failed to load tasks.')
            } finally {
                setIsLoading(false)
            }
        }

        loadTasks()
    }, [page, search, refreshKey])

    const handleCreateTask = async (
        data: Parameters<React.ComponentProps<typeof TaskForm>['onSubmit']>[0],
    ) => {
        try {
            setIsCreating(true)
            setError(null)
            setSuccessMessage(null)

            await taskApi.create(data)

            setIsCreateOpen(false)
            setSuccessMessage('Task created successfully.')
            setRefreshKey((current) => current + 1)
            setPage(1)
        } catch {
            setError('Failed to create task.')
        } finally {
            setIsCreating(false)
        }
    }

    const handleUpdateTask = async (
        data: Parameters<React.ComponentProps<typeof TaskForm>['onSubmit']>[0],
    ) => {
        if (!editingTask) {
            return
        }

        try {
            setIsUpdating(true)
            setError(null)
            setSuccessMessage(null)

            await taskApi.update(editingTask.id, data)

            setEditingTask(null)
            setSuccessMessage('Task updated successfully.')
            setRefreshKey((current) => current + 1)
        } catch {
            setError('Failed to update task.')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDeleteTask = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return
        }

        try {
            setDeletingTaskId(id)
            setError(null)
            setSuccessMessage(null)

            await taskApi.delete(id)

            setSuccessMessage('Task deleted successfully.')
            setRefreshKey((current) => current + 1)
        } catch {
            setError('Failed to delete task.')
        } finally {
            setDeletingTaskId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Tasks
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your tasks.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    Add Task
                </button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <input
                    type="text"
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value)
                        setPage(1)
                    }}
                    placeholder="Search tasks..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">
                    {successMessage}
                </div>
            )}

            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Create Task
                            </h2>

                            <button
                                type="button"
                                onClick={() => setIsCreateOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <TaskForm
                            onSubmit={handleCreateTask}
                            onCancel={() => setIsCreateOpen(false)}
                            isSubmitting={isCreating}
                        />
                    </div>
                </div>
            )}

            {editingTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Edit Task
                            </h2>

                            <button
                                type="button"
                                onClick={() => setEditingTask(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <TaskForm
                            key={editingTask.id}
                            initialData={{
                                title: editingTask.title,
                                description: editingTask.description ?? '',
                                status: editingTask.status ?? 'pending',
                                priority: editingTask.priority ?? 'medium',
                                due_date: editingTask.due_date ?? '',
                                customer_id:
                                    editingTask.customer_id !== null
                                        ? String(editingTask.customer_id)
                                        : '',
                                lead_id:
                                    editingTask.lead_id !== null
                                        ? String(editingTask.lead_id)
                                        : '',
                                deal_id:
                                    editingTask.deal_id !== null
                                        ? String(editingTask.deal_id)
                                        : '',
                                assigned_to:
                                    editingTask.assigned_to !== null
                                        ? String(editingTask.assigned_to)
                                        : '',
                            }}
                            isEditing
                            onSubmit={handleUpdateTask}
                            onCancel={() => setEditingTask(null)}
                            isSubmitting={isUpdating}
                        />
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {isLoading ? (
                    <div className="p-6 text-sm text-gray-500">
                        Loading tasks...
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="p-6 text-sm text-gray-500">
                        No tasks found.
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Title
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Status
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Priority
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Due Date
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Assigned To
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Actions
                            </th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td className="px-5 py-4 text-sm font-medium text-gray-900">
                                    {task.title}
                                </td>

                                <td className="px-5 py-4 text-sm text-gray-600">
                                    {task.status ?? '-'}
                                </td>

                                <td className="px-5 py-4 text-sm text-gray-600">
                                    {task.priority ?? '-'}
                                </td>

                                <td className="px-5 py-4 text-sm text-gray-600">
                                    {task.due_date ?? '-'}
                                </td>

                                <td className="px-5 py-4 text-sm text-gray-600">
                                    {task.assigned_to !== null
                                        ? `#${task.assigned_to}`
                                        : '-'}
                                </td>

                                <td className="px-5 py-4 text-sm">
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEditingTask(task)
                                            }
                                            className="font-medium text-indigo-600 hover:text-indigo-800"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteTask(task.id)
                                            }
                                            disabled={
                                                deletingTaskId === task.id
                                            }
                                            className="font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                                        >
                                            {deletingTaskId === task.id
                                                ? 'Deleting...'
                                                : 'Delete'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Total: {total}
                </p>

                <div className="flex gap-2">
                    <button
                        type="button"
                        disabled={page === 1}
                        onClick={() =>
                            setPage((current) => current - 1)
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="px-3 py-2 text-sm text-gray-600">
                        Page {page} of {lastPage}
                    </span>

                    <button
                        type="button"
                        disabled={page === lastPage}
                        onClick={() =>
                            setPage((current) => current + 1)
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}