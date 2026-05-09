import { useState, useEffect } from "react";
import type { EducationEntry, AcademicDegree } from "../services/educationService";
import {
    fetchEducation,
    fetchAcademicDegrees,
    createEducation,
    updateEducation,
    deleteEducation as apiDeleteEducation,
} from "../services/educationService";

export const useEducation = () => {
    const [entries, setEntries] = useState<EducationEntry[]>([]);
    const [academicDegrees, setAcademicDegrees] = useState<AcademicDegree[]>([]);
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
                const [data, degrees] = await Promise.all([
                    fetchEducation(),
                    fetchAcademicDegrees(),
                ]);
                setEntries(data);
                setAcademicDegrees(degrees);
            } catch {
                showError("No se pudieron cargar las experiencias académicas");
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const addEntry = async (data: Omit<EducationEntry, "id">) => {
        try {
            const created = await createEducation(data);
            setEntries((prev) => [...prev, created]);
            showSuccess("Experiencia académica registrada correctamente");
        } catch (err: unknown) {
            throw new Error(err instanceof Error ? err.message : "Error al registrar experiencia académica");
        }
    };

    const editEntry = async (id: string, data: Omit<EducationEntry, "id">) => {
        try {
            const updated = await updateEducation(id, data);
            setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)));
            showSuccess("Experiencia académica modificada correctamente");
        } catch (err: unknown) {
            throw new Error(err instanceof Error ? err.message : "Error al modificar experiencia académica");
        }
    };

    const deleteEntry = async (id: string) => {
        try {
            await apiDeleteEducation(id);
            setEntries((prev) => prev.filter((e) => e.id !== id));
            showSuccess("Experiencia académica eliminada correctamente");
        } catch (err: unknown) {
            throw new Error(err instanceof Error ? err.message : "Error al eliminar experiencia académica");
        }
    };

    return { entries, academicDegrees, isLoading, error, successMessage, addEntry, editEntry, deleteEntry };
};