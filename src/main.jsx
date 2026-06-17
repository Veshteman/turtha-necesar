import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import NecesarTurtha from './necesar-turtha.jsx'

// Adaptor storage: traducere din apelurile aplicatiei catre localStorage real
window.storage = {
  get: async (key) => {
    try {
      const value = localStorage.getItem(key);
      return value ? { key, value } : null;
    } catch { return null; }
  },
  set: async (key, value) => {
    try {
      localStorage.setItem(key, value);
      return { key, value };
    } catch { return null; }
  },
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NecesarTurtha />
  </StrictMode>
)