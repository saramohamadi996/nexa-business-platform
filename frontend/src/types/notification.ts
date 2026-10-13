export interface Notification {
    id: string
    type: string
    data: string
    read_at: string | null
    created_at: string
    updated_at: string
}

export interface NotificationListResponse {
    data: {
        unread_count: number
        notifications: Notification[]
    }
}