import React from 'react'
import TrackCard from '../components/TrackCard'
import ActionsBar from '../components/ActionsBar'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  const cards = [
    { language:'C#', level:'Iniciante', status:'Em andamento', xp:100, xpGain:30, progress:30 },
    { language:'C++', level:'Avançado', status:'Iniciado',    xp:400, xpGain:80, progress:20, onAction:()=>{navigate(`/trilha`)} },
    { language:'C++', level:'Iniciante', status:'Completo',    xp:100, xpGain:100, progress:100 }
  ]

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
      onSort={() => {}} />
      <div className="grid gap-6 p-6 transition-all duration-300 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c, i) => (
          <TrackCard key={i} {...c} />
        ))}
      </div>
    </div>
  )
}