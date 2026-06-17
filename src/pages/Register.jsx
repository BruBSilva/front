import React, { useState } from 'react'
import { createAluno } from '../services/userApi'
import { useNavigate } from 'react-router-dom'
import logoImage from '../assets/logomarca.jpg'

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
    <div className="flex min-h-screen font-inria text-lg">
      {/* painel esquerdo */}
      <div className="flex-1 bg-[#0e0e0e] text-white flex flex-col justify-center px-16">
        <h1 className="text-5xl font-bold mb-4 text-green-500">Bem Vindo ao Corvis!</h1>
        <p className="max-w-xl leading-relaxed">
          Prepare-se para explorar trilhas repletas de descobertas, colecionar
          conquistas e desvendar novas habilidades em um universo gamificado
          criado especialmente para você.
        </p>
      </div>

      <div className="flex-none w-[30%] max-w-md bg-gray-200 p-8 lg:p-10 rounded-l-2xl shadow-lg flex flex-col items-center space-y-6">
        <img
          src={logoImage}
          alt="Corvis"
          className="h-32 w-32 rounded-full object-cover"
        />
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-3">
        <h2 className="text-3xl font-semibold text-center mb-4">
          Registro </h2>
        <div className="w-full flex flex-col items-start space-y-2">
              <input
                type="text"
                name="nome"
                placeholder="Nome completo"
                value={formData.nome}
                onChange={handleChange}
                className="block w-full p-4 bg-gray-700 text-white border border-gray-600 py-2.5 rounded-2xl focus:border-green-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div className="w-full flex flex-col items-start space-y-2">
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                className="block w-full p-4 bg-gray-700 text-white border border-gray-600 py-2.5 rounded-2xl focus:border-green-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="w-full flex flex-col items-start space-y-2">
              <input
                type="password"
                name="senha"
                placeholder="Senha (mínimo 6 caracteres)"
                value={formData.senha}
                onChange={handleChange}
                className="block w-full p-4 bg-gray-700 text-white border border-gray-600 py-2.5 rounded-2xl focus:border-green-500 focus:outline-none transition-colors"
                required
                minLength={6}
              />
            </div>

            <div className="w-full flex flex-col items-start space-y-2">
              <input
                type="password"
                name="confirmSenha"
                placeholder="Confirmar senha"
                value={formData.confirmSenha}
                onChange={handleChange}
                className="block w-full p-4 bg-gray-700 text-white border border-gray-600 py-2.5 rounded-2xl focus:border-green-500 focus:outline-none transition-colors"
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
              className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-1 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <div>
            <p className="text-sm text-gray-700 hover:text-green-600 font-medium">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/login')
                }}
              >
                Já tem uma conta?
                <span className="font-semibold"> Faça Login</span>
              </button>
            </p>
          </div>
      </div>
    </div>
  )
}
