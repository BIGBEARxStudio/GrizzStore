import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './AppNew'
import './styles/global.scss'
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
