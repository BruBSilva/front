import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Home from './pages/Home'
import { store } from './store'
import UserDrawer from './components/UserDrawer'

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(true)

  return (
    <Provider store={store}>
      <Router>
        <div className="flex h-screen">
          <div className="flex-1 relative">
            {!drawerOpen && (
              <button
                onClick={() => setDrawerOpen(true)}
                className="fixed right-5 top-5 z-50 bg-white text-black px-1 py-1.5 rounded-xl shadow-lg hover:bg-gray-200 transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}
            <Routes>
              <Route path="/" element={<Home />} />
              {/* outras rotas aqui se quiser */}
            </Routes>
          </div>
          <div className={`transition-all duration-300 ${drawerOpen ? 'w-80' : 'w-0 overflow-hidden'}`}>
            <UserDrawer open={drawerOpen} setOpen={setDrawerOpen} />
          </div>
        </div>
      </Router>
    </Provider>
  )
}
