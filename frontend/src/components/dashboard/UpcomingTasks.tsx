const tasks = [
    {
        title: 'Follow up with Acme Corporation',
        due: 'Today, 10:30 AM',
        priority: 'High',
    },
    {
        title: 'Prepare proposal for Tech Solutions',
        due: 'Today, 2:00 PM',
        priority: 'Medium',
    },
    {
        title: 'Schedule product demonstration',
        due: 'Tomorrow, 11:00 AM',
        priority: 'Medium',
    },
    {
        title: 'Review customer requirements',
        due: 'Tomorrow, 3:30 PM',
        priority: 'Low',
    },
]

const priorityStyles = {
    High: 'bg-red-50 text-red-600',
    Medium: 'bg-amber-50 text-amber-600',
    Low: 'bg-slate-100 text-slate-600',
}

export default function UpcomingTasks() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                    <h3 className="font-semibold text-slate-900">
                        Upcoming Tasks
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                        Tasks that need your attention
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
                {tasks.map((task) => (
                    <div
                        key={task.title}
                        className="flex items-center gap-4 px-5 py-4"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-semibold text-indigo-600">
                            ✓
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-800">
                                {task.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                {task.due}
                            </p>
                        </div>

                        <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[task.priority as keyof typeof priorityStyles]}`}
                        >
                            {task.priority}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}