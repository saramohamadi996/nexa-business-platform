export interface Activity {
    id: number
    organization_id: number
    user_id: number
    subject: string
    description: string | null
    type: string
    subject_type: string | null
    subject_id: number | null
    metadata: Record<string, unknown> | null
    created_at: string
    updated_at: string
}

export interface ActivityListResponse {
    data: Activity[]
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
}