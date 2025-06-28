import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Home from './pages/Home'
import Trilha from './pages/Trilha'
import Login from './pages/Login'
import Register from './pages/Register'
import UserProfile from './pages/UserProfile'
import { store } from './store'
import UserDrawer from './components/UserDrawer'

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(true)

  return (
    <Provider store={store}>
      <Router>
        <div className="flex min-h-screen">
          <div className={`flex-1 overflow-y-auto transition-all duration-300 ${drawerOpen ? 'pr-96' : 'pr-0'}`}>
            <Routes>
              <Route path="/trilha" element={<Trilha />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              <Route path="/perfil" element={<UserProfile />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </div>

          {drawerOpen && (
            <div className="fixed top-0 right-0 h-screen w-96 z-50">
              <UserDrawer setOpen={setDrawerOpen} />
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
    </Provider>
  )
}
