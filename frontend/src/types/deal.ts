export interface Deal {
    id: number
    organization_id: number
    customer_id: number
    lead_id: number | null
    title: string
    description: string | null
    value: number | null
    currency: string | null
    stage: string | null
    probability: number | null
    expected_close_date: string | null
    assigned_to: number | null
    created_by: number
    won_at: string | null
    lost_at: string | null
    created_at: string
    updated_at: string
}

export interface DealListResponse {
    data: Deal[]
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
}