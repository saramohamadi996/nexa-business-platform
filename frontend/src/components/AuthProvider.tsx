import { useEffect, useState, type ReactNode } from 'react'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../stores/authStore'

interface AuthProviderProps {
    children: ReactNode
}

export default function AuthProvider({
                                         children,
                                     }: AuthProviderProps) {
    const token = useAuthStore((state) => state.token)
    const setAuth = useAuthStore((state) => state.setAuth)
    const clearAuth = useAuthStore((state) => state.clearAuth)

    const [isLoading, setIsLoading] = useState(Boolean(token))

    useEffect(() => {
        if (!token) {
            setIsLoading(false)
            return
        }

        authApi
            .me()
            .then((response) => {
                setAuth(response.user, token)
            })
            .catch(() => {
                clearAuth()
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [token, setAuth, clearAuth])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        )
    }

    return <>{children}</>
}