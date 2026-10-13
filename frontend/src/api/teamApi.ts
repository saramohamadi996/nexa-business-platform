import { api } from './client'
import type { TeamListResponse, TeamMember } from '../types/team'

export const teamApi = {
    async list(organizationId: number, page = 1): Promise<TeamListResponse> {
        const response = await api.get<TeamListResponse>('/team', {
            params: {
                organization_id: organizationId,
                page,
            },
        })

        return response.data
    },

    async create(data: {
        organization_id: number
        name: string
        email: string
        password: string
        phone?: string
        role_id?: number
    }): Promise<TeamMember> {
        const response = await api.post<{
            data: TeamMember
            message: string
        }>('/team', data)

        return response.data.data
    },

    async update(
        id: number,
        data: {
            organization_id: number
            name?: string
            phone?: string
            is_active?: boolean
            role_id?: number
        },
    ): Promise<TeamMember> {
        const response = await api.put<{
            data: TeamMember
            message: string
        }>(`/team/${id}`, data)

        return response.data.data
    },

    async delete(id: number, organizationId: number): Promise<void> {
        await api.delete(`/team/${id}`, {
            params: {
                organization_id: organizationId,
            },
        })
    },
}
