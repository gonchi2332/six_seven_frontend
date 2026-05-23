import { useState, useEffect } from "react";
import {
    getSoftSkills,
    deleteSoftSkill,
    fetchCatalogSoftSkills,
} from "../services/softSkillService";
import type { SoftSkill } from "../services/softSkillService";
import { useAuthContext } from "../context/AuthContext";

export const useSoftSkills = () => {
    const { username } = useAuthContext();
    const [skills, setSkills] = useState<SoftSkill[]>([]);
    const [catalogSkills, setCatalogSkills] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

    const addSkill = (name: string) => {
        setSkills((prev) => [...prev, { name, visible:true, skill_id:"" }]);
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