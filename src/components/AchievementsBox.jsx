import React from 'react'
import {
  TrophyIcon,
  CheckCircleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'

//APENAS PARA FAKEAR E PODER TESTAR O COMPONENTE
const achievements = [
  {
    id: 1,
    title: 'Sabe tudo!',
    xp: 1000,
    date: '23/12/2025',
    icon: <TrophyIcon className="w-6 h-6 text-yellow-500" />,
  },
  {
    id: 2,
    title: 'Até o fim',
    xp: 150,
    date: '17/06/2025',
    icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
  },
  {
    id: 3,
    title: 'Iniciante',
    xp: 100,
    date: '10/06/2025',
    icon: <UserCircleIcon className="w-6 h-6 text-blue-500" />,
  },
]

export default function AchievementsBox() {
  return (
    <div className="mt-4 py-4 max-w-sm flex flex-col justify-center items-center bg-black/80 border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 mb-3">
        <h2 className="text-white text-lg font-semibold">
          Conquistas
        </h2>
      </div>

      <ul>
        {achievements.map((item) => (
          <li
            key={item.id}
            className="flex items-center bg-gray-100 rounded-full justify-between px-14 pl-0 mb-1"
          >
            <div className="flex items-center space-x-2">
              <div className="bg-white p-3 rounded-full">
                {item.icon}
              </div>
              <span className="font-fancy text-black/80">{item.title}</span>
            </div>
            <div className="text-right text-[0.8rem] ml-3 -mr-8">
              <div className="text-green-600 font-fancy text-[0.9rem]">
                {item.xp} XP
              </div>
              <div className=" text-gray-500">{item.date}</div>
            </div>
          </li>
        ))}
      </ul>

      <button className="w-52 py-1 mt-3 text-center font-small text-black/80 bg-white hover:bg-gray-200 transition-colors duration-300 font-semibold rounded-md">
        Ver Mais
      </button>
    </div>
  )
}