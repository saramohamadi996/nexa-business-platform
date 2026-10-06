import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const customerSchema = z.object({
    name: z.string().min(2, 'Name is required.'),
    company_name: z.string().optional(),
    email: z.string().email('Invalid email.').optional().or(z.literal('')),
    phone: z.string().optional(),
    website: z.string().optional(),
    industry: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    source: z.string().optional(),
    notes: z.string().optional(),
})

type CustomerFormData = z.infer<typeof customerSchema>

interface CustomerFormProps {
    onSubmit: (data: CustomerFormData) => Promise<void>
    onCancel: () => void
    isSubmitting: boolean
    initialData?: CustomerFormData
    mode?: 'create' | 'edit'
}
export default function CustomerForm({
                                         onSubmit,
                                         onCancel,
                                         isSubmitting,
                                         initialData,
                                         mode = 'create',
                                     }: CustomerFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
        defaultValues: initialData ?? {
            status: 'active',
        },
    })

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Name
                    </label>
                    <input
                        {...register('name')}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                    {errors.name && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Company
                    </label>
                    <input
                        {...register('company_name')}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Email
                    </label>
                    <input
                        type="email"
                        {...register('email')}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Phone
                    </label>
                    <input
                        {...register('phone')}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Website
                    </label>
                    <input
                        {...register('website')}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Industry
                    </label>
                    <input
                        {...register('industry')}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Status
                    </label>
                    <select
                        {...register('status')}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Source
                    </label>
                    <input
                        {...register('source')}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-slate-700">
                    Notes
                </label>
                <textarea
                    {...register('notes')}
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isSubmitting
                        ? mode === 'edit'
                            ? 'Updating...'
                            : 'Creating...'
                        : mode === 'edit'
                            ? 'Update Customer'
                            : 'Create Customer'}
                </button>
            </div>
        </form>
    )
}