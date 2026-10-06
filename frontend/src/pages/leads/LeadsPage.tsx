import { useEffect, useState } from 'react'
import { leadApi } from '../../api/leadApi'
import type { Lead } from '../../types/lead'

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [total, setTotal] = useState(0)
    const [lastPage, setLastPage] = useState(1)

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
    }, [page, search])

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