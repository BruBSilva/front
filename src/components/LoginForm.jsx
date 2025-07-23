import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setError(null);
    
    console.log('Iniciando processo de login...');
    console.log('Email:', email);
    
    try {
      const userData = await login({ email, password });
      console.log('Login bem-sucedido:', userData);
      onLogin && onLogin(userData);
    } catch (err) {
      console.error('Erro detalhado no login:', err);
      console.error('Response:', err.response);
      console.error('Status:', err.response?.status);
      console.error('Data:', err.response?.data);
      
      if (err.response && err.response.status === 401) {
        setError('E-mail ou senha inválidos');
      } else if (err.response && err.response.status === 404) {
        setError('Usuário não encontrado');
      } else {
        setError('Erro no servidor. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:border-transparent"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:border-transparent"
            required
          />
        </div>
        {error && (
          <div className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-lg border border-red-800">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
