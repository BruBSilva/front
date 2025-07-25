import api from './api';

export const login = async (credentials) => {
  const authData = {
    email: credentials.email,
    senha: credentials.password
  };
  
  try {
    const response = await api.post('/auth', authData);
    
    if (response.data.success && response.data.token) {
      localStorage.setItem('accessToken', response.data.token);
      
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
        const basicUserData = {
          email: credentials.email,
          role: 'aluno'
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

const fetchUserData = async (email, token = null) => {
  const headers = {};
  const tokenToUse = token || localStorage.getItem('accessToken');
  if (tokenToUse) {
    headers['Authorization'] = `Bearer ${tokenToUse}`;
  }

  try {
    const alunoResponse = await api.get(`/usuario/aluno/email/${email}`, { headers });
    return {
      ...alunoResponse.data,
      role: 'aluno'
    };
  } catch {
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

export const refresh = () => {
  throw new Error('Refresh token não implementado ainda no auth service');
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  return Promise.resolve();
};
