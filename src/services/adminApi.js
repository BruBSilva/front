import axios from 'axios';

const adminApi = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

let populateToken = null;

// CÓDIGO USADO APENAS PARA POPULATE INICIAL (DEBUG, NÃO É CODIGO FINAL)

export const setupPopulateAuth = async () => {
  try {
    // Primeiro tenta admin
    let response = await adminApi.post('/auth', {
      email: 'admin@teste.com',
      senha: 'admin123'
    });
    
    if (response.data.success && response.data.token) {
      populateToken = response.data.token;
      console.log('Autenticado como admin');
      return true;
    }
  } catch {
    console.log('Admin login falhou, tentando usuário teste...');
    try {
      // Se admin falhar, tenta usuário teste
      const response = await adminApi.post('/auth', {
        email: 'joao@teste.com',
        senha: '123456'
      });
      
      if (response.data.success && response.data.token) {
        populateToken = response.data.token;
        console.log('Autenticado como usuário teste');
        return true;
      }
    } catch {
      console.warn('Nenhum usuário disponível para autenticação');
    }
  }
  
  console.warn('Continuando sem autenticação - algumas operações podem falhar');
  return false;
};

export const checkAdminExists = async (email) => {
  try {
    const response = await adminApi.post('/auth', {
      email: email,
      senha: 'admin123'
    });
    return response.data.success;
  } catch (error) {
    console.log('Admin check failed:', error.response?.status, error.message);
    return false;
  }
};

adminApi.interceptors.request.use(
  (config) => {
    if (populateToken) {
      config.headers['Authorization'] = `Bearer ${populateToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Operações de usuário para populate
export const getAlunos = () => adminApi.get('/usuario/aluno');
export const createAluno = (data) => adminApi.post('/usuario/aluno', data);
export const deleteUsuario = (id) => adminApi.delete(`/usuario/aluno/${id}`);
export const createAdmin = (data) => adminApi.post('/usuario/admin', data);

// Operações de trilha para populate
export const getTrilhas = () => adminApi.get('/trilha');
export const createTrilha = (data) => adminApi.post('/trilha', data);
export const deleteTrilha = (id) => adminApi.delete(`/trilha/${id}`);
export const getCategorias = () => adminApi.get('/trilha/categorias');
export const createCategoria = (data) => adminApi.post('/trilha/categorias', data);

// Operações de aprendizado para populate
export const createProgresso = (data) => adminApi.post('/aprendizado/progresso', data);
export const createUserConquista = (data) => adminApi.post('/aprendizado/user-conquista', data);

export default adminApi;
