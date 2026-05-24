import { useState, useEffect } from 'react';
import { gitHubService } from '../services/githubService';

export const useGitHub = (appUsername: string) => {
    const [githubUser, setGithubUser] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!appUsername) return;
            setIsLoading(true);
            setError(null);
            try {
                const data = await gitHubService.getProfile(appUsername);
                // Asumiendo que la respuesta tiene la misma estructura que LinkedIn
                if (data.success) {
                    setGithubUser(data.githubUsername ?? null);
                } else {
                    setError(data.message ?? "Error al cargar perfil de GitHub");
                }
            } catch (err: any) {
                setError(err.message || "Error al cargar perfil de GitHub");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [appUsername]);

    const saveProfile = async (newGithubUser: string, token: string) => {
        setError(null);
        try {
            const data = await gitHubService.updateProfile(newGithubUser, token);
            if (data.success) {
                setGithubUser(newGithubUser);
                return { success: true, message: data.message };
            }
            return { success: false, message: data.message ?? "Error al actualizar perfil" };
        } catch (err: any) {
            return { success: false, message: err.message || "Error de red" };
        }
    };

    return { githubUser, isLoading, error, saveProfile };
};