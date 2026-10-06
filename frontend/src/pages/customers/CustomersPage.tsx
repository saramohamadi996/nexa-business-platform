import {useEffect, useState} from 'react'
import {customerApi} from '../../api/customerApi'
import type {Customer} from '../../types/customer'
import CustomerForm from './CustomerForm'

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [total, setTotal] = useState(0)
    const [lastPage, setLastPage] = useState(1)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const response = await customerApi.list({
                    page,
                    search: search || undefined,
                })

                setCustomers(response.data)
                setTotal(response.meta.total)
                setLastPage(response.meta.last_page)
            } catch {
                setError('Failed to load customers.')
            } finally {
                setIsLoading(false)
            }
        }

        loadCustomers()
    }, [page, search])
    const handleCreateCustomer = async (
        data: Parameters<React.ComponentProps<typeof CustomerForm>['onSubmit']>[0],
    ) => {
        try {
            setIsCreating(true)
            setError(null)

            await customerApi.create(data)

            setIsCreateOpen(false)
            setPage(1)
        } catch {
            setError('Failed to create customer.')
        } finally {
            setIsCreating(false)
        }
    }
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Customers
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage your customers and their information.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                    + Add Customer
                </button>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                {isLoading && (
                    <div className="p-6 text-sm text-slate-500">
                        Loading customers...
                    </div>
                )}

                {error && (
                    <div className="p-6 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {!isLoading && !error && (
                    <div className="overflow-x-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 p-5">
                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    Customers
                                </h3>
                                <p className="mt-1 text-xs text-slate-400">
                                    {total} total customers
                                </p>
                            </div>

                            <input
                                type="text"
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value)
                                    setPage(1)
                                }}
                                placeholder="Search customers..."
                                className="w-64 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                        {editingCustomer && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Edit Customer
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Update customer information.
                                    </p>
                                </div>

                                <CustomerForm
                                    initialData={{
                                        name: editingCustomer.name,
                                        company_name: editingCustomer.company_name ?? '',
                                        email: editingCustomer.email ?? '',
                                        phone: editingCustomer.phone ?? '',
                                        website: editingCustomer.website ?? '',
                                        industry: editingCustomer.industry ?? '',
                                        status: editingCustomer.status,
                                        source: editingCustomer.source ?? '',
                                        notes: editingCustomer.notes ?? '',
                                    }}
                                    mode="edit"
                                    onSubmit={async (data) => {
                                        if (!editingCustomer) {
                                            return
                                        }

                                        try {
                                            setIsUpdating(true)

                                            await customerApi.update(editingCustomer.id, data)

                                            setEditingCustomer(null)

                                            const response = await customerApi.list({
                                                page,
                                                search: search || undefined,
                                            })

                                            setCustomers(response.data)
                                            setTotal(response.meta.total)
                                            setLastPage(response.meta.last_page)
                                        } finally {
                                            setIsUpdating(false)
                                        }
                                    }}
                                    onCancel={() => setEditingCustomer(null)}
                                    isSubmitting={isUpdating}
                                />
                            </div>
                        )}
                        {isCreateOpen && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Add Customer
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Create a new customer.
                                    </p>
                                </div>

                                <CustomerForm
                                    onSubmit={handleCreateCustomer}
                                    onCancel={() => setIsCreateOpen(false)}
                                    isSubmitting={isCreating}
                                />
                            </div>
                        )}
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-200 bg-slate-50">
                            <tr>
                                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Customer
                                </th>
                                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Company
                                </th>
                                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Email
                                </th>
                                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Phone
                                </th>
                                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Status
                                </th>
                                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Actions
                                </th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                            {customers.map((customer) => (
                                <tr
                                    key={customer.id}
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="px-5 py-4">
                                        <p className="text-sm font-semibold text-slate-800">
                                            {customer.name}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-slate-600">
                                        {customer.company_name ?? '—'}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-slate-600">
                                        {customer.email ?? '—'}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-slate-600">
                                        {customer.phone ?? '—'}
                                    </td>

                                    <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    customer.status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-600'
                                                        : 'bg-slate-100 text-slate-600'
                                                }`}
                                            >
                                                {customer.status}
                                            </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setEditingCustomer(customer)}
                                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    if (!window.confirm(`Delete ${customer.name}?`)) {
                                                        return
                                                    }

                                                    await customerApi.delete(customer.id)

                                                    setCustomers((current) =>
                                                        current.filter((item) => item.id !== customer.id),
                                                    )

                                                    setTotal((current) => current - 1)
                                                }}
                                                className="text-sm font-medium text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
                            <p className="text-sm text-slate-500">
                                Page {page} of {lastPage}
                            </p>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={page === 1}
                                    onClick={() => setPage((value) => value - 1)}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>

                                <button
                                    type="button"
                                    disabled={page === lastPage}
                                    onClick={() => setPage((value) => value + 1)}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                        {customers.length === 0 && (
                            <div className="p-8 text-center text-sm text-slate-500">
                                No customers found.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}