import React, { useState } from 'react';
import { createAluno, deleteUsuario, getAlunos, createAdmin } from '../services/userApi';
import { createTrilha, deleteTrilha, getTrilhas, getCategorias, createCategoria } from '../services/trilhaApi';



export default function PopulatePage() {
  const [result, setResult] = useState('');

  const handleResetAndPopulate = async () => {
    let log = [];
    let adminToken = null;
    
    try {
      try {
        const loginResponse = await fetch('http://localhost:8080/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            email: 'admin@sistema.com', 
            senha: 'admin123' 
          })
        });

        if (loginResponse.ok) {
          const adminData = await loginResponse.json();
          adminToken = adminData.token || adminData.accessToken;
          log.push('Login com admin existente realizado com sucesso.');
          console.log('Admin logado:', adminData);
        }
      } catch {
        log.push('Admin padrão não encontrado, será criado um novo.');
      }

      if (adminToken) {
        try {
          localStorage.setItem('accessToken', adminToken);
          const adminsResponse = await fetch('http://localhost:8080/usuario/admin', {
            headers: {
              'Authorization': `Bearer ${adminToken}`
            }
          });
          
          if (adminsResponse.ok) {
            const adminsData = await adminsResponse.json();
            console.log('Admins encontrados:', adminsData);
            
            const adminContent = adminsData.content || [];
            const adminToDelete = adminContent.find(admin => admin.email === 'admin@sistema.com');
            
            if (adminToDelete) {
              console.log('Admin encontrado para deletar:', adminToDelete);
              const deleteResponse = await fetch(`http://localhost:8080/usuario/admin/${adminToDelete.id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${adminToken}`
                }
              });
              
              if (deleteResponse.ok) {
                log.push('Admin existente removido com sucesso.');
                adminToken = null;
                
                await new Promise(resolve => setTimeout(resolve, 1500));
              } else {
                const errorText = await deleteResponse.text();
                throw new Error(`Erro ao deletar admin: ${deleteResponse.status} - ${errorText}`);
              }
            } else {
              log.push('Admin com email admin@sistema.com não encontrado na lista.');
              adminToken = null;
            }
          } else {
            log.push('Erro ao buscar lista de admins, continuando...');
            adminToken = null;
          }
        } catch (e) {
          log.push('Erro ao remover admin existente: ' + e.message);
          adminToken = null;
        }
      }

      if (!adminToken) {
        try {
          console.log('Criando admin...');
          log.push('Criando admin...');
          
          const adminCriado = await createAdmin({
            nome: 'Administrador do Sistema',
            email: 'admin@sistema.com',
            senha: 'admin123'
          });
          
          log.push('Admin criado: ' + JSON.stringify(adminCriado.data));
          
          const loginResponse = await fetch('http://localhost:8080/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              email: 'admin@sistema.com', 
              senha: 'admin123' 
            })
          });

          if (loginResponse.ok) {
            const adminData = await loginResponse.json();
            adminToken = adminData.token || adminData.accessToken;
            log.push('Admin criado e login realizado com sucesso.');
            console.log('Admin criado e logado:', adminData);
          } else {
            throw new Error('Erro ao fazer login com admin criado');
          }
        } catch (e) {
          const errorMessage = e?.response?.data?.message || e.message;
          log.push('Erro ao criar admin: ' + errorMessage);
          
          if (errorMessage.includes('duplicar valor da chave') || errorMessage.includes('já existe')) {
            log.push('Admin já existe, tentando fazer login...');
            try {
              const loginResponse = await fetch('http://localhost:8080/auth', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                  email: 'admin@sistema.com', 
                  senha: 'admin123' 
                })
              });

              if (loginResponse.ok) {
                const adminData = await loginResponse.json();
                adminToken = adminData.token || adminData.accessToken;
                log.push('Login com admin existente realizado com sucesso após erro de criação.');
              } else {
                throw new Error('Não foi possível fazer login com admin existente');
              }
            } catch (loginError) {
              log.push('Erro ao fazer login com admin existente: ' + loginError.message);
              throw loginError;
            }
          } else {
            throw e;
          }
        }
      }

      localStorage.setItem('accessToken', adminToken);

      try {
        const alunos = await getAlunos();
        console.log('Alunos encontrados:', alunos.data);
        log.push('Alunos encontrados: ' + JSON.stringify(alunos.data));
        
        const alunoArr = Array.isArray(alunos.data.content) ? alunos.data.content : [];
        const alunosTeste = alunoArr.filter(a => [
          'joao@teste.com',
          'maria@teste.com', 
          'pedro@teste.com'
        ].includes(a.email));
        
        for (const aluno of alunosTeste) {
          console.log('Deletando usuário:', aluno);
          await deleteUsuario(aluno.id);
          log.push(`Usuário ${aluno.email} removido.`);
        }
      } catch (e) {
        console.error('Erro ao buscar/deletar usuário:', e);
        log.push('Erro ao buscar/deletar usuário: ' + (e?.response?.data?.message || e.message));
      }
      try {
        const trilhas = await getTrilhas();
        console.log('Trilhas encontradas:', trilhas.data);
        log.push('Trilhas encontradas: ' + JSON.stringify(trilhas.data));
        // Corrigido: buscar no array content
        const trilhaArr = Array.isArray(trilhas.data.content) ? trilhas.data.content : [];
        for (const t of trilhaArr) {
          if ([
            'C#: Iniciante', 
            'C++: Avançado', 
            'C++: Iniciante',
            'JavaScript: Fundamentals',
            'Python: Data Science',
            'React: Modern Web Development',
            'Database Design & SQL'
          ].includes(t.nome)) {
            console.log('Deletando trilha:', t);
            await deleteTrilha(t.id);
            console.log('Trilha deletada.');
            log.push('Trilha deletada.');
          }
        }
      } catch (e) {
        console.error('Erro ao buscar/deletar trilhas:', e);
        log.push('Erro ao buscar/deletar trilhas: ' + (e?.response?.data?.message || e.message));
      }
      // Categoria
      console.log('Criando categoria...');
      log.push('Criando categoria...');
      let categoriaId;
      try {
        // Verifica se já existe
        const categoriasResp = await getCategorias();
        const categoriasArr = Array.isArray(categoriasResp.data.content) ? categoriasResp.data.content : [];
        let categoria = categoriasArr.find(c => c.nome === 'Categoria Teste');
        if (!categoria) {
          const novaCatResp = await createCategoria({ nome: 'Categoria Teste', descricao: 'Categoria para testes automáticos' });
          categoria = novaCatResp.data;
          log.push('Categoria criada: ' + JSON.stringify(categoria));
        } else {
          log.push('Categoria já existe: ' + JSON.stringify(categoria));
        }
        categoriaId = categoria.id;
      } catch (e) {
        log.push('Erro ao criar/obter categoria: ' + (e?.response?.data?.message || e.message));
        throw e;
      }

      // Usuário
      console.log('Criando alunos...');
      log.push('Criando alunos...');
      
      const alunosParaCriar = [
        {
          nome: 'João Antonio A. B. Camilo',
          email: 'joao@teste.com',
          senha: '123456'
        },
        {
          nome: 'Maria Silva Santos',
          email: 'maria@teste.com',
          senha: '123456'
        },
        {
          nome: 'Pedro Oliveira Costa',
          email: 'pedro@teste.com',
          senha: '123456'
        }
      ];

      for (const alunoData of alunosParaCriar) {
        try {
          const alunoResponse = await createAluno(alunoData);
          log.push(`Aluno criado: ${alunoData.nome} (${alunoData.email})`);
          console.log('Aluno criado:', alunoResponse.data);
        } catch (e) {
          log.push(`Erro ao criar aluno ${alunoData.email}: ` + (e?.response?.data?.message || e.message));
        }
      }

      // Trilhas
      console.log('Criando trilhas...');
      log.push('Criando trilhas...');
      // Função para gerar conquista DTO
      const makeConquista = (nome, tipo) => ({
        nome,
        descricao: `Conquista da trilha ${nome}`,
        tipo: tipo || 'TRILHA',
        xpGanho: 100
      });
      // Cria trilhas com mais módulos
      await createTrilha({
        nome: 'C#: Iniciante',
        descricao: 'Trilha para iniciantes em C#',
        categoria: { id: categoriaId },
        modulos: [
          {
            titulo: 'Introdução ao C#',
            conteudo: '<p>Primeiros passos com C#</p>',
            ordem: 1,
            conquista: {
              nome: 'Módulo 1 C#',
              descricao: 'Conquista do módulo 1 de C#',
              tipo: 'MODULO',
              xpGanho: 20
            }
          },
          {
            titulo: 'Variáveis e Tipos',
            conteudo: '<p>Trabalhando com variáveis e tipos de dados em C#</p>',
            ordem: 2,
            conquista: {
              nome: 'Módulo 2 C#',
              descricao: 'Conquista do módulo 2 de C#',
              tipo: 'MODULO',
              xpGanho: 25
            }
          },
          {
            titulo: 'Estruturas de Controle',
            conteudo: '<p>If, else, switch, loops em C#</p>',
            ordem: 3,
            conquista: {
              nome: 'Módulo 3 C#',
              descricao: 'Conquista do módulo 3 de C#',
              tipo: 'MODULO',
              xpGanho: 30
            }
          }
        ],
        conquista: makeConquista('C#: Iniciante', 'TRILHA')
      });
      
      await createTrilha({
        nome: 'C++: Avançado',
        descricao: 'Trilha avançada de C++',
        categoria: { id: categoriaId },
        modulos: [
          {
            titulo: 'Versionamento',
            conteudo: '<p>Fundamentos de controle de versão e Git</p>',
            ordem: 1,
            conquista: {
              nome: 'Módulo 1 C++ Avançado',
              descricao: 'Conquista do módulo 1 de C++ Avançado',
              tipo: 'MODULO',
              xpGanho: 10
            }
          },
          {
            titulo: 'Operações Básicas',
            conteudo: '<p>Operações fundamentais em C++</p>',
            ordem: 2,
            conquista: {
              nome: 'Módulo 2 C++ Avançado',
              descricao: 'Conquista do módulo 2 de C++ Avançado',
              tipo: 'MODULO',
              xpGanho: 15
            }
          },
          {
            titulo: 'Fluxo de Controle',
            conteudo: '<p>Estruturas de controle avançadas</p>',
            ordem: 3,
            conquista: {
              nome: 'Módulo 3 C++ Avançado',
              descricao: 'Conquista do módulo 3 de C++ Avançado',
              tipo: 'MODULO',
              xpGanho: 20
            }
          },
          {
            titulo: 'Ponteiros e Memória',
            conteudo: '<p>Gerenciamento avançado de memória</p>',
            ordem: 4,
            conquista: {
              nome: 'Módulo 4 C++ Avançado',
              descricao: 'Conquista do módulo 4 de C++ Avançado',
              tipo: 'MODULO',
              xpGanho: 25
            }
          },
          {
            titulo: 'Templates e STL',
            conteudo: '<p>Templates avançados e Standard Template Library</p>',
            ordem: 5,
            conquista: {
              nome: 'Módulo 5 C++ Avançado',
              descricao: 'Conquista do módulo 5 de C++ Avançado',
              tipo: 'MODULO',
              xpGanho: 30
            }
          }
        ],
        conquista: makeConquista('C++: Avançado', 'TRILHA')
      });
      
      await createTrilha({
        nome: 'C++: Iniciante',
        descricao: 'Trilha para iniciantes em C++',
        categoria: { id: categoriaId },
        modulos: [
          {
            titulo: 'Introdução ao C++',
            conteudo: '<p>Primeiros passos com C++</p>',
            ordem: 1,
            conquista: {
              nome: 'Módulo 1 C++',
              descricao: 'Conquista do módulo 1 de C++',
              tipo: 'MODULO',
              xpGanho: 15
            }
          },
          {
            titulo: 'Sintaxe Básica',
            conteudo: '<p>Sintaxe fundamental do C++</p>',
            ordem: 2,
            conquista: {
              nome: 'Módulo 2 C++',
              descricao: 'Conquista do módulo 2 de C++',
              tipo: 'MODULO',
              xpGanho: 20
            }
          },
          {
            titulo: 'Classes e Objetos',
            conteudo: '<p>Programação orientada a objetos em C++</p>',
            ordem: 3,
            conquista: {
              nome: 'Módulo 3 C++',
              descricao: 'Conquista do módulo 3 de C++',
              tipo: 'MODULO',
              xpGanho: 25
            }
          },
          {
            titulo: 'Funções e Escopo',
            conteudo: '<p>Funções e gerenciamento de escopo</p>',
            ordem: 4,
            conquista: {
              nome: 'Módulo 4 C++',
              descricao: 'Conquista do módulo 4 de C++',
              tipo: 'MODULO',
              xpGanho: 30
            }
          }
        ],
        conquista: makeConquista('C++: Iniciante', 'TRILHA')
      });

      // Adicionando mais trilhas de exemplo
      await createTrilha({
        nome: 'JavaScript: Fundamentals',
        descricao: 'Trilha para aprender JavaScript do básico ao avançado',
        categoria: { id: categoriaId },
        modulos: [
          {
            titulo: 'Introdução ao JavaScript',
            conteudo: '<p>História e fundamentos do JavaScript</p>',
            ordem: 1,
            conquista: {
              nome: 'Módulo 1 JavaScript',
              descricao: 'Conquista do módulo 1 de JavaScript',
              tipo: 'MODULO',
              xpGanho: 15
            }
          },
          {
            titulo: 'Variáveis e Tipos',
            conteudo: '<p>Tipos de dados e declaração de variáveis</p>',
            ordem: 2,
            conquista: {
              nome: 'Módulo 2 JavaScript',
              descricao: 'Conquista do módulo 2 de JavaScript',
              tipo: 'MODULO',
              xpGanho: 20
            }
          },
          {
            titulo: 'Funções',
            conteudo: '<p>Declaração e uso de funções</p>',
            ordem: 3,
            conquista: {
              nome: 'Módulo 3 JavaScript',
              descricao: 'Conquista do módulo 3 de JavaScript',
              tipo: 'MODULO',
              xpGanho: 25
            }
          },
          {
            titulo: 'Objetos e Arrays',
            conteudo: '<p>Estruturas de dados em JavaScript</p>',
            ordem: 4,
            conquista: {
              nome: 'Módulo 4 JavaScript',
              descricao: 'Conquista do módulo 4 de JavaScript',
              tipo: 'MODULO',
              xpGanho: 30
            }
          },
          {
            titulo: 'DOM Manipulation',
            conteudo: '<p>Interação com o Document Object Model</p>',
            ordem: 5,
            conquista: {
              nome: 'Módulo 5 JavaScript',
              descricao: 'Conquista do módulo 5 de JavaScript',
              tipo: 'MODULO',
              xpGanho: 35
            }
          },
          {
            titulo: 'Async/Await e Promises',
            conteudo: '<p>Programação assíncrona em JavaScript</p>',
            ordem: 6,
            conquista: {
              nome: 'Módulo 6 JavaScript',
              descricao: 'Conquista do módulo 6 de JavaScript',
              tipo: 'MODULO',
              xpGanho: 40
            }
          }
        ],
        conquista: makeConquista('JavaScript: Fundamentals', 'TRILHA')
      });

      await createTrilha({
        nome: 'Python: Data Science',
        descricao: 'Trilha completa de Python para Ciência de Dados',
        categoria: { id: categoriaId },
        modulos: [
          {
            titulo: 'Python Básico',
            conteudo: '<p>Sintaxe e estruturas básicas do Python</p>',
            ordem: 1,
            conquista: {
              nome: 'Módulo 1 Python Data Science',
              descricao: 'Conquista do módulo 1 de Python Data Science',
              tipo: 'MODULO',
              xpGanho: 20
            }
          },
          {
            titulo: 'NumPy e Arrays',
            conteudo: '<p>Biblioteca NumPy para computação científica</p>',
            ordem: 2,
            conquista: {
              nome: 'Módulo 2 Python Data Science',
              descricao: 'Conquista do módulo 2 de Python Data Science',
              tipo: 'MODULO',
              xpGanho: 25
            }
          },
          {
            titulo: 'Pandas para Análise de Dados',
            conteudo: '<p>Manipulação e análise de dados com Pandas</p>',
            ordem: 3,
            conquista: {
              nome: 'Módulo 3 Python Data Science',
              descricao: 'Conquista do módulo 3 de Python Data Science',
              tipo: 'MODULO',
              xpGanho: 30
            }
          },
          {
            titulo: 'Matplotlib e Visualização',
            conteudo: '<p>Criação de gráficos e visualizações</p>',
            ordem: 4,
            conquista: {
              nome: 'Módulo 4 Python Data Science',
              descricao: 'Conquista do módulo 4 de Python Data Science',
              tipo: 'MODULO',
              xpGanho: 35
            }
          },
          {
            titulo: 'Scikit-learn e Machine Learning',
            conteudo: '<p>Introdução ao aprendizado de máquina</p>',
            ordem: 5,
            conquista: {
              nome: 'Módulo 5 Python Data Science',
              descricao: 'Conquista do módulo 5 de Python Data Science',
              tipo: 'MODULO',
              xpGanho: 40
            }
          }
        ],
        conquista: makeConquista('Python: Data Science', 'TRILHA')
      });

      await createTrilha({
        nome: 'React: Modern Web Development',
        descricao: 'Trilha completa de React para desenvolvimento web moderno',
        categoria: { id: categoriaId },
        modulos: [
          {
            titulo: 'React Fundamentos',
            conteudo: '<p>Componentes, props e state</p>',
            ordem: 1,
            conquista: {
              nome: 'Módulo 1 React',
              descricao: 'Conquista do módulo 1 de React',
              tipo: 'MODULO',
              xpGanho: 25
            }
          },
          {
            titulo: 'Hooks',
            conteudo: '<p>useState, useEffect e hooks personalizados</p>',
            ordem: 2,
            conquista: {
              nome: 'Módulo 2 React',
              descricao: 'Conquista do módulo 2 de React',
              tipo: 'MODULO',
              xpGanho: 30
            }
          },
          {
            titulo: 'Context API',
            conteudo: '<p>Gerenciamento de estado global</p>',
            ordem: 3,
            conquista: {
              nome: 'Módulo 3 React',
              descricao: 'Conquista do módulo 3 de React',
              tipo: 'MODULO',
              xpGanho: 35
            }
          },
          {
            titulo: 'React Router',
            conteudo: '<p>Navegação e roteamento em aplicações React</p>',
            ordem: 4,
            conquista: {
              nome: 'Módulo 4 React',
              descricao: 'Conquista do módulo 4 de React',
              tipo: 'MODULO',
              xpGanho: 40
            }
          },
          {
            titulo: 'Testing Library',
            conteudo: '<p>Testes unitários e de integração</p>',
            ordem: 5,
            conquista: {
              nome: 'Módulo 5 React',
              descricao: 'Conquista do módulo 5 de React',
              tipo: 'MODULO',
              xpGanho: 45
            }
          }
        ],
        conquista: makeConquista('React: Modern Web Development', 'TRILHA')
      });

      await createTrilha({
        nome: 'Database Design & SQL',
        descricao: 'Trilha completa de design de banco de dados e SQL',
        categoria: { id: categoriaId },
        modulos: [
          {
            titulo: 'Fundamentos de Banco de Dados',
            conteudo: '<p>Conceitos básicos e terminologia</p>',
            ordem: 1,
            conquista: {
              nome: 'Módulo 1 Database',
              descricao: 'Conquista do módulo 1 de Database',
              tipo: 'MODULO',
              xpGanho: 20
            }
          },
          {
            titulo: 'SQL Básico',
            conteudo: '<p>SELECT, INSERT, UPDATE, DELETE</p>',
            ordem: 2,
            conquista: {
              nome: 'Módulo 2 Database',
              descricao: 'Conquista do módulo 2 de Database',
              tipo: 'MODULO',
              xpGanho: 25
            }
          },
          {
            titulo: 'Normalização',
            conteudo: '<p>Formas normais e design de tabelas</p>',
            ordem: 3,
            conquista: {
              nome: 'Módulo 3 Database',
              descricao: 'Conquista do módulo 3 de Database',
              tipo: 'MODULO',
              xpGanho: 30
            }
          },
          {
            titulo: 'Joins e Relacionamentos',
            conteudo: '<p>Relacionamentos entre tabelas</p>',
            ordem: 4,
            conquista: {
              nome: 'Módulo 4 Database',
              descricao: 'Conquista do módulo 4 de Database',
              tipo: 'MODULO',
              xpGanho: 35
            }
          },
          {
            titulo: 'Índices e Performance',
            conteudo: '<p>Otimização de consultas</p>',
            ordem: 5,
            conquista: {
              nome: 'Módulo 5 Database',
              descricao: 'Conquista do módulo 5 de Database',
              tipo: 'MODULO',
              xpGanho: 40
            }
          }
        ],
        conquista: makeConquista('Database Design & SQL', 'TRILHA')
      });
      console.log('Trilhas criadas.');
      log.push('Trilhas criadas.');
      
      // Fazer logout do admin para que o usuário possa fazer login como aluno
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      log.push('\n=== POPULATE CONCLUÍDO ===');
      log.push('Admin criado: admin@sistema.com / admin123');
      log.push('Alunos criados:');
      log.push('- João: joao@teste.com / 123456');
      log.push('- Maria: maria@teste.com / 123456');
      log.push('- Pedro: pedro@teste.com / 123456');
      log.push('\n>>> RECOMENDAÇÃO: Faça login como um dos alunos para testar o sistema <<<');
      log.push('>>> Vá para /login e use um dos emails de aluno com senha 123456 <<<');
      
      setResult('Dados resetados e populados com sucesso!\n' + log.join('\n'));
    } catch (err) {
      console.error('Erro ao popular dados:', err);
      setResult('Erro ao popular dados: ' + (err?.response?.data?.message || err.message) + '\n' + log.join('\n'));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={handleResetAndPopulate}
        className="px-8 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 font-bold text-lg mb-4"
      >
        Resetar e Popular Dados de Teste
      </button>
      {result && <pre className="mt-4 text-lg font-semibold whitespace-pre-wrap">{result}</pre>}
    </div>
  );
}
