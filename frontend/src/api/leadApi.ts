import { api } from './client'
import type { LeadListResponse } from '../types/lead'
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
}