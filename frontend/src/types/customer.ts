export interface Customer {
    id: number
    organization_id: number
    name: string
    email: string | null
    phone: string | null
    company: string | null
    status: 'active' | 'inactive'
    created_at: string
    updated_at: string
}

export interface CustomerListResponse {
    data: Customer[]
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
}