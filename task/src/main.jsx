import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Apply theme variables early to reduce flash of unthemed content
(function() {
  try {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const theme = stored || (prefersDark ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', theme)
  } catch (e) {
    void e
  }
})()

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
