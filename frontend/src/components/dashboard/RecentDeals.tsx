const deals = [
    {
        name: 'Enterprise CRM Package',
        customer: 'Acme Corporation',
        value: '$24,500',
        status: 'Won',
    },
    {
        name: 'Business Analytics',
        customer: 'Tech Solutions',
        value: '$18,200',
        status: 'In Progress',
    },
    {
        name: 'Support Platform',
        customer: 'Global Industries',
        value: '$9,800',
        status: 'Won',
    },
]

const statusStyles = {
    Won: 'bg-emerald-50 text-emerald-600',
    'In Progress': 'bg-indigo-50 text-indigo-600',
}

export default function RecentDeals() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                    <h3 className="font-semibold text-slate-900">
                        Recent Deals
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                        Latest sales activity
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
                {deals.map((deal) => (
                    <div
                        key={deal.name}
                        className="flex items-center justify-between px-5 py-4"
                    >
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                                {deal.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                {deal.customer}
                            </p>
                        </div>

                        <div className="ml-4 flex items-center gap-4">
                            <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[deal.status as keyof typeof statusStyles]}`}
                            >
                                {deal.status}
                            </span>

                            <span className="hidden text-sm font-semibold text-slate-700 sm:block">
                                {deal.value}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}