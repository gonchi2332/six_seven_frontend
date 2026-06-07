import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

/*
  Tipo que define la estructura del contexto de autenticación:
  -token: Token JWT del usuario autenticado (null si no hay sesión)
  -username: Nombre de usuario extraído del token
  -login: Función para iniciar sesión, recibe el token JWT
  -logout: Función para cerrar sesión, limpia token y username
  -isAuthenticated: Booleano que indica si hay un token válido
*/
interface AuthContextType {
    token: string | null;
    username: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

/*
  Caracteristicas:
  -Contexto de autenticación para compartir el estado de sesión en toda la aplicación.
  -Inicialmente es null, y se provee un valor en el componente AuthProvider.
*/
const AuthContext = createContext<AuthContextType | null>(null);

/*
  Caracteristicas:
  -Extrae el nombre de usuario desde un token JWT.
  -Divide el token por "." y toma la segunda parte (payload), la decodifica en base64 (atob) y extrae la propiedad username. Si algo falla en el proceso, retorna null.
    @ Parámetro: token - Token JWT o null
    @ Retorna: Nombre de usuario o null si no existe o hay error
*/
const getUsernameFromToken = (token: string | null): string | null => {
    if (!token) return null;
    try {
        const part = token.split(".").at(1);
        if (!part) return null;
        const payload = JSON.parse(atob(part));
        return payload.username ?? null;
    } catch {
        return null;
    }
};

/*
  Caracteristicas:
  -Proveedor de autenticación que envuelve la aplicación.
  -Inicializa token y username desde localStorage al montar el componente.
    @ login: guarda el token en localStorage, extrae el username y actualiza el estado
    @ logout: elimina token y username de localStorage, limpia el estado
    @ isAuthenticated es true si existe un token

  Ejemplo de uso en App.tsx:
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>

  -Para acceder al contexto desde cualquier componente: const { token, login, logout, isAuthenticated } = useAuthContext();
*/
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem("token")
    );

    const [username, setUsername] = useState<string | null>(() => 
        getUsernameFromToken(localStorage.getItem("token"))
    );

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        const newUsername = getUsernameFromToken(newToken);
        if (newUsername) {
            localStorage.setItem("username", newUsername);
        }
        setToken(newToken);
        setUsername(newUsername);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setToken(null);
        setUsername(null);
    };

    return (
        <AuthContext.Provider value={{
            token,
            username,
            login,
            logout,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
};

/*
  Caracteristicas:
  -Hook personalizado para acceder al contexto de autenticación.
  -Si se usa fuera de AuthProvider, lanza un error.
  -Retorna el contexto de autenticación (token, username, login, logout, isAuthenticated).

  Ejemplo de uso:
  const { token, logout, isAuthenticated } = useAuthContext();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
*/
export const useAuthContext = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
    return ctx;
};