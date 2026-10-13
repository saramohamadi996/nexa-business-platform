import { api } from './client'
import type { NotificationListResponse, Notification } from '../types/notification'

export const notificationApi = {
    async list(page = 1): Promise<NotificationListResponse> {
        const response = await api.get<NotificationListResponse>(
            '/notifications',
            { params: { page } },
        )

        return response.data
    },

    async markAsRead(id: string): Promise<Notification> {
        const response = await api.post<{
            data: Notification
            message: string
        }>(`/notifications/${id}/read`)

        return response.data.data
    },

    async markAllAsRead(): Promise<void> {
        await api.post('/notifications/read-all')
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/notifications/${id}`)
    },
}