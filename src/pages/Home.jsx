import React, { useEffect, useState } from 'react'
import TrackCard from '../components/TrackCard'
import ActionsBar from '../components/ActionsBar'
import { useNavigate } from 'react-router-dom'
import { getTrilhas } from '../services/trilhaApi'

export default function Home() {
  const navigate = useNavigate()
  const [trilhas, setTrilhas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getTrilhas()
      .then(res => setTrilhas(Array.isArray(res.data.content) ? res.data.content : []))
      .catch(() => setError('Erro ao carregar trilhas'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-white p-8">Carregando trilhas...</div>
  if (error) return <div className="text-red-500 p-8">{error}</div>

  return (
    <div className=" min-w-screen bg-[#0e0e0e] text-white">
      <div className="text-center mb-10 mt-16">
        <h1 className="text-3xl md:text-7xl font-bold text-[#E4E4E4] font-fancy mt-4 tracking-tight">
          Bem-vindo ao <span className="text-green-600">Corvis</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm md:text-base max-w-md mx-auto">
          Aprenda como quem joga: complete trilhas, ganhe XP, evolua, siga o corvo.
        </p>
        <hr className="border-t border-green-600/50 w-[97%] mx-auto mt-6" />
      </div>
      <ActionsBar 
        onAdd={() => {}} 
        onFilter={() => {}} 
        onSort={() => {}} 
      />
      <div className="grid gap-6 p-6 transition-all duration-300 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {trilhas.map((trilha) => (
          <TrackCard
            key={trilha.id}
            language={trilha.linguagem || trilha.nome}
            level={trilha.nivel || trilha.level || ''}
            status={trilha.status || 'Em andamento'}
            xp={trilha.xp || 0}
            xpGain={trilha.xpGanho || 0}
            progress={trilha.progresso || 0}
            onAction={() => navigate(`/trilha?id=${trilha.id}`)}
          />
        ))}
      </div>
    </div>
  )
}