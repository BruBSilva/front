import api from './api';

// Progresso
export const getProgresso = (usuarioId, trilhaId) => api.get(`/progresso/api/progresso/${usuarioId}/${trilhaId}`);
export const createProgresso = (data) => api.post('/progresso/api/progresso', data);
export const concluirTrilha = (id) => api.put(`/progresso/api/progresso/${id}/concluir-trilha`);
export const concluirModulo = (id) => api.put(`/progresso/api/progresso/${id}/concluir-modulo`);
export const deleteProgresso = (id) => api.delete(`/progresso/api/progresso/${id}`);

// Usuário-Conquista
export const getUserConquistas = (usuarioId) => api.get(`/progresso/api/user-conquista/${usuarioId}`);
export const createUserConquista = (data) => api.post('/progresso/api/user-conquista', data);
export const updateUserConquista = (id, data) => api.put(`/progresso/api/user-conquista/${id}`, data);
export const deleteUserConquista = (id) => api.delete(`/progresso/api/user-conquista/${id}`);
