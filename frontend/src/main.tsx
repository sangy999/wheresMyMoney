import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Apply theme on initial load before React renders
const savedTheme = localStorage.getItem('theme');
const validThemes = ['light', 'dark', 'blue', 'green', 'purple', 'orange'];
const theme = (savedTheme && validThemes.includes(savedTheme)) ? savedTheme : 'dark';
document.documentElement.setAttribute('data-theme', theme);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

