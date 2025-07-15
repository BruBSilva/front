import React, { useEffect, useState } from 'react';
import { getTrilhas } from '../services/trilhaApi';

export default function TrilhasList() {
  const [trilhas, setTrilhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTrilhas()
      .then(res => setTrilhas(res.data))
      .catch(() => setError('Erro ao carregar trilhas'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Carregando trilhas...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {trilhas.map(trilha => (
        <div key={trilha.id} className="p-4 bg-white rounded shadow">
          <h3 className="font-bold text-lg">{trilha.nome}</h3>
          <p>{trilha.descricao}</p>
        </div>
      ))}
    </div>
  );
}
