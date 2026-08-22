import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './a11y.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary fallbackTitle="The portfolio failed to render"><App /></ErrorBoundary>
  </StrictMode>,
)
