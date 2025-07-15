import React from 'react'
import {
  TrophyIcon,
  CheckCircleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'

const iconMap = {
  trophy: <TrophyIcon className="w-6 h-6 text-yellow-500" />,
  check: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
  user: <UserCircleIcon className="w-6 h-6 text-blue-500" />,
}

export default function AchievementsBox({ conquistas = [] }) {
  // Garantir que conquistas seja um array
  const conquistasArray = Array.isArray(conquistas) ? conquistas : []
  
  return (
    <div className="mt-4 py-4 max-w-sm flex flex-col justify-center items-center bg-black/80 border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 mb-3">
        <h2 className="text-white text-lg font-semibold">
          Conquistas
        </h2>
      </div>

      <ul>
        {conquistasArray.map((item) => (
          <li
            key={item.id}
            className="flex items-center bg-gray-100 rounded-full justify-between px-14 pl-0 mb-1"
          >
            <div className="flex items-center space-x-2">
              <div className="bg-white p-3 rounded-full">
                {iconMap[item.icon] || iconMap['trophy']}
              </div>
              <span className="font-fancy text-black/80">{item.conquistaNome || item.nome || item.title}</span>
            </div>
            <div className="text-right text-[0.8rem] ml-3 -mr-8">
              <div className="text-green-600 font-fancy text-[0.9rem]">
                {item.conquistaXpGanho || item.xp || 0} XP
              </div>
              <div className=" text-gray-500">{item.dataConquista ? new Date(item.dataConquista).toLocaleDateString() : (item.data || item.date)}</div>
            </div>
          </li>
        ))}
      </ul>
      <button className="mt-2 px-4 py-1 bg-white rounded shadow text-black font-semibold">Ver Mais</button>
    </div>
  )
}