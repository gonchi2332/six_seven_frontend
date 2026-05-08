import { useState, useEffect } from "react";
import type { EducationEntry } from "../services/educationService";
import {
    fetchEducation,
    createEducation,
    updateEducation,
    deleteEducation as apiDeleteEducation,
} from "../services/educationService";

export const useEducation = () => {
    const [entries, setEntries] = useState<EducationEntry[]>([]);
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
                const data = await fetchEducation();
                setEntries(data);
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
        } catch {
            throw new Error("Error al registrar experiencia académica");
        }
    };

    const editEntry = async (id: string, data: Omit<EducationEntry, "id">) => {
        try {
            const updated = await updateEducation(id, data);
            setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)));
            showSuccess("Experiencia académica modificada correctamente");
        } catch {
            throw new Error("Error al modificar experiencia académica");
        }
    };

    const deleteEntry = async (id: string) => {
        try {
            await apiDeleteEducation(id);
            setEntries((prev) => prev.filter((e) => e.id !== id));
            showSuccess("Experiencia académica eliminada correctamente");
        } catch {
            throw new Error("Error al eliminar experiencia académica");
        }
    };

    return { entries, isLoading, error, successMessage, addEntry, editEntry, deleteEntry };
};