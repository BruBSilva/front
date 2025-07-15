import React, { useEffect, useState } from 'react';
import { getUserConquistas } from '../services/learningApi';

export default function UserConquistas({ usuarioId }) {
  const [conquistas, setConquistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!usuarioId) return;
    getUserConquistas(usuarioId)
      .then(res => setConquistas(res.data))
      .catch(() => setError('Erro ao carregar conquistas'))
      .finally(() => setLoading(false));
  }, [usuarioId]);

  if (!usuarioId) return null;
  if (loading) return <div>Carregando conquistas...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <ul className="list-disc pl-6">
      {conquistas.map(c => (
        <li key={c.id}>{c.nome}</li>
      ))}
    </ul>
  );
}
