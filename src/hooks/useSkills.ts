import { useState, useEffect, useCallback } from "react";
import type { Skill } from "../features/skills/types/skill.types";
import { fetchSkills, patchSkill, deleteSkill as apiDeleteSkill, fetchCatalogSkills, fetchSkillsPublicNew } from "../services/skillsService";
import { useParams } from "react-router-dom";

export const useSkills = () => {
    const { username: publicUsernameUrl } = useParams<{ username: string }>();

    const [skills, setSkills] = useState<Skill[]>([]);
    const [catalogSkills, setCatalogSkills] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [publicSkills, setPublicSkills] = useState<Skill[]>([]);
    const [isLoadingPublic, setIsLoadingPublic] = useState(false);
    const [currentPublicUsername, setCurrentPublicUsername] = useState<string | null>(null);

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const showError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 3000);
    };

    useEffect(() => {
        if (publicUsernameUrl) {
            setIsLoading(false);
            return;
        }

        const load = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [data, catalog] = await Promise.all([fetchSkills(), fetchCatalogSkills()]);
                const list = data.skills ?? [];

                const formattedSkills: Skill[] = list.map((s: any) => ({
                    skill_id: Number(s.skill_id),
                    name: s.name,
                    level: s.punctuation ?? s.level,
                    visible: s.visible === true || s.visible === 1 || String(s.visible) === "true"
                }));

                setSkills(formattedSkills);
                setCatalogSkills(catalog);
            } catch (err) {
                showError("No se pudieron cargar las habilidades");
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [publicUsernameUrl]);

    useEffect(() => {
        if (!currentPublicUsername || currentPublicUsername.trim() === "") {
            setPublicSkills([]);
            setIsLoadingPublic(false);
            return;
        }

        const fetchPublicUserSkills = async () => {
            setIsLoadingPublic(true);
            setError(null);
            try {
                const response = await fetchSkillsPublicNew(currentPublicUsername);
                const rawSkills = response?.data?.hardSkills ?? response?.skills ?? response?.data ?? [];

                const formattedSkills: Skill[] = rawSkills.map((s: any, index: number) => ({
                    skill_id: s.id ?? s.skill_id ?? index,
                    name: s.name,
                    level: s.level ?? s.punctuation ?? 0,
                    visible: true
                }));

                setPublicSkills(formattedSkills);
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : "Error al obtener habilidades públicas del usuario";
                showError(errorMsg);
                setPublicSkills([]);
            } finally {
                setIsLoadingPublic(false);
            }
        };

        fetchPublicUserSkills();
    }, [currentPublicUsername]);

    const setPublicUser = useCallback((username: string | null) => {
        setCurrentPublicUsername(username);
    }, []);

    const addSkill = (name: string, level: number) => {
        const tempId = Date.now();
        const newSkill: Skill = {
            skill_id: tempId,
            name,
            level,
            visible: true
        };

        setSkills((prev) => [...prev, newSkill]);
        showSuccess("Habilidad registrada correctamente");
    };

    const editSkill = async (skillId: number | string, name: string, level: number) => {
        try {
            await patchSkill(name, level);
            setSkills((prev) =>
                prev.map((s) => (s.skill_id === Number(skillId) ? { ...s, name, level } : s))
            );
            showSuccess("Habilidad modificada correctamente");
        } catch (err) {
            throw err;
        }
    };

    const deleteSkill = async (skillId: number | string) => {
        try {
            const targetSkill = skills.find(s => s.skill_id === Number(skillId));
            const identifierForApi = targetSkill ? targetSkill.name : String(skillId);
            await apiDeleteSkill(identifierForApi);
            setSkills((prev) => prev.filter((s) => s.skill_id !== Number(skillId)));
            showSuccess("Habilidad eliminada correctamente");
        } catch (err) {
            throw err;
        }
    };

    return {
        skills,
        catalogSkills,
        isLoading,
        error,
        successMessage,
        addSkill,
        editSkill,
        deleteSkill,
        publicSkills,
        isLoadingPublic,
        setPublicUser,
        currentPublicUsername
    };
};
