import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:500',
});

export default api;