import { useEffect, useState } from "react"
import { getUserConquistas } from "../services/learningApi"
import { useAuth } from '../hooks/useAuth.js'
import UserAvatar from "./UserAvatar"
import AchievementsBox from "./AchievementsBox"
import { getFirstStudent } from "../services/userApi"

export default function UserDrawer({ setOpen, usuarioId: propUsuarioId }) {
  const { user, logout } = useAuth()
  const [conquistas, setConquistas] = useState([])
  const [defaultUser, setDefaultUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user && !propUsuarioId) {
      getFirstStudent()
        .then(student => {
          setDefaultUser(student)
        })
        .catch(error => {
          console.error('Error getting first student:', error)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user, propUsuarioId])

  const activeUser = user || defaultUser
  const usuarioId = propUsuarioId || activeUser?.id

  useEffect(() => {
    if (usuarioId) {
      getUserConquistas(usuarioId)
        .then(res => {
          // A API retorna uma estrutura de paginação, extrair o conteúdo
          const conquistasData = res.data?.content || []
          setConquistas(conquistasData)
        })
        .catch(error => {
          console.error('Error fetching conquistas:', error)
          setConquistas([]) // Definir como array vazio em caso de erro
        })
    } else {
      setConquistas([]) // Definir como array vazio se não houver usuário
    }
  }, [usuarioId])

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#E4E4E4] shadow-lg flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full bg-[#E4E4E4] shadow-lg flex flex-col items-center p-7 space-y-12 relative">
      <button 
        onClick={() => setOpen(false)} 
        className="absolute top-5 left-3 bg-white text-black px-1.5 py-2 rounded-2xl shadow-lg hover:bg-gray-100 transition-colors duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
      
      <UserAvatar 
        level={activeUser?.nivel || 1} 
        xp={activeUser?.xpTotal || 0} 
      />
      
      <div className="text-green-700 font-fancy">XP: {activeUser?.xpTotal || 0}</div>
      <div className="text-black/80 text-2xl font-semibold font-fancy">{activeUser?.nome || 'Usuário'}</div>
      
      <div className="w-full px-5">
        <AchievementsBox conquistas={conquistas} />
      </div>

      {user && (
        <button 
          onClick={logout} 
          className="w-56 h-8 border-[2px] absolute bottom-10 left-1/2 -translate-x-1/2 border-red-500/70 text-red-600/80 rounded-md hover:bg-red-500/80 hover:text-white"
        >
          Sair
        </button>
      )}
    </div>
  )
}
