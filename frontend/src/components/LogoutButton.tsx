import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../stores/authStore'

export default function LogoutButton() {
    const navigate = useNavigate()

    const clearAuth = useAuthStore((state) => state.clearAuth)

    const handleLogout = async () => {
        try {
            await authApi.logout()
        } catch {
            // Even if the API request fails, clear local authentication.
        } finally {
            clearAuth()
            navigate('/login', { replace: true })
        }
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-gray-600 hover:text-red-600"
        >
            Logout
        </button>
    )
}