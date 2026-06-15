import React from 'react'
import ReactDOM from 'react-dom/client'

// Esto es un componente básico para que la app no esté vacía
const App = () => <h1>¡Hola, mi aplicación funciona!</h1>;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)