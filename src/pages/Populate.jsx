import React, { useState } from 'react';
import { 
  setupPopulateAuth, 
  createAluno, 
  deleteUsuario, 
  getAlunos,
  createTrilha, 
  deleteTrilha, 
  getTrilhas,
  getCategorias,
  createCategoria,
  createProgresso,
  createUserConquista,
  createAdmin,
  checkAdminExists
} from '../services/adminApi';



export default function PopulatePage() {
  const [result, setResult] = useState('');

  const handleResetAndPopulate = async () => {
    let log = [];
    try {
      // Primeiro verificar se admin já existe
      console.log('Verificando se admin já existe...');
      log.push('Verificando se admin já existe...');
      
      const adminExists = await checkAdminExists('admin@teste.com');
      
      if (!adminExists) {
        console.log('Criando usuário admin para operações...');
        log.push('Criando usuário admin para operações...');
        try {
          await createAdmin({
            nome: 'Admin Teste',
            email: 'admin@teste.com',
            senha: 'admin123'
          });
          console.log('Admin criado com sucesso');
          log.push('Admin criado com sucesso');
        } catch (adminError) {
          console.log('Erro ao criar admin:', adminError.message);
          log.push('Erro ao criar admin: ' + adminError.message);
        }
      } else {
        console.log('Admin já existe, prosseguindo...');
        log.push('Admin já existe, prosseguindo...');
      }

      // Agora tentar configurar autenticação
      console.log('Configurando autenticação...');
      log.push('Configurando autenticação...');
      await setupPopulateAuth(); // Não falha se não conseguir autenticar
      console.log('Configuração concluída');
      log.push('Configuração concluída');

      // Apaga usuário pelo email se existir
      try {
        const alunos = await getAlunos();
        console.log('Alunos encontrados:', alunos.data);
        log.push('Alunos encontrados: ' + JSON.stringify(alunos.data));
        // Corrigido: buscar no array content
        const alunoArr = Array.isArray(alunos.data.content) ? alunos.data.content : [];
        const aluno = alunoArr.find(a => a.email === 'joao@teste.com');
        if (aluno) {
          console.log('Deletando usuário:', aluno);
          await deleteUsuario(aluno.id);
          console.log('Usuário deletado.');
          log.push('Usuário deletado.');
        } else {
          console.log('Usuário não encontrado para deletar.');
          log.push('Usuário não encontrado para deletar.');
        }
      } catch (e) {
        console.error('Erro ao buscar/deletar usuário:', e);
        log.push('Erro ao buscar/deletar usuário: ' + (e?.response?.data?.message || e.message));
      }
      // Apaga trilhas pelo nome se existirem
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
      console.log('Criando usuário...');
      log.push('Criando usuário...');
      await createAluno({
        nome: 'João Antonio A. B. Camilo',
        email: 'joao@teste.com',
        senha: '123456',
        xpTotal: 1370,
        nivel: 2
      });
      console.log('Usuário criado.');
      log.push('Usuário criado.');

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
      // Buscar IDs reais do usuário e trilhas
      const alunosNovos = await getAlunos();
      const alunoArrNovos = Array.isArray(alunosNovos.data.content) ? alunosNovos.data.content : [];
      const usuario = alunoArrNovos.find(a => a.email === 'joao@teste.com');
      if (!usuario) throw new Error('Usuário criado não encontrado!');
      const usuarioId = usuario.id;

      const trilhasNovas = await getTrilhas();
      const trilhaArrNovas = Array.isArray(trilhasNovas.data.content) ? trilhasNovas.data.content : [];
      const trilha1 = trilhaArrNovas.find(t => t.nome === 'C#: Iniciante');
      const trilha2 = trilhaArrNovas.find(t => t.nome === 'C++: Avançado');
      const trilha3 = trilhaArrNovas.find(t => t.nome === 'C++: Iniciante');
      const trilha4 = trilhaArrNovas.find(t => t.nome === 'JavaScript: Fundamentals');
      const trilha5 = trilhaArrNovas.find(t => t.nome === 'Python: Data Science');
      const trilha6 = trilhaArrNovas.find(t => t.nome === 'React: Modern Web Development');
      const trilha7 = trilhaArrNovas.find(t => t.nome === 'Database Design & SQL');
      
      if (!trilha1 || !trilha2 || !trilha3 || !trilha4 || !trilha5 || !trilha6 || !trilha7) {
        throw new Error('Trilhas criadas não encontradas!');
      }

      // Debug: log trilha IDs
      console.log('IDs das trilhas encontradas:', {
        trilha1: trilha1?.id,
        trilha2: trilha2?.id,
        trilha3: trilha3?.id,
        trilha4: trilha4?.id,
        trilha5: trilha5?.id,
        trilha6: trilha6?.id,
        trilha7: trilha7?.id
      });
      log.push('IDs das trilhas encontradas: ' + JSON.stringify({
        trilha1: trilha1?.id,
        trilha2: trilha2?.id,
        trilha3: trilha3?.id,
        trilha4: trilha4?.id,
        trilha5: trilha5?.id,
        trilha6: trilha6?.id,
        trilha7: trilha7?.id
      }));

      console.log('Criando progresso...');
      log.push('Criando progresso...');
      await createProgresso({ usuarioId, trilhaId: trilha1.id, percentual: 60, xpGanho: 65, xpTotal: 100 });
      await createProgresso({ usuarioId, trilhaId: trilha2.id, percentual: 40, xpGanho: 40, xpTotal: 100 });
      await createProgresso({ usuarioId, trilhaId: trilha3.id, percentual: 75, xpGanho: 90, xpTotal: 120 });
      await createProgresso({ usuarioId, trilhaId: trilha4.id, percentual: 30, xpGanho: 50, xpTotal: 165 });
      await createProgresso({ usuarioId, trilhaId: trilha5.id, percentual: 80, xpGanho: 120, xpTotal: 150 });
      await createProgresso({ usuarioId, trilhaId: trilha6.id, percentual: 20, xpGanho: 35, xpTotal: 175 });
      await createProgresso({ usuarioId, trilhaId: trilha7.id, percentual: 60, xpGanho: 90, xpTotal: 150 });
      console.log('Progresso criado.');
      log.push('Progresso criado.');
      // Conquistas
      console.log('Criando conquistas...');
      log.push('Criando conquistas...');
      // Usando as conquistas das trilhas criadas
      const conquistasParaCriar = [
        {
          trilha: trilha1,
          data: '2025-12-23T00:00:00',
        },
        {
          trilha: trilha2,
          data: '2025-06-17T00:00:00',
        },
        {
          trilha: trilha3,
          data: '2025-06-10T00:00:00',
        },
        {
          trilha: trilha4,
          data: '2025-01-05T00:00:00',
        },
        {
          trilha: trilha5,
          data: '2024-12-20T00:00:00',
        },
        {
          trilha: trilha6,
          data: '2024-11-15T00:00:00',
        },
        {
          trilha: trilha7,
          data: '2024-10-30T00:00:00',
        },
      ];
      for (const c of conquistasParaCriar) {
        if (!c.trilha.conquista || !c.trilha.conquista.id) {
          log.push('Conquista da trilha não encontrada para ' + c.trilha.nome);
          continue;
        }
        await createUserConquista({
          usuarioId,
          conquistaId: c.trilha.conquista.id,
          conquistaNome: c.trilha.conquista.nome,
          conquistaDescricao: c.trilha.conquista.descricao,
          conquistaTipo: c.trilha.conquista.tipo,
          conquistaTrilha: c.trilha.nome,
          conquistaXpGanho: c.trilha.conquista.xpGanho,
          dataConquista: c.data,
        });
      }
      console.log('Conquistas criadas.');
      log.push('Conquistas criadas.');
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
