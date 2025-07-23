import api from './api';

// Usuários
export const getAluno = () => api.get('/usuario/aluno');
export const getAlunos = () => api.get('/usuario/aluno');
export const getFirstStudent = async () => {
  const response = await api.get('/usuario/aluno?size=1');
  if (response.data.content && response.data.content.length > 0) {
    return response.data.content[0];
  }
  throw new Error('No students found');
};
export const createAluno = (data) => api.post('/usuario/aluno', data);
export const getAdmin = () => api.get('/usuario/admin');
export const createAdmin = (data) => api.post('/usuario/admin', data);
export const getUsuarioById = (id) => api.get(`/usuario/aluno/${id}`);
export const deleteUsuario = (id) => api.delete(`/usuario/aluno/${id}`);
export const updateUsuario = (id, data) => api.put(`/usuario/aluno/${id}`, data);

// Função para buscar usuário por email (usado no auth)
export const getAlunoByEmail = (email) => api.get(`/usuario/aluno/email/${email}`);
export const getAdminByEmail = (email) => api.get(`/usuario/admin/email/${email}`);
