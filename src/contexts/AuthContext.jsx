import React, { createContext, useCallback, useEffect, useState } from 'react';
import { login as loginApi } from '../services/authApi';
import { getUserConquistas } from '../services/learningApi';

const AuthContext = createContext();
export { AuthContext };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    if (accessToken && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Erro ao restaurar dados do usuário:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      }
    }
    setLoading(false);
  }, []);

  const updateUserTotalXP = useCallback(async (userId) => {
    try {
      const conquistasRes = await getUserConquistas(userId);
      const conquistas = conquistasRes.data?.content || [];
      
      const totalXP = conquistas.reduce((total, conquista) => {
        return total + (conquista.xpGanho || 0);
      }, 0);
      
      setUser(prevUser => ({
        ...prevUser,
        xpTotal: totalXP,
        xpCalculado: totalXP
      }));
      
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.xpTotal = totalXP;
      userData.xpCalculado = totalXP;
      localStorage.setItem('user', JSON.stringify(userData));
      
      return totalXP;
    } catch (error) {
      console.warn('Erro ao calcular XP total:', error);
      return 0;
    }
  }, []);

  const login = async (credentials) => {
    const res = await loginApi(credentials);
    const tokenData = res.data;
    
    // Armazenar token
    localStorage.setItem('accessToken', tokenData.token);
    if (tokenData.refreshToken) {
      localStorage.setItem('refreshToken', tokenData.refreshToken);
    }
    
    try {
      let fullUserData;
      if (tokenData.role === 'ADMIN') {
        const adminsRes = await fetch('http://localhost:8080/usuario/admin', {
          headers: { 'Authorization': `Bearer ${tokenData.token}` }
        });
        if (adminsRes.ok) {
          const adminsData = await adminsRes.json();
          fullUserData = adminsData.content?.find(admin => admin.email === tokenData.user);
        }
      } else if (tokenData.role === 'ALUNO') {
        const alunosRes = await fetch('http://localhost:8080/usuario/aluno', {
          headers: { 'Authorization': `Bearer ${tokenData.token}` }
        });
        if (alunosRes.ok) {
          const alunosData = await alunosRes.json();
          fullUserData = alunosData.content?.find(aluno => aluno.email === tokenData.user);
        }
      }
      
      if (fullUserData) {
        localStorage.setItem('user', JSON.stringify(fullUserData));
        setUser(fullUserData);
        
        updateUserTotalXP(fullUserData.id);
        
        return fullUserData;
      }
    } catch (e) {
      console.warn('Não foi possível buscar dados completos do usuário, usando dados básicos:', e);
    }
    
    const userData = {
      email: tokenData.user || credentials.email,
      role: tokenData.role,
      nome: tokenData.user?.split('@')[0] || credentials.email.split('@')[0]
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const value = { user, login, logout, loading, updateUserTotalXP };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


