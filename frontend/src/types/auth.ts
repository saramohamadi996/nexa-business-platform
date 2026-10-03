export interface User {
    id: number
    name: string
    email: string
    avatar: string | null
    phone: string | null
    is_active: boolean
    last_login_at: string | null
}

export interface LoginResponse {
    message: string
    token: string
    user: User
}