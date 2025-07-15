import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

// MSW removido - usando APIs reais do backend
// if (import.meta.env.MODE === 'development') {
//   import('./mocks/browser').then(({ worker }) => worker.start());
// }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
)