export interface TeamMember {
    id: number
    name: string
    email: string
    phone: string | null
    is_active: boolean
    organizations: {
        id: number
        name: string
        pivot: {
            role_id: number | null
            joined_at: string | null
        }
    }[]
}

export interface TeamListResponse {
    data: {
        current_page: number
        data: TeamMember[]
        last_page: number
        per_page: number
        total: number
    }
}