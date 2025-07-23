import { useEffect, useState, useCallback } from "react"
import { getUserConquistas } from "../services/learningApi"
import { getUsuarioById } from "../services/userApi"
import { useAuth } from '../hooks/useAuth.js'
import UserAvatar from "./UserAvatar"
import AchievementsBox from "./AchievementsBox"

export default function UserDrawer({ setOpen, usuarioId: propUsuarioId }) {
  const { user, logout } = useAuth()
  const [conquistas, setConquistas] = useState([])
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(user)
  const [userDataLoading, setUserDataLoading] = useState(false)

  const usuarioId = propUsuarioId || user?.id

  // Effect to load user data if not complete
  useEffect(() => {
    const loadUserData = async () => {
      console.log('UserDrawer - Current user data:', user)
      if (user && user.id && (!user.nome || user.xpTotal === undefined)) {
        console.log('UserDrawer - Loading complete user data for ID:', user.id)
        setUserDataLoading(true)
        try {
          const response = await getUsuarioById(user.id)
          console.log('UserDrawer - Fetched complete user data:', response.data)
          setUserData(response.data)
        } catch (error) {
          console.error('Error fetching complete user data:', error)
          setUserData(user) // fallback to original user data
        } finally {
          setUserDataLoading(false)
        }
      } else {
        console.log('UserDrawer - Using existing user data')
        setUserData(user)
      }
    }

    if (user) {
      loadUserData()
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    console.log('UserDrawer - Fetching conquistas for usuarioId:', usuarioId)
    if (usuarioId) {
      getUserConquistas(usuarioId)
        .then(res => {
          console.log('UserDrawer - Conquistas response:', res.data)
          // A API retorna uma estrutura de paginação, extrair o conteúdo
          const conquistasData = res.data?.content || []
          console.log('UserDrawer - Conquistas data:', conquistasData)
          setConquistas(conquistasData)
        })
        .catch(error => {
          console.error('Error fetching conquistas:', error)
          setConquistas([]) // Definir como array vazio em caso de erro
        })
    } else {
      console.log('UserDrawer - No usuarioId, setting empty conquistas')
      setConquistas([]) // Definir como array vazio se não houver usuário
    }
  }, [usuarioId])

  // Function to refresh conquistas
  const refreshConquistas = useCallback(() => {
    if (usuarioId) {
      getUserConquistas(usuarioId)
        .then(res => {
          const conquistasData = res.data?.content || []
          setConquistas(conquistasData)
        })
        .catch(error => {
          console.error('Error refreshing conquistas:', error)
        })
    }
  }, [usuarioId])

  // Listen for conquista updates (you can trigger this from other components)
  useEffect(() => {
    const handleConquistaUpdate = () => {
      refreshConquistas()
    }
    
    window.addEventListener('conquistaUpdated', handleConquistaUpdate)
    return () => window.removeEventListener('conquistaUpdated', handleConquistaUpdate)
  }, [refreshConquistas])

  if (loading || userDataLoading) {
    return (
      <div className="h-screen w-full bg-[#E4E4E4] shadow-lg flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    )
  }

  const displayUser = userData || user

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
        level={displayUser?.nivel || 1} 
        xp={displayUser?.xpTotal || 0} 
      />
      
      <div className="text-green-700 font-fancy">XP: {displayUser?.xpTotal || 0}</div>
      <div className="text-black/80 text-2xl font-semibold font-fancy">{displayUser?.nome || 'Usuário'}</div>
      
      <div className="w-full px-5">
        <AchievementsBox conquistas={conquistas} />
      </div>

      {displayUser && (
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
