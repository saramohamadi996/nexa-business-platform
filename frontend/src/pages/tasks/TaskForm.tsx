import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    status: z.string().min(1, 'Status is required'),
    priority: z.string().min(1, 'Priority is required'),
    due_date: z.string().optional(),
    customer_id: z.string().optional(),
    lead_id: z.string().optional(),
    deal_id: z.string().optional(),
    assigned_to: z.string().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

type TaskFormSubmitData = {
    title: string
    description?: string
    status?: string
    priority?: string
    due_date?: string
    customer_id?: number
    lead_id?: number
    deal_id?: number
    assigned_to?: number
}

interface TaskFormProps {
    onSubmit: (data: TaskFormSubmitData) => Promise<void>
    onCancel: () => void
    isSubmitting: boolean
    initialData?: TaskFormData
    isEditing?: boolean
}

export default function TaskForm({
                                     onSubmit,
                                     onCancel,
                                     isSubmitting,
                                     initialData,
                                     isEditing = false,
                                 }: TaskFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: initialData ?? {
            status: 'pending',
            priority: 'medium',
        },
    })

    return (
        <form
            onSubmit={handleSubmit((data) =>
                onSubmit({
                    ...data,
                    customer_id: data.customer_id
                        ? Number(data.customer_id)
                        : undefined,
                    lead_id: data.lead_id
                        ? Number(data.lead_id)
                        : undefined,
                    deal_id: data.deal_id
                        ? Number(data.deal_id)
                        : undefined,
                    assigned_to: data.assigned_to
                        ? Number(data.assigned_to)
                        : undefined,
                }),
            )}
            className="space-y-5"
        >
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Title
                </label>

                <input
                    {...register('title')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                />

                {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.title.message}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Description
                </label>

                <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Status
                    </label>

                    <select
                        {...register('status')}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                    >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    {errors.status && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.status.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Priority
                    </label>

                    <select
                        {...register('priority')}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>

                    {errors.priority && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.priority.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Due Date
                </label>

                <input
                    type="date"
                    {...register('due_date')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Customer ID
                    </label>

                    <input
                        type="number"
                        {...register('customer_id')}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Lead ID
                    </label>

                    <input
                        type="number"
                        {...register('lead_id')}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Deal ID
                    </label>

                    <input
                        type="number"
                        {...register('deal_id')}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Assigned To
                    </label>

                    <input
                        type="number"
                        {...register('assigned_to')}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                    {isSubmitting
                        ? isEditing
                            ? 'Updating...'
                            : 'Creating...'
                        : isEditing
                            ? 'Update Task'
                            : 'Create Task'}
                </button>
            </div>
        </form>
    )
}