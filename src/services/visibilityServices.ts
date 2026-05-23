const API_BASE_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("token") ?? "";

const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
});

export const visibilityService = {
    updateProject: async (visibilities: Record<string | number, boolean>) => {
        const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/users/projects/visibility`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ visibilities }),
        });
        if (!response.ok) throw new Error("Error al actualizar visibilidad de proyectos");
        return response.json();
    },

    updateEducation: async (visibilities: Record<string | number, boolean>) => {
        const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/users/education/visibility`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ visibilities }),
        });
        if (!response.ok) throw new Error("Error al actualizar visibilidad de educación");
        return response.json();
    },

    updateWorkExperience: async (visibilities: Record<string | number, boolean>) => {
        const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/users/experiences/visibility`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ visibilities }),
        });
        if (!response.ok) throw new Error("Error al actualizar visibilidad de experiencias laborales");
        return response.json();
    },

    updateSkill: async (visibilities: Record<string | number, boolean>) => {
        const response = await fetch(`${API_BASE_URL}/api/v1/skills/users/skills/visibility`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ visibilities }),
        });
        if (!response.ok) throw new Error("Error al actualizar visibilidad de habilidades");
        return response.json();
    },
};