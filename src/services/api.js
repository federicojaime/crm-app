// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'your_api_url',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};

export const clientsService = {
    getClients: () => api.get('/clients'),
    createClient: (data) => api.post('/clients', data),
    updateClient: (id, data) => api.put(`/clients/${id}`, data),
    deleteClient: (id) => api.delete(`/clients/${id}`),
};

export const salesService = {
    getSales: () => api.get('/sales'),
    createSale: (data) => api.post('/sales', data),
};

export const pipelineService = {
    getPipelines: () => api.get('/pipelines'),
    updateClientStage: (clientId, stageId) =>
        api.put(`/pipelines/client/${clientId}/stage/${stageId}`),
};

export default api;