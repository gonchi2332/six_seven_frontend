import { useState, useEffect } from 'react';
import { getSoftSkills, 
        createSoftSkill, 
        updateSoftSkill, 
        deleteSoftSkill } from '../services/softSkillService';
import type { SoftSkill } from '../services/softSkillService';


export const useSoftSkills = () => {
    const [skills, setSkills] = useState<SoftSkill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Obtener username del localStorage (se guarda al hacer login)
    const getUsername = (): string | null => {
        return localStorage.getItem('username');
    };

    // Cargar habilidades blandas desde el backend
    const loadSkills = async () => {
        setIsLoading(true);
        setError(null);
        const username = getUsername();
        if (!username) {
            setError('Usuario no identificado');
            setIsLoading(false);
            return;
        }
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
    }, []);

    // Agregar habilidad blanda
    const addSkill = async (skillName: string): Promise<void> => {
        setError(null);
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
    };
};