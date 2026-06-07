import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from "./routes/index"
import { AuthProvider } from "./context/AuthContext"

/*
  Características:
  -Punto de entrada principal de la aplicación React
  -Configura el StrictMode para detectar problemas potenciales
  -Envuelve la aplicación con AuthProvider para gestionar autenticación global
  -Renderiza el Router que contiene todas las rutas de la aplicación
  -Inyecta la aplicación en el elemento root del DOM

  @ Ejemplo:
  // Se ejecuta automáticamente al iniciar la aplicación
  // No requiere uso manual
*/
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <Router />
        </AuthProvider>
    </StrictMode>,
)
