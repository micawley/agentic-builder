import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { BuilderProvider } from './store/BuilderContext'
import './styles/global.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <BuilderProvider>
        <App />
      </BuilderProvider>
    </BrowserRouter>
  </StrictMode>,
)
