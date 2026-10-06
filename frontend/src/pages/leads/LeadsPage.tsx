import { useEffect, useState } from 'react'
import { leadApi } from '../../api/leadApi'
import type { Lead } from '../../types/lead'
import LeadForm from './LeadForm'
export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [total, setTotal] = useState(0)
    const [lastPage, setLastPage] = useState(1)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)
    const [editingLead, setEditingLead] = useState<Lead | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [deletingLeadId, setDeletingLeadId] = useState<number | null>(null)
    useEffect(() => {
        const loadLeads = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const response = await leadApi.list({
                    page,
                    search: search || undefined,
                })

                setLeads(response.data)
                setTotal(response.meta.total)
                setLastPage(response.meta.last_page)
            } catch {
                setError('Failed to load leads.')
            } finally {
                setIsLoading(false)
            }
        }

        loadLeads()
    }, [page, search, refreshKey])
    const handleCreateLead = async (
        data: Parameters<React.ComponentProps<typeof LeadForm>['onSubmit']>[0],
    ) => {
        try {
            setIsCreating(true)
            setError(null)
            setSuccessMessage(null)

            await leadApi.create(data)

            setIsCreateOpen(false)
            setSuccessMessage('Lead created successfully.')
            setRefreshKey((current) => current + 1)
            setPage(1)
        } catch {
            setError('Failed to create lead.')
        } finally {
            setIsCreating(false)
        }
    }
    const handleUpdateLead = async (
        data: Parameters<React.ComponentProps<typeof LeadForm>['onSubmit']>[0],
    ) => {
        if (!editingLead) {
            return
        }

        try {
            setIsUpdating(true)
            setError(null)
            setSuccessMessage(null)

            await leadApi.update(editingLead.id, data)

            setEditingLead(null)
            setSuccessMessage('Lead updated successfully.')
            setRefreshKey((current) => current + 1)
        } catch {
            setError('Failed to update lead.')
        } finally {
            setIsUpdating(false)
        }
    }
    const handleDeleteLead = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) {
            return
        }

        try {
            setDeletingLeadId(id)
            setError(null)
            setSuccessMessage(null)

            await leadApi.delete(id)

            setSuccessMessage('Lead deleted successfully.')
            setRefreshKey((current) => current + 1)
        } catch {
            setError('Failed to delete lead.')
        } finally {
            setDeletingLeadId(null)
        }
    }
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Leads
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your leads.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    Add Lead
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
                    placeholder="Search leads..."
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
                                Create Lead
                            </h2>

                            <button
                                type="button"
                                onClick={() => setIsCreateOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <LeadForm
                            onSubmit={handleCreateLead}
                            onCancel={() => setIsCreateOpen(false)}
                            isSubmitting={isCreating}
                        />
                    </div>
                </div>
            )}
            {editingLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Edit Lead
                            </h2>

                            <button
                                type="button"
                                onClick={() => setEditingLead(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <LeadForm
                            key={editingLead.id}
                            initialData={{
                                name: editingLead.name,
                                company_name: editingLead.company_name ?? '',
                                email: editingLead.email ?? '',
                                phone: editingLead.phone ?? '',
                                source: editingLead.source ?? '',
                                status: editingLead.status,
                                notes: editingLead.notes ?? '',
                            }}
                            isEditing
                            onSubmit={handleUpdateLead}
                            onCancel={() => setEditingLead(null)}
                            isSubmitting={isUpdating}
                        />
                    </div>
                </div>
            )}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {isLoading ? (
                    <div className="p-6 text-sm text-gray-500">
                        Loading leads...
                    </div>
                ) : leads.length === 0 ? (
                    <div className="p-6 text-sm text-gray-500">
                        No leads found.
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Name
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Company
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Email
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Phone
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Status
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Actions
                            </th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                        {leads.map((lead) => (
                            <tr key={lead.id}>
                                <td className="px-5 py-4 text-sm font-medium text-gray-900">
                                    {lead.name}
                                </td>
                                <td className="px-5 py-4 text-sm text-gray-600">
                                    {lead.company_name || '-'}
                                </td>
                                <td className="px-5 py-4 text-sm text-gray-600">
                                    {lead.email || '-'}
                                </td>
                                <td className="px-5 py-4 text-sm text-gray-600">
                                    {lead.phone || '-'}
                                </td>
                                <td className="px-5 py-4 text-sm text-gray-600">
                                    {lead.status}
                                </td>
                                <td className="px-5 py-4 text-sm">
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setEditingLead(lead)}
                                            className="font-medium text-indigo-600 hover:text-indigo-800"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDeleteLead(lead.id)}
                                            disabled={deletingLeadId === lead.id}
                                            className="font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                                        >
                                            {deletingLeadId === lead.id ? 'Deleting...' : 'Delete'}
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
                        onClick={() => setPage((current) => current - 1)}
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
                        onClick={() => setPage((current) => current + 1)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}