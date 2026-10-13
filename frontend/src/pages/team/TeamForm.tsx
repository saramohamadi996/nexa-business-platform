import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const teamSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required').or(z.literal('')),
    password: z.string().min(8, 'Password must be at least 8 characters').or(z.literal('')),
    phone: z.string().optional(),
    role_id: z.string().min(1, 'Role is required'),
    is_active: z.boolean(),
})

type FormData = z.infer<typeof teamSchema>

interface TeamFormProps {
    mode: 'create' | 'edit'
    initialData?: Partial<FormData>
    onSubmit: (data: FormData) => Promise<void>
    onCancel: () => void
    isSubmitting: boolean
}

const roles = [
    { id: '1', name: 'Owner' },
    { id: '2', name: 'Admin' },
    { id: '3', name: 'Member' },
]

export default function TeamForm({
                                     mode,
                                     initialData,
                                     onSubmit,
                                     onCancel,
                                     isSubmitting,
                                 }: TeamFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            name: initialData?.name ?? '',
            email: initialData?.email ?? '',
            password: '',
            phone: initialData?.phone ?? '',
            role_id: initialData?.role_id ?? '3',
            is_active: initialData?.is_active ?? true,
        },
    })

    useEffect(() => {
        reset({
            name: initialData?.name ?? '',
            email: initialData?.email ?? '',
            password: '',
            phone: initialData?.phone ?? '',
            role_id: initialData?.role_id ?? '3',
            is_active: initialData?.is_active ?? true,
        })
    }, [initialData, reset])

    const submit = async (data: FormData) => {
        if (mode === 'create' && (!data.email || !data.password)) {
            return
        }

        await onSubmit(data)
    }

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="space-y-5"
        >
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Name
                </label>

                <input
                    {...register('name')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {mode === 'create' && (
                <>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>

                        <input
                            type="email"
                            {...register('email')}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Password
                        </label>

                        <input
                            type="password"
                            {...register('password')}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                </>
            )}

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone
                </label>

                <input
                    {...register('phone')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

                {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Role
                </label>

                <select
                    {...register('role_id')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>

                {errors.role_id && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.role_id.message}
                    </p>
                )}
            </div>

            {mode === 'edit' && (
                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        {...register('is_active')}
                        className="rounded border-gray-300"
                    />

                    Active
                </label>
            )}

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isSubmitting
                        ? 'Saving...'
                        : mode === 'create'
                            ? 'Create'
                            : 'Update'}
                </button>
            </div>
        </form>
    )
}