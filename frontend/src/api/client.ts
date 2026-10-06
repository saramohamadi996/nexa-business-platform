import axios from 'axios'
import { useOrganizationStore } from '../stores/organizationStore'
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('nexa_token')
    const organizationId = useOrganizationStore.getState().organizationId

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    if (organizationId) {
        config.headers['X-Organization-Id'] = organizationId
    }

    return config
})