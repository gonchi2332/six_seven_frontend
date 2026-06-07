import { useState, useEffect, useRef } from 'react';
import { gitHubService } from '../services/githubService';

/*
  Características:
  -Hook personalizado que gestiona el perfil de GitHub del usuario
  -Carga automáticamente el perfil cuando cambia appUsername
  -Maneja estado de carga (isLoading), error y el nombre de usuario de GitHub
  -Usa useRef para evitar condiciones de carrera (evita actualizar estado con respuestas de usuarios anteriores)
  -saveProfile: actualiza el perfil de GitHub del usuario

  @ Parámetro: appUsername - Nombre de usuario de la aplicación (dueño del perfil)
  @ Retorna:
  -githubUser: Nombre de usuario de GitHub (null si no hay o no existe)
  -isLoading: Estado de carga
  -error: Mensaje de error (opcional)
  -saveProfile: Función para guardar/actualizar el perfil de GitHub

  @ Ejemplo:
  const { githubUser, isLoading, saveProfile } = useGitHub("juanperez");
  
  // Guardar nuevo perfil
  const result = await saveProfile("octocat");
  if (result.success) {
    console.log("Perfil actualizado");
  }
*/
export const useGitHub = (appUsername: string) => {
    const [githubUser, setGithubUser] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Guardar el username que se está cargando actualmente para evitar condiciones de carrera
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

    /*
      Actualiza el perfil de GitHub del usuario
      @ Parámetro: newGithubUser - Nuevo nombre de usuario de GitHub
      @ Retorna: Object con success (boolean) y message (string)
    */
    const saveProfile = async (newGithubUser: string) => {
        setError(null);
        try {
            const data = await gitHubService.updateProfile(newGithubUser);
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

