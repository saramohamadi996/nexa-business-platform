import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const activitySchema = z.object({
    subject: z.string().min(1, 'Subject is required'),
    description: z.string().optional(),
    type: z.string().min(1, 'Type is required'),
    subject_type: z.string().optional(),
    subject_id: z.string().optional(),
})

type ActivityFormData = z.infer<typeof activitySchema>

type ActivityFormSubmitData = {
    subject: string
    description?: string
    type: string
    subject_type?: string
    subject_id?: number
}

interface ActivityFormProps {
    onSubmit: (data: ActivityFormSubmitData) => Promise<void>
    onCancel: () => void
    isSubmitting: boolean
}

export default function ActivityForm({
                                         onSubmit,
                                         onCancel,
                                         isSubmitting,
                                     }: ActivityFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ActivityFormData>({
        resolver: zodResolver(activitySchema),
        defaultValues: {
            type: 'note',
        },
    })

    return (
        <form
            onSubmit={handleSubmit((data) =>
                onSubmit({
                    ...data,
                    subject_id: data.subject_id
                        ? Number(data.subject_id)
                        : undefined,
                }),
            )}
            className="space-y-5"
        >
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Subject
                </label>

                <input
                    {...register('subject')}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="Activity subject"
                />

                {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.subject.message}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Description
                </label>

                <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="Activity description"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Type
                </label>

                <select
                    {...register('type')}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                    <option value="note">Note</option>
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">Meeting</option>
                    <option value="created">Created</option>
                    <option value="updated">Updated</option>
                    <option value="deleted">Deleted</option>
                </select>

                {errors.type && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.type.message}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Subject Type
                </label>

                <input
                    {...register('subject_type')}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="e.g. Customer, Lead, Deal"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Subject ID
                </label>

                <input
                    type="number"
                    {...register('subject_id')}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="Optional"
                />
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                    {isSubmitting ? 'Creating...' : 'Create Activity'}
                </button>
            </div>
        </form>
    )
}