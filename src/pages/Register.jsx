import React, { useState } from 'react'
import { createAluno } from '../services/userApi'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmSenha: ''
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setError(null)

    console.log('Iniciando processo de registro...')

    // Validações
    if (formData.senha !== formData.confirmSenha) {
      setError('As senhas não coincidem')
      console.log('Erro: Senhas não coincidem')
      return
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      console.log('Erro: Senha muito curta')
      return
    }

    setLoading(true)

    try {
      console.log('Enviando dados para createAluno:', {
        nome: formData.nome,
        email: formData.email,
        senha: '[REDACTED]'
      })

      // Criar usuário aluno
      const result = await createAluno({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha
      })

      console.log('Usuário criado com sucesso:', result)

      navigate('/login', { 
        state: { 
          message: 'Cadastro realizado com sucesso! Faça login para continuar.' 
        }
      })
    } catch (err) {
      console.error('Erro detalhado no cadastro:', err)
      console.error('Response:', err.response)
      console.error('Status:', err.response?.status)
      console.error('Data:', err.response?.data)
      
      if (err.response && err.response.status === 400) {
        setError('Dados inválidos. Verifique os campos.')
      } else if (err.response && err.response.status === 409) {
        setError('Este e-mail já está cadastrado.')
      } else {
        setError('Erro no servidor. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='text-white'>
      <div>
        <h1>
          Corvis
        </h1>
        <p>
          Crie sua conta e comece sua jornada de aprendizado
        </p>
      </div>
      
      <div>
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="nome"
                placeholder="Nome completo"
                value={formData.nome}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <input
                type="password"
                name="senha"
                placeholder="Senha (mínimo 6 caracteres)"
                value={formData.senha}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                required
                minLength={6}
              />
            </div>
            
            <div>
              <input
                type="password"
                name="confirmSenha"
                placeholder="Confirmar senha"
                value={formData.confirmSenha}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-lg border border-red-800">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
          
          <div>
            <p>
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/login')
                }}
              >
                Faça login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
