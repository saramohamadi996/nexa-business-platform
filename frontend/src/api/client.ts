import axios from 'axios'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('nexa_token')
    const organizationId = localStorage.getItem('nexa_organization_id')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    if (organizationId) {
        config.headers['X-Organization-Id'] = organizationId
    }

    return config
})