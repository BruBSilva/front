# ProjetoPOO2 - Frontend

Interface web do ProjetoPOO2, desenvolvida em React com Vite.  
Este guia ensina do zero como instalar e rodar o projeto no ambiente local.

---

## 🚀 Pré-requisitos

Antes de tudo, você precisa ter instalado:

- **Node.js** v22.13.1  
- **npm** v11.4.2 (vem junto com o Node)

Para verificar se já tem:

```bash
node -v
npm -v
````

Se não tiver, baixe do site oficial: [https://nodejs.org](https://nodejs.org)

---

## 🧱 Instalação

1. **Clone o repositório**

```bash
git clone git@github.com:vitoriasilva13/front.git
cd front
```

2. **Instale as dependências**

```bash
npm install
```

Isso vai baixar todas as bibliotecas necessárias listadas no `package.json`.

---

## 💻 Rodando o projeto localmente

Depois de instalar tudo:

```bash
npm run dev
```

Esse comando vai iniciar o servidor local.
Abra no navegador o link que aparecer no terminal, geralmente:

```
http://localhost:5173/
```

---

## 📁 Estrutura do projeto (básica)

```
front/
├── public/           # arquivos estáticos
├── src/
│   ├── components/   # componentes reutilizáveis
│   ├── pages/        # páginas principais
│   └── App.jsx       # componente principal
├── package.json
└── vite.config.js
```

---

## 🛠 Scripts úteis

```bash
npm run dev       # inicia o servidor de desenvolvimento
npm run build     # gera a versão final para produção
npm run preview   # visualiza o build localmente
```

---

## 🧠 Dica

* Se algo der erro no `npm install`, tente apagar a pasta `node_modules` e o arquivo `package-lock.json`, depois instale de novo:

```bash
rm -rf node_modules package-lock.json
npm install
```

---


## 🐦‍⬛ Corvis

Este projeto é guiado por nosso corvo sábio.

---
