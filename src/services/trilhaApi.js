import api from './api';

// Trilhas
export const getTrilhas = () => api.get('/trilha/api/trilhas');
export const getTrilhaById = (id) => api.get(`/trilha/api/trilhas/${id}`);
export const createTrilha = (data) => api.post('/trilha/api/trilhas', data);
export const updateTrilha = (id, data) => api.put(`/trilha/api/trilhas/${id}`, data);
export const deleteTrilha = (id) => api.delete(`/trilha/api/trilhas/${id}`);

// Categorias
export const getCategorias = () => api.get('/trilha/api/categorias');
export const getCategoriaById = (id) => api.get(`/trilha/api/categorias/${id}`);
export const createCategoria = (data) => api.post('/trilha/api/categorias', data);
export const createCategoriasLote = (data) => api.post('/trilha/api/categorias/lote', data);

// Conquistas
export const getConquistas = () => api.get('/trilha/api/conquistas');
export const getConquistaById = (id) => api.get(`/trilha/api/conquistas/${id}`);
export const getConquistasByTipo = (tipo) => api.get(`/trilha/api/conquistas/t/${tipo}`);
