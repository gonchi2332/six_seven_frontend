// hooks/useSoftSkills.ts
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
    getSoftSkills,
    deleteSoftSkill,
    fetchCatalogSoftSkills,
    fetchPublicSoftSkills,
} from "../services/softSkillService";
import type { SoftSkill } from "../services/softSkillService";
import { useAuthContext } from "../../../context/AuthContext";

// Hook principal para manejar habilidades blandas del usuario autenticado
export const useSoftSkills = () => {
    const { username: publicUsernameUrl } = useParams<{ username: string }>();
    const { username } = useAuthContext();

    const [skills, setSkills] = useState<SoftSkill[]>([]);
    const [publicSkills, setPublicSkills] = useState<SoftSkill[]>([]);
    const [catalogSkills, setCatalogSkills] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoadingPublic, setIsLoadingPublic] = useState(false);
    const [currentPublicUsername, setCurrentPublicUsername] = useState<string | null>(null);

    // Mostrar mensaje de exito temporal
    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    // Cargar habilidades del usuario y catalogo
    const loadSkills = async () => {
        if (publicUsernameUrl) {
            setIsLoading(false);
            return;
        }
        if (!username) {
            setSkills([]);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const [data, catalog] = await Promise.all([
                getSoftSkills(username),
                fetchCatalogSoftSkills(),
            ]);
            setSkills(data);
            setCatalogSkills(catalog);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al cargar habilidades blandas");
            setSkills([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar habilidades al cambiar usuario o ruta
    useEffect(() => {
        loadSkills();
    }, [username, publicUsernameUrl]);

    // Cargar habilidades publicas al cambiar el usuario seleccionado
    useEffect(() => {
        if (!currentPublicUsername || currentPublicUsername.trim() === "") {
            setPublicSkills([]);
            setIsLoadingPublic(false);
            return;
        }

        const fetchPublicUserSoftSkills = async () => {
            setIsLoadingPublic(true);
            setError(null);
            try {
                const data = await fetchPublicSoftSkills(currentPublicUsername);
                setPublicSkills(data);
            } catch (err: unknown) {
                const errorMsg = err instanceof Error ? err.message : "Error al obtener habilidades blandas públicas";
                setError(errorMsg);
                setPublicSkills([]);
            } finally {
                setIsLoadingPublic(false);
            }
        };

        fetchPublicUserSoftSkills();
    }, [currentPublicUsername]);

    // Establecer el usuario para ver sus habilidades publicas
    const setPublicUser = useCallback((username: string | null) => {
        setCurrentPublicUsername(username);
    }, []);

    // Agregar una habilidad a la lista local
    const addSkill = (name: string) => {
        setSkills((prev) => [...prev, { name, visible: true, skill_id: "" }]);
        showSuccess("Habilidad registrada correctamente");
    };

    // Eliminar una habilidad por nombre
    const removeSkill = async (skillName: string): Promise<void> => {
        setError(null);
        try {
            await deleteSoftSkill({ skillName });
            setSkills((prev) => prev.filter((s) => s.name !== skillName));
            showSuccess("Habilidad eliminada correctamente");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al eliminar la habilidad");
            throw err;
        }
    };

    return {
        skills,
        catalogSkills,
        isLoading,
        error,
        successMessage,
        username: username ?? "",
        addSkill,
        removeSkill,
        reloadSkills: loadSkills,
        publicSkills,
        isLoadingPublic,
        setPublicUser,
        currentPublicUsername,
    };
};

// Hook para ver habilidades blandas publicas de un usuario especifico
export const usePublicSoftSkills = (username: string | undefined) => {
    const [skills, setSkills] = useState<SoftSkill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar habilidades publicas al montar o cambiar el username
    useEffect(() => {
        const load = async () => {
            if (!username) return;
            setIsLoading(true);
            try {
                const data = await getSoftSkills(username);
                setSkills(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Error");
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [username]);

    return { skills, isLoading, error };
};