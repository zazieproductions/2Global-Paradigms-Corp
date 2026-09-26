import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ArgProvider } from './arg/ArgContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArgProvider>
      <App />
    </ArgProvider>
  </StrictMode>,
)
