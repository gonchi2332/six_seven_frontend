import { useState, useEffect, useRef } from 'react';
import { gitHubService } from '../services/githubService';

export const useGitHub = (appUsername: string) => {
    const [githubUser, setGithubUser] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Guardar el username que se está cargando actualmente
    const currentUsernameRef = useRef<string | null>(null);

    useEffect(() => {
        // Limpiar estado anterior cuando cambia el usuario
        if (currentUsernameRef.current !== appUsername) {
            setGithubUser(null);
            setError(null);
            currentUsernameRef.current = appUsername;
        }

        const fetchProfile = async () => {
            if (!appUsername) {
                setGithubUser(null);
                setIsLoading(false);
                return;
            }
            
            setIsLoading(true);
            setError(null);
            
            try {
                const data = await gitHubService.getProfile(appUsername);
                // Verificar que la respuesta corresponda al usuario actual
                if (currentUsernameRef.current === appUsername) {
                    if (data.success) {
                        setGithubUser(data.githubUsername ?? null);
                    } else {
                        setGithubUser(null);
                        if (data.message && !data.message.includes("no tiene")) {
                            setError(data.message);
                        }
                    }
                }
            } catch (err: any) {
                if (currentUsernameRef.current === appUsername) {
                    setGithubUser(null);
                    // No mostrar error si simplemente no tiene perfil
                    if (!err.message?.includes("no tiene") && !err.message?.includes("not found")) {
                        setError(err.message || "Error al cargar perfil de GitHub");
                    }
                }
            } finally {
                if (currentUsernameRef.current === appUsername) {
                    setIsLoading(false);
                }
            }
        };

        fetchProfile();
    }, [appUsername]);

    const saveProfile = async (newGithubUser: string, token: string) => {
        setError(null);
        try {
            const data = await gitHubService.updateProfile(newGithubUser, token);
            if (data.success) {
                // Solo actualizar si el usuario no cambió mientras se guardaba
                if (currentUsernameRef.current === appUsername) {
                    setGithubUser(newGithubUser);
                }
                return { success: true, message: data.message };
            }
            return { success: false, message: data.message ?? "Error al actualizar perfil" };
        } catch (err: any) {
            return { success: false, message: err.message || "Error de red" };
        }
    };

    return { githubUser, isLoading, error, saveProfile };
};