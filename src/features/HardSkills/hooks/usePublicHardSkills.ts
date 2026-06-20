import { useState, useEffect } from "react";
import type { Skill } from "../types/skill.types";
import { fetchSkillsPublicNew } from "../services/skillsService";

// Hook para cargar habilidades técnicas públicas (portafolio visible)
export const usePublicHardSkills = (username: string | undefined) => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!username) return;
            setIsLoading(true);
            try {
                const response = await fetchSkillsPublicNew(username);
                // Extraer habilidades duras de la respuesta (puede venir en diferentes estructuras)
                const rawSkills = response?.data?.hardSkills ?? response?.skills ?? response?.data ?? [];
                setSkills(
                    rawSkills.map((s: { name: string; punctuation?: number; level?: number }, index: number) => ({
                        skill_id: index,
                        name: s.name,
                        level: s.punctuation ?? s.level ?? 0,
                        visible: true,
                    }))
                );
            } catch {
                setError("No se pudieron cargar las habilidades técnicas");
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [username]);

    return { skills, isLoading, error };
};

