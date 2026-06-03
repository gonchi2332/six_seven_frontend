import { fetchWithAuth } from "./refreshToken";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const visibilityService = {
    updateProject: async (visibilities: Record<string | number, boolean>) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/v1/portfolio/users/projects/visibility`, {
            method: "PATCH",
            body: JSON.stringify({ visibilities }),
        });
        if (!response.ok) throw new Error("Error al actualizar visibilidad de proyectos");
        return response.json();
    },

    updateEducation: async (visibilities: Record<string | number, boolean>) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/v1/portfolio/users/education/visibility`, {
            method: "PATCH",
            body: JSON.stringify({ visibilities }),
        });
        if (!response.ok) throw new Error("Error al actualizar visibilidad de educación");
        return response.json();
    },

    updateWorkExperience: async (visibilities: Record<string | number, boolean>) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/v1/portfolio/users/laboral-experience/visibility`, {
            method: "PATCH",
            body: JSON.stringify({ visibilities }),
        });
        if (!response.ok) throw new Error("Error al actualizar visibilidad de experiencias laborales");
        return response.json();
    },

    updateSkill: async (visibilities: Record<string | number, boolean>) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/v1/skills/users/skills/visibility`, {
            method: "PATCH",
            body: JSON.stringify({ visibilities }),
        });
        if (!response.ok) throw new Error("Error al actualizar visibilidad de habilidades");
        return response.json();
    },

    updateCertificate: async (visibilities: Record<string | number, boolean>) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/v1/portfolio/users/certificates/visibility`, {
            method: "PATCH",
            body: JSON.stringify({ visibilities }),
        });
        if (!response.ok) throw new Error("Error al actualizar visibilidad de habilidades");
        return response.json();
    },

    updatePersonalInfo: async (visibilities: Record<string | number, boolean>) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/v2/register/users/personal-info/visibility`, {
            method: "PATCH",
            body: JSON.stringify( visibilities ),
        });
        if (!response.ok) throw new Error("Error al actualizar visibilidad de habilidades");
        return response.json();
    },
};