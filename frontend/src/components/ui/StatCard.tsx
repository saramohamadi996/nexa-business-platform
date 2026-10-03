interface StatCardProps {
    title: string
    value: string
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
    icon: string
}

export default function StatCard({
                                     title,
                                     value,
                                     change,
                                     changeType,
                                     icon,
                                 }: StatCardProps) {
    const changeStyles = {
        positive: 'bg-emerald-50 text-emerald-600',
        negative: 'bg-red-50 text-red-600',
        neutral: 'bg-slate-100 text-slate-600',
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                        {value}
                    </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600">
                    {icon}
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
                <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${changeStyles[changeType]}`}
                >
                    {change}
                </span>

                <span className="text-xs text-slate-400">
                    vs last month
                </span>
            </div>
        </div>
    )
}