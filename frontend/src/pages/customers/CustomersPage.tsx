import { useEffect, useState } from 'react'
import { customerApi } from '../../api/customerApi'
import type { Customer } from '../../types/customer'

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const response = await customerApi.list()

                setCustomers(response.data)
            } catch {
                setError('Failed to load customers.')
            } finally {
                setIsLoading(false)
            }
        }

        loadCustomers()
    }, [])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Customers
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Manage your customers and their information.
                </p>
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
                                        {customer.company ?? '—'}
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
                                </tr>
                            ))}
                            </tbody>
                        </table>

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