import {api} from './client'
import type {LoginResponse, User} from "../types/auth"

interface LoginCredentials{
    email:string
    password:string
}
interface MeResponse{
    user: User
}

export const authApi = {
    async login(credentials: LoginCredentials): Promise<LoginResponse>{
        const response = await api.post<LoginResponse>(
            '/auth/login',
            credentials,
        )
        return response.data
    },
    async me(): Promise<MeResponse>{
        const response = await api.get<MeResponse>('/auth/me')
        return response.data
    },
    async logout():Promise<void>{
        await api.post('/auth/logout')
    },

}