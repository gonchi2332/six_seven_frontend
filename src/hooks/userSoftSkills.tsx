import { useState, useEffect } from 'react';
import { getSoftSkills, 
        createSoftSkill, 
        updateSoftSkill, 
        deleteSoftSkill } from '../services/softSkillService';
import type { SoftSkill } from '../services/softSkillService';


import { useAuthContext } from '../context/AuthContext';


export const useSoftSkills = () => {
    const { username } = useAuthContext();
    const [skills, setSkills] = useState<SoftSkill[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    
    const validateSkillName = (skillname: string | null): string => {
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(skillname || '')) return "Solo letras y espacios";
        if (skillname && skillname.length > 50) return "Máximo 50 caracteres";

        return '';
    };

    // Cargar habilidades blandas desde el backend
    const loadSkills = async () => {
        if (!username) {
            setSkills([]);
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
        setError(null);
        try {
            const data = await getSoftSkills(username);
            setSkills(data);
        } catch (err: any) {
            setError(err.message || 'Error al cargar habilidades blandas');
            setSkills([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSkills();
    }, [username]);

    // Agregar habilidad blanda
    const addSkill = async (skillName: string): Promise<void> => {
        setError(null);


         const validationError = validateSkillName(skillName);
        if (validationError) {
            setError(validationError);
            throw new Error(validationError);
        }

        try {
            await createSoftSkill({ skillName });
            // Recargar lista después de agregar
            await loadSkills();
        } catch (err: any) {
            setError(err.message || 'Error al agregar la habilidad');
            throw err;
        }
    };

    // Actualizar habilidad blanda
    const editSkill = async (oldSkillName: string, newSkillName: string): Promise<void> => {
        setError(null);
        if (oldSkillName === newSkillName) return;
         const validationError = validateSkillName(newSkillName);
        if (validationError) {
            setError(validationError);
            throw new Error(validationError);
        }
        try {
            await updateSoftSkill({ oldSkillName, newSkillName });
            await loadSkills();
        } catch (err: any) {
            setError(err.message || 'Error al modificar la habilidad');
            throw err;
        }
    };

    // Eliminar habilidad blanda
    const removeSkill = async (skillName: string): Promise<void> => {
        setError(null);
        try {
            await deleteSoftSkill({ skillName });
            await loadSkills();
        } catch (err: any) {
            setError(err.message || 'Error al eliminar la habilidad');
            throw err;
        }
    };

    return {
        skills,
        isLoading,
        error,
        addSkill,
        editSkill,
        removeSkill,
        reloadSkills: loadSkills,
        validateSkillName
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
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [username]);

    return { skills, isLoading, error };
};