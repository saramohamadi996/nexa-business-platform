import {create} from 'zustand'
import type {User} from '../types/auth'

interface AuthStore {
    user: User | null
    token: string | null
    setAuth: (user: User, token: string) => void
    clearAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: localStorage.getItem('nexa_token'),

    setAuth: (user, token) => {
       localStorage.setItem('nexa_token', token)
        set({
            user,
            token
        })
    },
    clearAuth: () => {
        localStorage.removeItem('nexa_token')

        set({
            user: null,
            token: null,
        })
    },
}))