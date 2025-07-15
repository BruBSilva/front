// Mock para endpoints de autenticação enquanto o serviço real não está disponível
// Use MSW (Mock Service Worker) para interceptar chamadas HTTP do front

import { http } from 'msw'

export const handlers = [
  // Mock de login
  http.post('http://localhost:8080/auth/api/login', async () => {
    return new Response(
      JSON.stringify({
        accessToken: 'fake-access-token',
        refreshToken: 'fake-refresh-token',
        user: { id: 1, nome: 'Usuário Mock', email: 'mock@teste.com' }
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }),

  // Mock de refresh
  http.post('http://localhost:8080/auth/api/refresh', async () => {
    return new Response(
      JSON.stringify({ 
        accessToken: 'fake-access-token-refreshed' 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }),

  // Mock de logout
  http.post('http://localhost:8080/auth/api/logout', () => {
    return new Response(null, { status: 200 })
  })
];
