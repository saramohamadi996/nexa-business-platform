import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

const data = [
    { month: 'Jan', sales: 12000 },
    { month: 'Feb', sales: 18000 },
    { month: 'Mar', sales: 15000 },
    { month: 'Apr', sales: 24000 },
    { month: 'May', sales: 22000 },
    { month: 'Jun', sales: 32000 },
    { month: 'Jul', sales: 28500 },
    { month: 'Aug', sales: 38000 },
    { month: 'Sep', sales: 42580 },
]

export default function SalesOverview() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-semibold text-slate-900">
                        Sales Overview
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                        Monthly sales performance
                    </p>
                </div>

                <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                >
                    Last 9 months
                </button>
            </div>

            <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 5,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient
                                id="salesGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#4f46e5"
                                    stopOpacity={0.2}
                                />

                                <stop
                                    offset="100%"
                                    stopColor="#4f46e5"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e2e8f0"
                        />

                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: '#94a3b8',
                                fontSize: 12,
                            }}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: '#94a3b8',
                                fontSize: 12,
                            }}
                            tickFormatter={(value) =>
                                `$${value / 1000}k`
                            }
                        />

                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                boxShadow:
                                    '0 4px 12px rgba(15, 23, 42, 0.08)',
                            }}
                            formatter={(value) => [
                                `$${Number(value).toLocaleString()}`,
                                'Sales',
                            ]}
                        />

                        <Area
                            type="monotone"
                            dataKey="sales"
                            stroke="#4f46e5"
                            strokeWidth={2}
                            fill="url(#salesGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}