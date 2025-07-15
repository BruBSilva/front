import api from './api';

// Exemplos de endpoints de autenticação
export const login = (credentials) => api.post('/auth/api/login', credentials);
export const refresh = (refreshToken) => api.post('/auth/api/refresh', { refreshToken });
export const logout = () => api.post('/auth/api/logout');

// Outros endpoints podem ser adicionados conforme implementados no serviço
