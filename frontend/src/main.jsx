import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './i18n'; // This ensures i18n is initialized before App is rendered
import App from './App.jsx'
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
