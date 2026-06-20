import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from "./routes/index"
import { AuthProvider } from "./context/AuthContext"

// Punto de entrada principal de la aplicación
// StrictMode: detecta problemas potenciales
// AuthProvider: provee autenticación global
// Router: maneja todas las rutas de la app
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <Router />
        </AuthProvider>
    </StrictMode>,
)