import { api } from './client'
import type { Lead, LeadListResponse } from '../types/lead'
interface LeadListParams {
    page?: number
    search?: string
}

export const leadApi = {
    async list(
        params?: LeadListParams,
    ): Promise<LeadListResponse> {
        const response = await api.get<LeadListResponse>(
            '/leads',
            { params },
        )

        return response.data
    },
    async create(data: {
        name: string
        company_name?: string
        email?: string
        phone?: string
        source?: string
        status: string
        notes?: string
    }): Promise<Lead> {
        const response = await api.post<{ data: Lead; message: string }>(
            '/leads',
            data,
        )

        return response.data.data
    },
    async update(
        id: number,
        data: {
            name: string
            company_name?: string
            email?: string
            phone?: string
            source?: string
            status: string
            notes?: string
        },
    ): Promise<Lead> {
        const response = await api.put<{ data: Lead; message: string }>(
            `/leads/${id}`,
            data,
        )

        return response.data.data
    },
    async delete(id: number): Promise<void> {
        await api.delete(`/leads/${id}`)
    },
}