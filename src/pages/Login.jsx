import React from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (credentials) => {
    await login(credentials)
    navigate('/')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0e0e0e] text-white">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Login - <span className="text-green-600">Corvis</span>
        </h1>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    </div>
  )
}
