import { fetchWithAuth } from "../../../services/refreshToken";

// services/gitHubService.ts
const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/api/v1/platforms/users`;

export const gitHubService = {
    // GET: Obtener perfil
    getProfile: async (username: string) => {
        const response = await fetch(`${BASE_URL}/${username}/github`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al obtener perfil de GitHub");
        }
        return await response.json();
    },

    // PUT: Registrar o modificar
    updateProfile: async (githubUsername: string) => {
        const response = await fetchWithAuth(`${BASE_URL}/github`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ githubUsername }),
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Error al actualizar perfil de GitHub");
        }
        return data;
    }
};