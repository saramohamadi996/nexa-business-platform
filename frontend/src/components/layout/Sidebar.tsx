import { NavLink } from 'react-router-dom'

const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: '▦' },
    { name: 'Customers', path: '/customers', icon: '◉' },
    { name: 'Leads', path: '/leads', icon: '◎' },
    { name: 'Deals', path: '/deals', icon: '◇' },
    { name: 'Tasks', path: '/tasks', icon: '✓' },
    { name: 'Team', path: '/team', icon: '◌' },
]

export default function Sidebar() {
    return (
        <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-slate-200 px-6">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
                        N
                    </div>

                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-slate-900">
                            Nexa
                        </h1>

                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                            Business Platform
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6">
                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Workspace
                </p>

                <div className="space-y-1">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${
                                            isActive
                                                ? 'bg-indigo-100 text-indigo-600'
                                                : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                                        }`}
                                    >
                                        {item.icon}
                                    </span>

                                    <span>{item.name}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* Bottom */}
            <div className="border-t border-slate-200 p-4">
                <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-700">
                        Nexa Portfolio
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                        Business Management Platform
                    </p>
                </div>
            </div>
        </aside>
    )
}