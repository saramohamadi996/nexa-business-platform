import { api } from './client'
import type { CustomerListResponse } from '../types/customer'

interface CustomerListParams {
    page?: number
    search?: string
}

export const customerApi = {
    async list(
        params?: CustomerListParams,
    ): Promise<CustomerListResponse> {
        const response = await api.get<CustomerListResponse>(
            '/customers',
            {
                params,
            },
        )

        return response.data
    },
}