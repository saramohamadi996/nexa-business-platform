import { api } from './client'
import type { Customer, CustomerListResponse } from '../types/customer'
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
    async create(data: {
        name: string
        company_name?: string
        email?: string
        phone?: string
        website?: string
        industry?: string
        status: 'active' | 'inactive'
        source?: string
        notes?: string
    }): Promise<Customer> {
        const response = await api.post<{ data: Customer; message: string }>(
            '/customers',
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
            website?: string
            industry?: string
            status: 'active' | 'inactive'
            source?: string
            notes?: string
        },
    ): Promise<Customer> {
        const response = await api.put<{ data: Customer; message: string }>(
            `/customers/${id}`,
            data,
        )

        return response.data.data
    },
    async delete(id: number): Promise<void> {
        await api.delete(`/customers/${id}`)
    },
}