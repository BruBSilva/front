import React from 'react'
import TrackCard from '../components/TrackCard'

export default function Home() {
  const cards = [
    { language:'C#', level:'Iniciante', status:'Em andamento', xp:100, xpGain:30, progress:30 },
    { language:'C++', level:'Avançado', status:'Iniciado',    xp:400, xpGain:80, progress:20, onAction:()=>{/* acionar */} },
    { language:'C++', level:'Iniciante', status:'Completo',    xp:100, xpGain:100, progress:100 }
  ]

  return (
    <div className="min-h-screen min-w-screen bg-black text-white">
      <div className="p-6 grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        {cards.map((c,i) => (
          <TrackCard key={i} {...c} />
        ))}
      </div>
    </div>
  )
}