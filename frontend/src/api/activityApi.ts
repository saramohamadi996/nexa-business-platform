import { api } from './client'
import type { ActivityListResponse, Activity } from '../types/activity'

interface ActivityListParams {
    page?: number
}

export const activityApi = {
    async list(
        params?: ActivityListParams,
    ): Promise<ActivityListResponse> {
        const response = await api.get<ActivityListResponse>(
            '/activities',
            {
                params,
            },
        )

        return response.data
    },

    async create(data: {
        subject: string
        description?: string
        type: string
        subject_type?: string
        subject_id?: number
        metadata?: Record<string, unknown>
    }): Promise<Activity> {
        const response = await api.post<{ data: Activity; message: string }>(
            '/activities',
            data,
        )

        return response.data.data
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/activities/${id}`)
    },
}