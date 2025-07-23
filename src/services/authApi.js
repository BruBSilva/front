import api from './api';

// Endpoints de autenticação reais do auth-service
export const login = async (credentials) => {
  // Mapear para o formato esperado pelo auth service
  const authData = {
    email: credentials.email,
    senha: credentials.password
  };
  
  try {
    const response = await api.post('/auth', authData);
    
    // Verificar se a resposta tem o formato esperado: {success: boolean, token: string}
    if (response.data.success && response.data.token) {
      // Armazenar o token
      localStorage.setItem('accessToken', response.data.token);
      
      // Tentar buscar dados do usuário
      try {
        const userData = await fetchUserData(credentials.email, response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        return {
          data: {
            success: true,
            token: response.data.token,
            user: userData
          }
        };
      } catch (userError) {
        console.warn('Erro ao buscar dados do usuário:', userError);
        // Mesmo sem dados completos do usuário, login foi bem-sucedido
        const basicUserData = {
          email: credentials.email,
          role: 'aluno' // padrão
        };
        localStorage.setItem('user', JSON.stringify(basicUserData));
        
        return {
          data: {
            success: true,
            token: response.data.token,
            user: basicUserData
          }
        };
      }
    } else {
      throw new Error('Resposta de login inválida');
    }
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

// Função auxiliar para buscar dados do usuário após login
const fetchUserData = async (email, token = null) => {
  // Configure headers with token if provided
  const headers = {};
  const tokenToUse = token || localStorage.getItem('accessToken');
  if (tokenToUse) {
    headers['Authorization'] = `Bearer ${tokenToUse}`;
  }

  try {
    // Tentar buscar como aluno primeiro
    const alunoResponse = await api.get(`/usuario/aluno/email/${email}`, { headers });
    return {
      ...alunoResponse.data,
      role: 'aluno'
    };
  } catch {
    // Se não for aluno, tentar buscar como admin
    try {
      const adminResponse = await api.get(`/usuario/admin/email/${email}`, { headers });
      return {
        ...adminResponse.data,
        role: 'admin'
      };
    } catch {
      throw new Error('Usuário não encontrado');
    }
  }
};

// Placeholder para refresh (não implementado no auth service ainda)
export const refresh = () => {
  throw new Error('Refresh token não implementado ainda no auth service');
};

export const logout = () => {
  // Por enquanto apenas limpa os tokens localmente
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  return Promise.resolve();
};
