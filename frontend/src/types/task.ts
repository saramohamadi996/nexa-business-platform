export interface Task {
    id: number
    organization_id: number
    title: string
    description: string | null
    status: string | null
    priority: string | null
    due_date: string | null
    customer_id: number | null
    lead_id: number | null
    deal_id: number | null
    assigned_to: number | null
    created_by: number
    created_at: string
    updated_at: string
}

export interface TaskListResponse {
    data: Task[]
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
}