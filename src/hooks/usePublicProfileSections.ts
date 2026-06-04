// hooks/useSectionsVisibility.ts
import { useState, useEffect } from "react";
import { fetchPublicSectionsVisibility, type PublicSectionsVisibility } from "../services/publicProfileSectionsService";

// Hook para obtener la visibilidad de secciones de un perfil publico
export const useSectionsVisibility = (username: string | undefined, isPublic: boolean) => {
    const [visibility, setVisibility] = useState<PublicSectionsVisibility | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar visibilidad cuando el perfil es publico y hay username
    useEffect(() => {
        if (!isPublic || !username) {
            return;
        }

        const loadVisibility = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchPublicSectionsVisibility(username);
                setVisibility(data);
            } catch (err: any) {
                setError(err.message || "No se pudo cargar la visibilidad del portafolio");
                console.error("Error en useSectionsVisibility:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadVisibility();
    }, [username, isPublic]);

    return { visibility, isLoading, error };
};