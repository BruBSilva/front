import React, { useEffect, useState } from 'react'
import TrackCard from '../components/TrackCard'
import ActionsBar from '../components/ActionsBar'
import { useNavigate } from 'react-router-dom'
import { getTrilhas } from '../services/trilhaApi'
import { getProgresso } from '../services/learningApi'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [trilhas, setTrilhas] = useState([])
  const [trilhasWithProgress, setTrilhasWithProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [progressLoading, setProgressLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getTrilhas()
      .then(res => setTrilhas(Array.isArray(res.data.content) ? res.data.content : []))
      .catch(() => setError('Erro ao carregar trilhas'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!user?.id || trilhas.length === 0) {
      setTrilhasWithProgress(trilhas.map(trilha => ({
        ...trilha,
        status: 'Não iniciado',
        progress: 0,
        xpGain: 0,
        userProgress: null
      })))
      return
    }

    const fetchProgressForTrilhas = async () => {
      setProgressLoading(true)
      const trilhasWithProgressData = await Promise.all(
        trilhas.map(async (trilha) => {
          try {
            const progressResponse = await getProgresso(user.id, trilha.id)
            const progress = progressResponse.data
            
            let totalPossibleXP = progress.xpGanho || 0
            if (progress.percentual > 0 && progress.percentual < 100) {
              totalPossibleXP = Math.round((progress.xpGanho || 0) / (progress.percentual / 100))
            } else if (progress.percentual === 100) {
              totalPossibleXP = progress.xpGanho || 0
            } else if (progress.percentual === 0) {
              totalPossibleXP = 100
            }
            
            let status = 'Em andamento'
            if (progress.statusProgresso === 'CONCLUIDO') {
              status = 'Completo'
            } else if (progress.percentual === 0) {
              status = 'Iniciado'
            }

            return {
              ...trilha,
              status,
              progress: Math.round(progress.percentual || 0),
              xp: totalPossibleXP,
              xpGain: progress.xpGanho || 0,
              userProgress: progress
            }
          } catch {
            const totalPossibleXP = 100
              
            return {
              ...trilha,
              status: 'Não iniciado',
              progress: 0,
              xp: totalPossibleXP,
              xpGain: 0,
              userProgress: null
            }
          }
        })
      )
      
      setTrilhasWithProgress(trilhasWithProgressData)
      setProgressLoading(false)
    }

    fetchProgressForTrilhas()
  }, [user, trilhas])

  if (loading) return <div className="text-white p-8">Carregando trilhas...</div>
  if (error) return <div className="text-red-500 p-8">{error}</div>

  const displayTrilhas = trilhasWithProgress.length > 0 ? trilhasWithProgress : trilhas.map(trilha => ({
    ...trilha,
    status: 'Carregando...',
    progress: 0,
    xp: 100,
    xpGain: 0
  }))

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
        {displayTrilhas.map((trilha) => (
          <TrackCard
            key={trilha.id}
            language={trilha.linguagem || trilha.nome}
            level={trilha.nivel || trilha.level || ''}
            status={trilha.status}
            xp={trilha.xp}
            xpGain={trilha.xpGain}
            progress={trilha.progress}
            onAction={() => navigate(`/trilha?id=${trilha.id}`)}
          />
        ))}
      </div>
    </div>
  )
}