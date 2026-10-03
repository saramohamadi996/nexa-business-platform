import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from '../components/layout/DashboardLayout'
import StatCard from '../components/ui/StatCard'
import RecentLeads from '../components/dashboard/RecentLeads'
import RecentDeals from '../components/dashboard/RecentDeals'
import SalesOverview from '../components/dashboard/SalesOverview'
import UpcomingTasks from '../components/dashboard/UpcomingTasks'
import CustomersPage from '../pages/customers/CustomersPage'

function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Dashboard
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Here is what is happening with your business today.
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Customers"
                    value="1,248"
                    change="+12.5%"
                    changeType="positive"
                    icon="◉"
                />

                <StatCard
                    title="Leads"
                    value="86"
                    change="+8.2%"
                    changeType="positive"
                    icon="◎"
                />

                <StatCard
                    title="Deals"
                    value="$42,580"
                    change="+18.4%"
                    changeType="positive"
                    icon="◇"
                />

                <StatCard
                    title="Tasks"
                    value="24"
                    change="6 pending"
                    changeType="neutral"
                    icon="✓"
                />
            </div>
            <SalesOverview />

            <div className="grid gap-5 xl:grid-cols-2">
                <RecentLeads />
                <UpcomingTasks />
            </div>

            <RecentDeals />

        </div>
    )
}

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/customers" element={<CustomersPage />} />
                    </Route>
                </Route>

                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />
            </Routes>
        </BrowserRouter>
    )
}