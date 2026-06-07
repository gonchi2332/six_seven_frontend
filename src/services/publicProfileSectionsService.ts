/*
  Interfaz que define la visibilidad de las secciones del portafolio público:
  -has_projects: Indica si la sección de proyectos personales es visible
  -has_hard_skills: Indica si la sección de habilidades técnicas es visible
  -has_education: Indica si la sección de formación académica es visible
  -has_certificates: Indica si la sección de certificados es visible
  -has_soft_skills: Indica si la sección de habilidades blandas es visible
  -has_work_experience: Indica si la sección de experiencia laboral es visible
*/
export interface PublicSectionsVisibility {
    has_projects: boolean;
    has_hard_skills: boolean;
    has_education: boolean;
    has_certificates: boolean;
    has_soft_skills: boolean;
    has_work_experience: boolean;
}

const API_URL = import.meta.env.VITE_API_URL;

/*
  Características:
  -Obtiene el estado de visibilidad de las secciones para el portafolio público de un usuario
  -Endpoint: GET /api/v1/profile/users/{username}/sections-visibility
  -Puede incluir token en Authorization si el usuario está autenticado (para ver sus propias secciones)
  -Útil para filtrar qué secciones mostrar en la vista de portafolio público

  @ Parámetro: username - Nombre de usuario del portafolio a consultar
  @ Retorna: Promise con PublicSectionsVisibility (booleanos por cada sección)
  @ Lanza: Error si la solicitud falla

  @ Ejemplo:
  const visibility = await fetchPublicSectionsVisibility("juanperez");
  if (visibility.has_hard_skills) {
    // Mostrar habilidades técnicas
  }
*/
export const fetchPublicSectionsVisibility = async (username: string): Promise<PublicSectionsVisibility> => {
    const token = localStorage.getItem("token");
    
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/api/v1/profile/users/${username}/sections-visibility`, {
        headers
    });
    
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al obtener la visibilidad de las secciones");
    }
    
    // Si la respuesta es exitosa, simplemente devuelve los datos
    return await response.json();
};