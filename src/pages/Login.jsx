import React from 'react'
import LoginForm from '../components/LoginForm'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const message = location.state?.message

  const handleLogin = () => {
    // Redirecionar para home após login bem-sucedido
    navigate('/')
  }

  return (
    <div className='text-white'>
      <div>
        <h1>
          Corvis
        </h1>
        <p>
          Faça login para continuar sua jornada de aprendizado
        </p>
      </div>
      
      {message && (
        <div>
          <div>
            {message}
          </div>
        </div>
      )}
      
      <div>
        <LoginForm onLogin={handleLogin} />
        
        <div>
          <p>
            Não tem uma conta?{' '}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                navigate('/cadastro')
              }}
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
