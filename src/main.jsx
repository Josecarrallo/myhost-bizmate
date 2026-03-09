import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import PublicSite from './components/PublicSite/PublicSite.jsx'
import PublicVoicePage from './components/PublicVoice/PublicVoicePage.jsx'
import TestMasterCalendar from './components/TestMasterCalendar.jsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public site route */}
          <Route path="/site/:slug" element={<PublicSite />} />

          {/* Public voice assistant route - for guests to speak with KORA */}
          <Route path="/voice" element={<PublicVoicePage />} />

          {/* TEMPORAL: Test Master Calendar - BORRAR ANTES DE PRODUCCIÓN */}
          <Route path="/test-calendar" element={<TestMasterCalendar />} />

          {/* Main app route */}
          <Route path="/*" element={<App />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
