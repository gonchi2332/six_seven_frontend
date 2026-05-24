import { useState, useEffect, useCallback } from "react";
import type { EducationEntry, AcademicDegree } from "../services/educationService";
import {
    fetchEducation,
    fetchPublicEducation,
    fetchAcademicDegrees,
    createEducation,
    updateEducation,
    deleteEducation as apiDeleteEducation,
} from "../services/educationService";

export const useEducation = () => {
    const [entries, setEntries] = useState<EducationEntry[]>([]);
    const [publicEntries, setPublicEntries] = useState<EducationEntry[]>([]);
    const [academicDegrees, setAcademicDegrees] = useState<AcademicDegree[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPublic, setIsLoadingPublic] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [publicError, setPublicError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [currentPublicUsername, setCurrentPublicUsername] = useState<string | null>(null);

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const showError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 3000);
    };

    // Carga de datos privados (autenticado)
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
                showError("No se pudieron cargar las formaciones académicas");
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    // useEffect para cargar formaciones públicas automáticamente cuando cambia currentPublicUsername
    useEffect(() => {
        const fetchPublicUserEducation = async () => {
            if (!currentPublicUsername || currentPublicUsername.trim() === "") {
                setPublicEntries([]);
                setIsLoadingPublic(false);
                return;
            }

            setIsLoadingPublic(true);
            setPublicError(null);
            try {
                const data = await fetchPublicEducation(currentPublicUsername);
                setPublicEntries(data);
            } catch (err: any) {
                console.error(err);
                // No mostrar error de autenticación en vista pública
                if (!err.message?.includes("token") && !err.message?.includes("autenticacion") && !err.message?.includes("Authorization")) {
                    setPublicError(err.message || 'Error al obtener formaciones académicas públicas');
                }
                setPublicEntries([]);
            } finally {
                setIsLoadingPublic(false);
            }
        };

        fetchPublicUserEducation();
    }, [currentPublicUsername]);

    // Función pública para cambiar el usuario a visualizar
    const setPublicUser = useCallback((username: string | null) => {
        setCurrentPublicUsername(username);
    }, []);

    const addEntry = async (data: Omit<EducationEntry, "id">) => {
        try {
            const updated = await createEducation(data);
            setEntries(updated);
            showSuccess("Formación académica registrada correctamente");
        } catch (err: unknown) {
            throw new Error(err instanceof Error ? err.message : "Error al registrar formación académica");
        }
    };

    const editEntry = async (id: string, data: Omit<EducationEntry, "id">) => {
        try {
            const updated = await updateEducation(id, data);
            setEntries(updated);
            showSuccess("Formación académica modificada correctamente");
        } catch (err: unknown) {
            throw new Error(err instanceof Error ? err.message : "Error al modificar formación académica");
        }
    };

    const deleteEntry = async (id: string) => {
        try {
            await apiDeleteEducation(id);
            setEntries((prev) => prev.filter((e) => e.id !== id));
            showSuccess("Formación académica eliminada correctamente");
        } catch (err: unknown) {
            throw new Error(err instanceof Error ? err.message : "Error al eliminar formación académica");
        }
    };

    return {
        entries,
        publicEntries,
        academicDegrees,
        isLoading,
        isLoadingPublic,
        error,
        publicError,
        successMessage,
        addEntry,
        editEntry,
        deleteEntry,
        setPublicUser,
        currentPublicUsername,
    };
};
