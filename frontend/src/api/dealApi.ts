import { api } from './client'
import type { Deal, DealListResponse } from '../types/deal'

interface DealListParams {
    page?: number
    search?: string
}

export const dealApi = {
    async list(
        params?: DealListParams,
    ): Promise<DealListResponse> {
        const response = await api.get<DealListResponse>(
            '/deals',
            { params },
        )

        return response.data
    },

    async create(data: {
        customer_id: number
        lead_id?: number
        title: string
        description?: string
        value?: number
        currency?: string
        stage?: string
        probability?: number
        expected_close_date?: string
        assigned_to?: number
    }): Promise<Deal> {
        const response = await api.post<{ data: Deal; message: string }>(
            '/deals',
            data,
        )

        return response.data.data
    },

    async update(
        id: number,
        data: {
            customer_id: number
            lead_id?: number
            title: string
            description?: string
            value?: number
            currency?: string
            stage?: string
            probability?: number
            expected_close_date?: string
            assigned_to?: number
        },
    ): Promise<Deal> {
        const response = await api.put<{ data: Deal; message: string }>(
            `/deals/${id}`,
            data,
        )

        return response.data.data
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/deals/${id}`)
    },
}