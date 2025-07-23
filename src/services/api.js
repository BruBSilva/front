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

// Interceptor de resposta - simplificado pois não temos refresh ainda
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Se receber 401, redirecionar para login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
