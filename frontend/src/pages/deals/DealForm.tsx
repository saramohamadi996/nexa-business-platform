import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const dealSchema = z.object({
    customer_id: z.string().min(1, 'Customer is required'),
    lead_id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    value: z.string().optional(),
    currency: z.string().optional(),
    stage: z.string().min(1, 'Stage is required'),
    probability: z.string().optional(),
    expected_close_date: z.string().optional(),
})
type DealFormData = z.infer<typeof dealSchema>
type DealFormSubmitData = {
    customer_id: number
    lead_id?: number
    title: string
    description?: string
    value?: number
    currency?: string
    stage: string
    probability?: number
    expected_close_date?: string
}
interface DealFormProps {
    onSubmit: (data: DealFormSubmitData) => Promise<void>
    onCancel: () => void
    isSubmitting: boolean
    initialData?: DealFormData
    isEditing?: boolean
}

export default function DealForm({
                                     onSubmit,
                                     onCancel,
                                     isSubmitting,
                                     initialData,
                                     isEditing = false,
                                 }: DealFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DealFormData>({
        resolver: zodResolver(dealSchema),
        defaultValues: initialData ?? {
            stage: 'new',
        },
    })

    return (
        <form
            onSubmit={handleSubmit((data) =>
                onSubmit({
                    ...data,
                    customer_id: Number(data.customer_id),
                    lead_id: data.lead_id ? Number(data.lead_id) : undefined,
                    value: data.value ? Number(data.value) : undefined,
                    probability: data.probability
                        ? Number(data.probability)
                        : undefined,
                }),
            )}
            className="space-y-5"
        >
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Customer ID
                </label>

                <input
                    type="number"
                    {...register('customer_id')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                />

                {errors.customer_id && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.customer_id.message}
                    </p>
                )}
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
                        Value
                    </label>

                    <input
                        type="number"
                        step="0.01"
                        {...register('value')}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Currency
                    </label>

                    <input
                        {...register('currency')}
                        placeholder="USD"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Stage
                    </label>

                    <select
                        {...register('stage')}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                    >
                        <option value="new">New</option>
                        <option value="qualified">Qualified</option>
                        <option value="proposal">Proposal</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                    </select>

                    {errors.stage && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.stage.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Probability (%)
                    </label>

                    <input
                        type="number"
                        min="0"
                        max="100"
                        {...register('probability')}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Expected Close Date
                </label>

                <input
                    type="date"
                    {...register('expected_close_date')}
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
                        ? isEditing
                            ? 'Updating...'
                            : 'Creating...'
                        : isEditing
                            ? 'Update Deal'
                            : 'Create Deal'}
                </button>
            </div>
        </form>
    )
}