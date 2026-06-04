// hooks/useProjects.ts
import { useState, useEffect, useCallback } from "react";
import {
    fetchProjectsService,
    fetchPublicProjectsService,
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
    publicProjects: ProjectEntry[];
    username: string | null;
    isLoading: boolean;
    isLoadingPublic: boolean;
    error: string | null;
    publicError: string | null;
    successMessage: string | null;
    fetchProjects: () => Promise<void>;
    addProject: (payload: CreateProjectPayload) => Promise<void>;
    editProject: (id: string, payload: UpdateProjectPayload) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    setPublicUser: (username: string | null) => void;
    currentPublicUsername: string | null;
}

// Hook para manejar operaciones CRUD de proyectos personales y publicos
export const useProjects = (): UseProjectsReturn => {
    const [projects, setProjects] = useState<ProjectEntry[]>([]);
    const [publicProjects, setPublicProjects] = useState<ProjectEntry[]>([]);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPublic, setIsLoadingPublic] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [publicError, setPublicError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [currentPublicUsername, setCurrentPublicUsername] = useState<string | null>(null);

    // Obtener el usuario del token al montar el hook
    useEffect(() => {
        const user = getUsernameFromToken();
        setUsername(user);
    }, []);

    // Obtener los proyectos del usuario autenticado
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

    // Cargar proyectos publicos automaticamente cuando cambia el usuario a visualizar
    useEffect(() => {
        const fetchPublicUserProjects = async () => {
            if (!currentPublicUsername || currentPublicUsername.trim() === "") {
                setPublicProjects([]);
                setIsLoadingPublic(false);
                return;
            }

            setIsLoadingPublic(true);
            setPublicError(null);
            try {
                const data = await fetchPublicProjectsService(currentPublicUsername);
                setPublicProjects(data);
            } catch (err: any) {
                console.error(err);
                // No mostrar error de autenticación en vista pública
                if (!err.message?.includes("token") && !err.message?.includes("autenticacion") && !err.message?.includes("Authorization")) {
                    setPublicError(err.message || 'Error al obtener proyectos públicos');
                }
                setPublicProjects([]);
            } finally {
                setIsLoadingPublic(false);
            }
        };

        fetchPublicUserProjects();
    }, [currentPublicUsername]);

    // Cambiar el usuario cuyos proyectos publicos se quieren ver
    const setPublicUser = useCallback((username: string | null) => {
        setCurrentPublicUsername(username);
    }, []);

    // Crear un nuevo proyecto
    const addProject = async (payload: CreateProjectPayload) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await createProjectService(payload);
            setSuccessMessage("Proyecto personal registrado correctamente");
            await fetchProjects();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al crear el proyecto";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Editar un proyecto existente
    const editProject = async (id: string, payload: UpdateProjectPayload) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await updateProjectService(id, payload);
            setSuccessMessage("Proyecto modificado correctamente");
            await fetchProjects();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al actualizar el proyecto";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar un proyecto por ID
    const deleteProject = async (id: string) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await deleteProjectService(id);
            setSuccessMessage("Proyecto eliminado correctamente");
            setProjects(prev => prev.filter(project => project.id !== id));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al eliminar el proyecto";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar proyectos al iniciar
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return {
        projects,
        publicProjects,
        username,
        isLoading,
        isLoadingPublic,
        error,
        publicError,
        successMessage,
        fetchProjects,
        addProject,
        editProject,
        deleteProject,
        setPublicUser,
        currentPublicUsername,
    };
};