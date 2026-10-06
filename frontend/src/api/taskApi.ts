import { api } from './client'
import type { Task, TaskListResponse } from '../types/task'

interface TaskListParams {
    page?: number
    search?: string
}

export const taskApi = {
    async list(
        params?: TaskListParams,
    ): Promise<TaskListResponse> {
        const response = await api.get<TaskListResponse>(
            '/tasks',
            { params },
        )

        return response.data
    },

    async create(data: {
        title: string
        description?: string
        status?: string
        priority?: string
        due_date?: string
        customer_id?: number
        lead_id?: number
        deal_id?: number
        assigned_to?: number
    }): Promise<Task> {
        const response = await api.post<{ data: Task; message: string }>(
            '/tasks',
            data,
        )

        return response.data.data
    },

    async update(
        id: number,
        data: {
            title: string
            description?: string
            status?: string
            priority?: string
            due_date?: string
            customer_id?: number
            lead_id?: number
            deal_id?: number
            assigned_to?: number
        },
    ): Promise<Task> {
        const response = await api.put<{ data: Task; message: string }>(
            `/tasks/${id}`,
            data,
        )

        return response.data.data
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/tasks/${id}`)
    },
}