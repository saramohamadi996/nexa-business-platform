import { create } from 'zustand'

interface OrganizationStore {
    organizationId: number | null
    setOrganizationId: (id: number) => void
    clearOrganization: () => void
}

export const useOrganizationStore = create<OrganizationStore>((set) => ({
    organizationId: Number(
        localStorage.getItem('nexa_organization_id')
    ) || null,

    setOrganizationId: (id) => {
        localStorage.setItem('nexa_organization_id', String(id))

        set({
            organizationId: id,
        })
    },

    clearOrganization: () => {
        localStorage.removeItem('nexa_organization_id')

        set({
            organizationId: null,
        })
    },
}))