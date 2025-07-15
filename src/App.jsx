import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Trilha from './pages/Trilha'
import UserDrawer from './components/UserDrawer'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'
import { getFirstStudent } from './services/userApi'
const PopulatePage = React.lazy(() => import('./pages/Populate'))

function AppContent() {
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [defaultUser, setDefaultUser] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      getFirstStudent()
        .then(student => {
          setDefaultUser(student)
        })
        .catch(error => {
          console.error('Error getting first student:', error)
        })
    }
  }, [user])

  const activeUser = user || defaultUser

  return (
    <Router>
      <div className="flex min-h-screen">
        <div className={`flex-1 overflow-y-auto transition-all duration-300 ${drawerOpen ? 'pr-96' : 'pr-0'}`}>
          <Routes>
            <Route path="/trilha" element={<Trilha activeUser={activeUser} />} />
            <Route path="/" element={<Home />} />
            <Route path="/populate" element={<React.Suspense fallback={<div>Carregando...</div>}><PopulatePage /></React.Suspense>} />
          </Routes>
        </div>

        {drawerOpen && (
          <div className="fixed top-0 right-0 h-screen w-96 z-50">
            <UserDrawer setOpen={setDrawerOpen} usuarioId={activeUser?.id} />
          </div>
        )}
      </div>

      {!drawerOpen && (
        <button
          onClick={() => setDrawerOpen(true)}
          className="fixed right-5 top-5 z-50 bg-white text-black px-1.5 py-2 rounded-2xl shadow-lg hover:bg-gray-200 transition-colors duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}
    </Router>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
