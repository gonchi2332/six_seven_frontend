import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from "./routes/index"
import { AuthProvider } from "./context/AuthContext"

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <Router />
        </AuthProvider>
    </StrictMode>,
)
