import React, { useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setError(null);
    
    console.log('Iniciando processo de login...');
    console.log('Email:', email);
    
    try {
      await onLogin({ email, senha });
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Usuário ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full flex flex-col items-center">
      <h2 className="text-3xl font-semibold text-center">Login</h2>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-2xl focus:border-green-500 focus:outline-none transition-colors"
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={e => setSenha(e.target.value)}
        className="block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-2xl focus:border-green-500 focus:outline-none transition-colors"
        required
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
              type="submit"
              className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-1 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
              disabled={loading}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
