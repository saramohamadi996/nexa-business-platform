export interface Lead {
    id: number
    organization_id: number
    name: string
    company_name: string | null
    email: string | null
    phone: string | null
    source: string | null
    status: string
    notes: string | null
    created_by: number
    created_at: string
    updated_at: string
}

export interface LeadListResponse {
    data: Lead[]
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
}