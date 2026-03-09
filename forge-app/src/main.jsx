import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { CoachProvider } from './context/CoachContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CoachProvider>
          <App />
        </CoachProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
