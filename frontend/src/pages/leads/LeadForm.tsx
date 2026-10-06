import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const leadSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    company_name: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().optional(),
    source: z.string().optional(),
    status: z.string().min(1, 'Status is required'),
    notes: z.string().optional(),
})

type LeadFormData = z.infer<typeof leadSchema>

interface LeadFormProps {
    onSubmit: (data: LeadFormData) => Promise<void>
    onCancel: () => void
    isSubmitting: boolean
    initialData?: LeadFormData
    isEditing?: boolean
}

export default function LeadForm({
                                     onSubmit,
                                     onCancel,
                                     isSubmitting,
                                     initialData,
                                     isEditing = false,
                                 }: LeadFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LeadFormData>({
        resolver: zodResolver(leadSchema),
        defaultValues: initialData ?? {
            status: 'new',
        },
    })
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Name
                </label>
                <input
                    {...register('name')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Company
                </label>
                <input
                    {...register('company_name')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    {...register('email')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone
                </label>
                <input
                    {...register('phone')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Source
                </label>
                <input
                    {...register('source')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Status
                </label>
                <select
                    {...register('status')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="lost">Lost</option>
                </select>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Notes
                </label>
                <textarea
                    {...register('notes')}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                />
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
                    ? isEditing ? 'Updating...' : 'Creating...'
                    : isEditing ? 'Update Lead' : 'Create Lead'}
                </button>
            </div>
        </form>
    )
}