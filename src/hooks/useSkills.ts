import { useState, useEffect } from "react";
import type { Skill } from "../features/skills/types/skill.types";
import { fetchSkills, patchSkill, deleteSkill as apiDeleteSkill, fetchCatalogSkills } from "../services/skillsService";

export const useSkills = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [catalogSkills, setCatalogSkills] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const showError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 3000);
    };

    useEffect(() => {
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
                    // Evita el false falso forzando la evaluación estricta
                    visible: s.visible === true || s.visible === 1 || String(s.visible) === "true"
                }));

                setSkills(formattedSkills);
                setCatalogSkills(catalog);
            } catch (err) {
                console.error(err);
                showError("No se pudieron cargar las habilidades");
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const addSkill = (name: string, level: number) => {
        const tempId = Date.now(); // ID temporal numérico para cumplir con la interfaz Skill
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
            // 🔑 TU SERVICIO NECESITA EL NOMBRE: Se lo mandamos correctamente
            await patchSkill(name, level);
            
            // Modificamos el estado local de React buscando por el skill_id del tipo
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
            // Buscamos la habilidad local antes de borrarla para obtener su nombre real
            const targetSkill = skills.find(s => s.skill_id === Number(skillId));
            const identifierForApi = targetSkill ? targetSkill.name : String(skillId);

            // 🔑 TU SERVICIO NECESITA EL NOMBRE (ej: "React") para ejecutar el DELETE:
            await apiDeleteSkill(identifierForApi);
            
            // Filtramos en la UI usando el skill_id numérico
            setSkills((prev) => prev.filter((s) => s.skill_id !== Number(skillId)));
            showSuccess("Habilidad eliminada correctamente");
        } catch (err) {
            throw err;
        }
    };

    return { skills, catalogSkills, isLoading, error, successMessage, addSkill, editSkill, deleteSkill };
};