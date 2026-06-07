import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
    token: string | null;
    username: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Extrae el username del payload del token JWT
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Inicializa desde localStorage para persistir sesión entre recargas
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

// Lanza error si se usa fuera del AuthProvider
export const useAuthContext = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
    return ctx;
};