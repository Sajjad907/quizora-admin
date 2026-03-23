import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Shopify App Bridge configuration will be handled inside App.jsx 
// to allow for dynamic detection and conditional wrapping.

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
