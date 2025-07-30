import api from './api';

// Trilhas
export const getTrilhas = () => api.get('/trilha');
export const getTrilhaById = (id) => api.get(`/trilha/${id}`);
export const createTrilha = (data) => api.post('/trilha', data);
export const updateTrilha = (id, data) => api.put(`/trilha/${id}`, data);
export const deleteTrilha = (id) => api.delete(`/trilha/${id}`);

// Categorias
export const getCategorias = () => api.get('/trilha/categorias');
export const getCategoriaById = (id) => api.get(`/trilha/categorias/${id}`);
export const createCategoria = (data) => api.post('/trilha/categorias', data);
export const createCategoriasLote = (data) => api.post('/trilha/categorias/lote', data);

// Conquistas
export const getConquistas = () => api.get('/trilha/conquistas');
export const getConquistaById = (id) => api.get(`/trilha/conquistas/${id}`);
export const getConquistasByTipo = (tipo) => api.get(`/trilha/conquistas/t/${tipo}`);
