import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import LogoutButton from '../LogoutButton'

export default function Header() {
    const user = useAuthStore((state) => state.user)
    const [isOpen, setIsOpen] = useState(false)

    const initials =
        user?.name
            ?.split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() ?? 'U'

    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
            {/* Page title */}
            <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Workspace
                </p>

                <h2 className="text-lg font-semibold text-slate-900">
                    Dashboard
                </h2>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Notification */}
                <button
                    type="button"
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Notifications"
                >
                    <span className="text-lg">🔔</span>

                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
                </button>

                <div className="h-8 w-px bg-slate-200" />

                {/* User menu */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen((value) => !value)}
                        className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                            {initials}
                        </div>

                        <div className="hidden text-left sm:block">
                            <p className="text-sm font-semibold text-slate-900">
                                {user?.name}
                            </p>

                            <p className="text-xs text-slate-400">
                                {user?.email}
                            </p>
                        </div>

                        <span className="text-xs text-slate-400">
                            ▾
                        </span>
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                            <div className="border-b border-slate-100 px-3 py-2">
                                <p className="text-xs font-medium text-slate-400">
                                    Signed in as
                                </p>

                                <p className="mt-1 truncate text-sm font-medium text-slate-700">
                                    {user?.email}
                                </p>
                            </div>

                            <div className="pt-2">
                                <LogoutButton />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}