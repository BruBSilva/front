import api from './api';

// Usuários
export const getAluno = () => api.get('/usuario/api/aluno');
export const getAlunos = () => api.get('/usuario/api/aluno');
export const getFirstStudent = async () => {
  const response = await api.get('/usuario/api/aluno?size=1');
  if (response.data.content && response.data.content.length > 0) {
    return response.data.content[0];
  }
  throw new Error('No students found');
};
export const createAluno = (data) => api.post('/usuario/api/aluno', data);
export const getAdmin = () => api.get('/usuario/api/admin');
export const createAdmin = (data) => api.post('/usuario/api/admin', data);
export const getUsuarioById = (id) => api.get(`/usuario/api/aluno/${id}`);
export const deleteUsuario = (id) => api.delete(`/usuario/api/aluno/${id}`);
export const updateUsuario = (id, data) => api.put(`/usuario/api/aluno/${id}`, data);
