import { useState, useEffect, useCallback } from "react";
import {
    getSoftSkills,
    deleteSoftSkill,
    fetchCatalogSoftSkills,
    fetchPublicSoftSkills,
} from "../services/softSkillService";
import type { SoftSkill } from "../services/softSkillService";
import { useAuthContext } from "../context/AuthContext";

export const useSoftSkills = () => {
    const { username } = useAuthContext();
    const [skills, setSkills] = useState<SoftSkill[]>([]);
    const [publicSkills, setPublicSkills] = useState<SoftSkill[]>([]);
    const [catalogSkills, setCatalogSkills] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoadingPublic, setIsLoadingPublic] = useState(false);
    const [currentPublicUsername, setCurrentPublicUsername] = useState<string | null>(null);

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const loadSkills = async () => {
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

    useEffect(() => {
        loadSkills();
    }, [username]);

    // useEffect para cargar skills públicas automáticamente cuando cambia currentPublicUsername
    useEffect(() => {
        const fetchPublicUserSoftSkills = async () => {
            if (!currentPublicUsername || currentPublicUsername.trim() === "") {
                setPublicSkills([]);
                setIsLoadingPublic(false);
                return;
            }

            setIsLoadingPublic(true);
            setError(null);
            try {
                const data = await fetchPublicSoftSkills(currentPublicUsername);
                setPublicSkills(data);
            } catch (err: unknown) {
                console.error(err);
                const errorMsg = err instanceof Error ? err.message : "Error al obtener habilidades blandas públicas";
                setError(errorMsg);
                setPublicSkills([]);
            } finally {
                setIsLoadingPublic(false);
            }
        };

        fetchPublicUserSoftSkills();
    }, [currentPublicUsername]);

    // Función pública para cambiar el usuario a visualizar
    const setPublicUser = useCallback((username: string | null) => {
        setCurrentPublicUsername(username);
    }, []);

    const addSkill = (name: string) => {
        setSkills((prev) => [...prev, { name, visible: true, skill_id: "" }]);
        showSuccess("Habilidad registrada correctamente");
    };

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

export const usePublicSoftSkills = (username: string | undefined) => {
    const [skills, setSkills] = useState<SoftSkill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
