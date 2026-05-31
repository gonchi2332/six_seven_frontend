export interface PublicSectionsVisibility {
    has_projects: boolean;
    has_hard_skills: boolean;
    has_education: boolean;
    has_certificates: boolean;
    has_soft_skills: boolean;
    has_work_experience: boolean;
}

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Obtiene el estado de visibilidad de las secciones para el portafolio público de un usuario
 */
export const fetchPublicSectionsVisibility = async (username: string): Promise<PublicSectionsVisibility> => {
    const response = await fetch(`${API_URL}/api/v1/profile/users/${username}/sections-visibility`);
    
    const data = await response.json();
    
    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al obtener la visibilidad de las secciones");
    }
    return data.sectionsVisibility; 
};