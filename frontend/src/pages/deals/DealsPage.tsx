import { useEffect, useState } from 'react'
import { dealApi } from '../../api/dealApi'
import type { Deal } from '../../types/deal'
import DealForm from './DealForm'

export default function DealsPage() {
    const [deals, setDeals] = useState<Deal[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [total, setTotal] = useState(0)
    const [lastPage, setLastPage] = useState(1)

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [deletingDealId, setDeletingDealId] = useState<number | null>(null)

    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        const loadDeals = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const response = await dealApi.list({
                    page,
                    search: search || undefined,
                })

                setDeals(response.data)
                setTotal(response.meta.total)
                setLastPage(response.meta.last_page)
            } catch {
                setError('Failed to load deals.')
            } finally {
                setIsLoading(false)
            }
        }

        loadDeals()
    }, [page, search, refreshKey])

    const handleCreateDeal = async (
        data: Parameters<React.ComponentProps<typeof DealForm>['onSubmit']>[0],
    ) => {
        try {
            setIsCreating(true)
            setError(null)
            setSuccessMessage(null)

            await dealApi.create(data)

            setIsCreateOpen(false)
            setSuccessMessage('Deal created successfully.')
            setRefreshKey((current) => current + 1)
            setPage(1)
        } catch {
            setError('Failed to create deal.')
        } finally {
            setIsCreating(false)
        }
    }

    const handleUpdateDeal = async (
        data: Parameters<React.ComponentProps<typeof DealForm>['onSubmit']>[0],
    ) => {
        if (!editingDeal) {
            return
        }

        try {
            setIsUpdating(true)
            setError(null)
            setSuccessMessage(null)

            await dealApi.update(editingDeal.id, data)

            setEditingDeal(null)
            setSuccessMessage('Deal updated successfully.')
            setRefreshKey((current) => current + 1)
        } catch {
            setError('Failed to update deal.')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDeleteDeal = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this deal?')) {
            return
        }

        try {
            setDeletingDealId(id)
            setError(null)
            setSuccessMessage(null)

            await dealApi.delete(id)

            setSuccessMessage('Deal deleted successfully.')
            setRefreshKey((current) => current + 1)
        } catch {
            setError('Failed to delete deal.')
        } finally {
            setDeletingDealId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Deals
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your deals.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    Add Deal
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
                    placeholder="Search deals..."
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
                                Create Deal
                            </h2>

                            <button
                                type="button"
                                onClick={() => setIsCreateOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <DealForm
                            onSubmit={handleCreateDeal}
                            onCancel={() => setIsCreateOpen(false)}
                            isSubmitting={isCreating}
                        />
                    </div>
                </div>
            )}

            {editingDeal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Edit Deal
                            </h2>

                            <button
                                type="button"
                                onClick={() => setEditingDeal(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <DealForm
                            key={editingDeal.id}
                            initialData={{
                                customer_id: String(editingDeal.customer_id),
                                lead_id: editingDeal.lead_id
                                    ? String(editingDeal.lead_id)
                                    : '',
                                title: editingDeal.title,
                                description: editingDeal.description ?? '',
                                value:
                                    editingDeal.value !== null
                                        ? String(editingDeal.value)
                                        : '',
                                currency: editingDeal.currency ?? '',
                                stage: editingDeal.stage ?? 'new',
                                probability:
                                    editingDeal.probability !== null
                                        ? String(editingDeal.probability)
                                        : '',
                                expected_close_date:
                                    editingDeal.expected_close_date ?? '',
                            }}
                            isEditing
                            onSubmit={handleUpdateDeal}
                            onCancel={() => setEditingDeal(null)}
                            isSubmitting={isUpdating}
                        />
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {isLoading ? (
                    <div className="p-6 text-sm text-gray-500">
                        Loading deals...
                    </div>
                ) : deals.length === 0 ? (
                    <div className="p-6 text-sm text-gray-500">
                        No deals found.
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Title
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Customer
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Value
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Stage
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Probability
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Actions
                            </th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                        {deals.map((deal) => (
                            <tr key={deal.id}>
                                <td className="px-5 py-4 text-sm font-medium text-gray-900">
                                    {deal.title}
                                </td>

                                <td className="px-5 py-4 text-sm text-gray-600">
                                    #{deal.customer_id}
                                </td>

                                <td className="px-5 py-4 text-sm text-gray-600">
                                    {deal.value !== null
                                        ? `${deal.value} ${deal.currency ?? ''}`
                                        : '-'}
                                </td>

                                <td className="px-5 py-4 text-sm text-gray-600">
                                    {deal.stage ?? '-'}
                                </td>

                                <td className="px-5 py-4 text-sm text-gray-600">
                                    {deal.probability !== null
                                        ? `${deal.probability}%`
                                        : '-'}
                                </td>

                                <td className="px-5 py-4 text-sm">
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEditingDeal(deal)
                                            }
                                            className="font-medium text-indigo-600 hover:text-indigo-800"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteDeal(deal.id)
                                            }
                                            disabled={
                                                deletingDealId === deal.id
                                            }
                                            className="font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                                        >
                                            {deletingDealId === deal.id
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