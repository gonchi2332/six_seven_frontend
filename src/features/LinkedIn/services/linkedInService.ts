import { fetchWithAuth } from "../../../services/refreshToken";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/api/v1/platforms/users`;

export const linkedinService = {
    // Obtiene el perfil de LinkedIn vinculado al usuario
    getProfile: async (username: string) => {
        const response = await fetch(`${BASE_URL}/${username}/linkedin`);
        return await response.json();
    },

    // Registra o actualiza el nombre de usuario de LinkedIn
    updateProfile: async (linkedinUsername: string) => {
        const response = await fetchWithAuth(`${BASE_URL}/linkedin`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ linkedinUsername }),
        });
        return await response.json();
    }
};