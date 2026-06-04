// services/workExperienceService.ts
// ============================================
// TIPOS DEL BACKEND
// ============================================

import { fetchWithAuth } from "../../../services/refreshToken";

export interface WorkExperienceBackend {
    id: number;
    position: string;
    company_name: string;
    description: string;
    start_date: string;  // ISO format "2022-03-01T00:00:00.000Z"
    end_date: string | null;
    visible:boolean
}

export interface CreateWorkExperienceBackendDto {
    position: string;
    companyName: string;
    description: string;
    startDate: string;   // YYYY-MM-DD
    endDate?: string | null;     // YYYY-MM-DD (opcional)
}

export interface UpdateWorkExperienceBackendDto {
    position?: string;
    companyName?: string;
    description?: string;
    startDate?: string;
    endDate?: string | null;
}

// ============================================
// CONSTANTES
// ============================================

const API_URL = import.meta.env.VITE_API_URL;

// Obtener token del localStorage
const getToken = (): string | null => {
    return localStorage.getItem('token');
};

// ============================================
// SERVICIOS (SIN TRANSFORMAR)
// ============================================

// Obtener experiencias laborales publicas de un usuario
export const fetchPublicWorkExperience = async (username: string): Promise<{ success: boolean; message: string; laboralExperiences: WorkExperienceBackend[] }> => {
    const response = await fetch(`${API_URL}/api/v1/portfolio/users/${username}/laboral-experience`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error al obtener experiencias laborales');
    }

    return data;
}

// Obtener experiencias laborales del usuario autenticado
export const getWorkExperiences = async (username: string): Promise<{ success: boolean; message: string; laboralExperiences: WorkExperienceBackend[] }> => {
    const token = getToken();
    let response: Response;
    if(token){
        response = await fetchWithAuth(
            `${API_URL}/api/v1/portfolio/users/laboral-experience?username=${username}`,
            {
                method: 'GET',
            }
        );
    }else{
        response = await fetch(
            `${API_URL}/api/v1/portfolio/users/laboral-experience?username=${username}`,
            {
                method: 'GET',
            }
        );
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error al obtener experiencias laborales');
    }

    return data;
};

// Crear una nueva experiencia laboral
export const createWorkExperience = async (data: CreateWorkExperienceBackendDto): Promise<{ success: boolean; message: string }> => {
    const response = await fetchWithAuth(
            `${API_URL}/api/v1/portfolio/users/laboral-experience`,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || 'Error al crear experiencia laboral');
    }

    return responseData;
};

// Actualizar una experiencia laboral existente
export const updateWorkExperience = async (id: number, data: UpdateWorkExperienceBackendDto): Promise<{ success: boolean; message: string }> => {
    const response = await fetchWithAuth(
            `${API_URL}/api/v1/portfolio/users/laboral-experience?id=${id}`,
            {
                method: 'PATCH',
                body: JSON.stringify(data),
            }
        );
    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || 'Error al modificar experiencia laboral');
    }

    return responseData;
};

// Eliminar una experiencia laboral por ID
export const deleteWorkExperience = async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await fetchWithAuth(
        `${API_URL}/api/v1/portfolio/users/laboral-experience?id=${id}`,
        {
            method: 'DELETE',
        }
    );

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || 'Error al eliminar experiencia laboral');
    }

    return responseData;
};