import { api } from './client'

export interface Organization {
    id: number
    name: string
    slug: string
}

interface OrganizationListResponse {
    data: Organization[]
}

export const organizationApi = {
    async list(): Promise<Organization[]> {
        const response = await api.get<OrganizationListResponse>(
            '/organizations',
        )

        return response.data.data
    },
}