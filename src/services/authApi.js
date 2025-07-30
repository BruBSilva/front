import api from './api';

export const login = (credentials) => api.post('/auth', credentials);
export const refresh = (refreshToken) => api.post('/auth/refresh', { refreshToken });
export const logout = () => api.post('/auth/logout');

