export interface PublicSectionsVisibility {
    has_projects: boolean;
    has_hard_skills: boolean;
    has_education: boolean;
    has_certificates: boolean;
    has_soft_skills: boolean;
    has_work_experience: boolean;
}

const API_URL = import.meta.env.VITE_API_URL;

// Obtiene la visibilidad de secciones del portafolio público de un usuario
export const fetchPublicSectionsVisibility = async (username: string): Promise<PublicSectionsVisibility> => {
    const token = localStorage.getItem("token");
    
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`; // Agrega auth si hay sesión activa
    }
    
    const response = await fetch(`${API_URL}/api/v1/profile/users/${username}/sections-visibility`, {
        headers
    });
    
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al obtener la visibilidad de las secciones");
    }
    
    return await response.json();
};