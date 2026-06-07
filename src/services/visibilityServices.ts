import { fetchWithAuth } from "./refreshToken";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/*
  Características:
  -Servicio que gestiona la visibilidad de diferentes secciones del portafolio
  -Cada método actualiza la visibilidad de una sección específica
  -Usa fetchWithAuth para manejo automático de refresh token
  -Todos los métodos reciben un objeto con pares id: boolean

  @ Ejemplo:
  // Actualizar visibilidad de proyectos
  await visibilityService.updateProject({ 1: true, 2: false });

  // Actualizar visibilidad de educación
  await visibilityService.updateEducation({ 5: true });
*/
export const visibilityService = {
    /*
      Características:
      -Actualiza la visibilidad de proyectos personales
      -Endpoint: PATCH /api/v1/portfolio/users/projects/visibility
      -Cuerpo: { visibilities: { [projectId]: boolean } }

      @ Parámetro: visibilities - Objeto con ids de proyecto y su visibilidad
    */
    updateProject: async (visibilities: Record<string | number, boolean>) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/v1/portfolio/users/projects/visibility`, {
            method: "PATCH",
            body: JSON.stringify({ visibilities }),
        });
        if (!response.ok) throw new Error("Error al actualizar visibilidad de proyectos");
        return response.json();
    },

    /*
      Características:
      -Actualiza la visibilidad de formaciones académicas
      -Endpoint: PATCH /api/v1/portfolio/users/education/visibility
      -Cuerpo: { visibilities: { [educationId]: boolean } }

      @ Parámetro: visibilities - Objeto con ids de educación y su visibilidad
    */
    updateEducation: async (visibilities: Record<string | number, boolean>) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/v1/portfolio/users/education/visibility`, {
            method: "PATCH",
            body: JSON.stringify({ visibilities }),
        });
        if (!response.ok) throw new Error("Error al actualizar visibilidad de educación");
        return response.json();
    },

    /*
      Características:
      -Actualiza la visibilidad de experiencias laborales
      -Endpoint: PATCH /api/v1/portfolio/users/laboral-experience/visibility
      -Cuerpo: { visibilities: { [workExperienceId]: boolean } }

      @ Parámetro: visibilities - Objeto con ids de experiencia laboral y su visibilidad
    */
    updateWorkExperience: async (visibilities: Record<string | number, boolean>) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/v1/portfolio/users/laboral-experience/visibility`, {
            method: "PATCH",
            body: JSON.stringify({ visibilities }),
        });
        if (!response.ok) throw new Error("Error al actualizar visibilidad de experiencias laborales");
        return response.json();
    },

    /*
      Características:
      -Actualiza la visibilidad de habilidades (técnicas y blandas)
      -Endpoint: PATCH /api/v1/skills/users/skills/visibility
      -Cuerpo: { visibilities: { [skillId]: boolean } }

      @ Parámetro: visibilities - Objeto con ids de habilidad y su visibilidad
    */
    updateSkill: async (visibilities: Record<string | number, boolean>) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/v1/skills/users/skills/visibility`, {
            method: "PATCH",
            body: JSON.stringify({ visibilities }),
        });
        if (!response.ok) throw new Error("Error al actualizar visibilidad de habilidades");
        return response.json();
    },

    /*
      Características:
      -Actualiza la visibilidad de certificados
      -Endpoint: PATCH /api/v1/portfolio/users/certificates/visibility
      -Cuerpo: { visibilities: { [certificateId]: boolean } }

      @ Parámetro: visibilities - Objeto con ids de certificado y su visibilidad
    */
    updateCertificate: async (visibilities: Record<string | number, boolean>) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/v1/portfolio/users/certificates/visibility`, {
            method: "PATCH",
            body: JSON.stringify({ visibilities }),
        });
        if (!response.ok) throw new Error("Error al actualizar visibilidad de habilidades");
        return response.json();
    },

    /*
      Características:
      -Actualiza la visibilidad de información personal (campos específicos)
      -Endpoint: PATCH /api/v2/register/users/personal-info/visibility
      -Cuerpo: { [fieldName]: boolean } (sin envolver en visibilities)

      @ Parámetro: visibilities - Objeto con nombres de campo y su visibilidad
    */
    updatePersonalInfo: async (visibilities: Record<string | number, boolean>) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/v2/register/users/personal-info/visibility`, {
            method: "PATCH",
            body: JSON.stringify( visibilities ),
        });
        if (!response.ok) throw new Error("Error al actualizar visibilidad de habilidades");
        return response.json();
    },
};