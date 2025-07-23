import React, { createContext, useEffect, useState } from 'react';
import { login as loginApi } from '../services/authApi';

const AuthContext = createContext();
export { AuthContext };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tenta restaurar usuário do localStorage
    const accessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    if (accessToken && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Erro ao restaurar dados do usuário:', error);
        // Se houver erro na deserialização, limpar dados corrompidos
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const res = await loginApi(credentials);
      
      // A authApi agora retorna: { success: boolean, token: string, user: object }
      if (res.data.success && res.data.token && res.data.user) {
        setUser(res.data.user);
        return res.data.user; // Retorna os dados do usuário para quem chama
      } else {
        throw new Error('Dados de login inválidos');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const value = { user, login, logout, loading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


