import { useState } from "react";
import { createProjectService } from "../services/personalProjectsService";
import type { CreateProjectPayload } from "../services/personalProjectsService";

interface CreateProjectResponse {
    success: boolean;
    message: string;
}

interface UseCreateProjectReturn {
    createProject: (payload: CreateProjectPayload) => Promise<CreateProjectResponse>;
    isLoading: boolean;
    error: string | null;
}

export const useCreateProject = (): UseCreateProjectReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createProject = async (payload: CreateProjectPayload): Promise<CreateProjectResponse> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await createProjectService(payload);
            return response;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error inesperado";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { createProject, isLoading, error };
};
