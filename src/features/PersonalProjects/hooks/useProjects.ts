// hooks/useProjects.ts
import { useState, useEffect, useCallback } from "react";
import {
    fetchProjectsService,
    createProjectService,
    updateProjectService,
    deleteProjectService,
} from "../services/personalProjectsService";

import type {
    ProjectEntry, CreateProjectPayload,
    UpdateProjectPayload
} from "../services/personalProjectsService";
import getUsernameFromToken from "../../../utils/getUsernameToken";

interface UseProjectsReturn {
    projects: ProjectEntry[];
    username: string | null;
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
    fetchProjects: () => Promise<void>;
    addProject: (payload: CreateProjectPayload) => Promise<void>;
    editProject: (id: string, payload: UpdateProjectPayload) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
}

export const useProjects = (): UseProjectsReturn => {
    const [projects, setProjects] = useState<ProjectEntry[]>([]);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const user = getUsernameFromToken();
        setUsername(user);
    }, []);

    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await fetchProjectsService();
            setProjects(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al obtener los proyectos";
            setError(message);
            console.error("Error fetching projects:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addProject = async (payload: CreateProjectPayload) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await createProjectService(payload);
            setSuccessMessage("Proyecto creado exitosamente");
            await fetchProjects();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al crear el proyecto";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const editProject = async (id: string, payload: UpdateProjectPayload) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await updateProjectService(id, payload);
            setSuccessMessage("Proyecto actualizado exitosamente");
            await fetchProjects();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al actualizar el proyecto";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteProject = async (id: string) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await deleteProjectService(id);
            setSuccessMessage("Proyecto eliminado exitosamente");
            setProjects(prev => prev.filter(project => project.id !== id));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al eliminar el proyecto";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return {
        projects,
        username,
        isLoading,
        error,
        successMessage,
        fetchProjects,
        addProject,
        editProject,
        deleteProject,
    };
};
