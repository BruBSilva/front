import axios from 'axios';

// Instância central do Axios
const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, // se precisar enviar cookies
});

// Interceptor para incluir JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta para refresh automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await api.post('/auth/api/refresh', { refreshToken });
        const newToken = res.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        api.defaults.headers['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Redirecionar para login ou limpar tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    // Tratamento centralizado de erros
    return Promise.reject(error);
  }
);

export default api;
