import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Home from './pages/Home'
import { store } from './store'
import UserDrawer from './components/UserDrawer'



export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <UserDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </Provider>
  )
}