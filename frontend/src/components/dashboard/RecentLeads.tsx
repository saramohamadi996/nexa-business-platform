const leads = [
    {
        name: 'Acme Corporation',
        contact: 'John Smith',
        status: 'New',
        value: '$8,500',
    },
    {
        name: 'Tech Solutions',
        contact: 'Sarah Johnson',
        status: 'Contacted',
        value: '$12,200',
    },
    {
        name: 'Global Industries',
        contact: 'Michael Brown',
        status: 'Qualified',
        value: '$18,750',
    },
    {
        name: 'Bright Systems',
        contact: 'Emma Wilson',
        status: 'New',
        value: '$6,400',
    },
]

const statusStyles = {
    New: 'bg-blue-50 text-blue-600',
    Contacted: 'bg-amber-50 text-amber-600',
    Qualified: 'bg-emerald-50 text-emerald-600',
}

export default function RecentLeads() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                    <h3 className="font-semibold text-slate-900">
                        Recent Leads
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                        Latest potential customers
                    </p>
                </div>

                <button
                    type="button"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                    View all
                </button>
            </div>

            <div className="divide-y divide-slate-100">
                {leads.map((lead) => (
                    <div
                        key={lead.name}
                        className="flex items-center justify-between px-5 py-4"
                    >
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                                {lead.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                {lead.contact}
                            </p>
                        </div>

                        <div className="ml-4 flex items-center gap-4">
                            <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[lead.status as keyof typeof statusStyles]}`}
                            >
                                {lead.status}
                            </span>

                            <span className="hidden text-sm font-semibold text-slate-700 sm:block">
                                {lead.value}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}