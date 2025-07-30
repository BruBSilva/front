import axios from 'axios';

// Instância central do Axios
const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const isAuthEndpoint = config.url === '/auth' || config.url?.startsWith('/auth/');
    
    if (!isAuthEndpoint) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Token inválido ou expirado. Faça login novamente.');
    }
    return Promise.reject(error);
  }
);

export default api;
