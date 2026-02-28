import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// ✅ Hide native loading screen setelah React mount
// Mencegah blank screen saat pertama kali load
function hideNativeLoader() {
  if (typeof window !== 'undefined' && (window as any).__hideAppLoading) {
    (window as any).__hideAppLoading();
  }
}

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

// Hide loader setelah React render pertama
hideNativeLoader();
