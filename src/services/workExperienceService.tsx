// ============================================
// TIPOS DEL BACKEND
// ============================================

export interface WorkExperienceBackend {
    id: number;
    position: string;
    company_name: string;
    description: string;
    start_date: string;  // ISO format "2022-03-01T00:00:00.000Z"
    end_date: string | null;
}

export interface CreateWorkExperienceBackendDto {
    position: string;
    companyName: string;
    description: string;
    startDate: string;   // YYYY-MM-DD
    endDate?: string;     // YYYY-MM-DD (opcional)
}

export interface UpdateWorkExperienceBackendDto {
    position?: string;
    companyName?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

// ============================================
// CONSTANTES
// ============================================

const API_URL = import.meta.env.VITE_API_URL;

const getToken = (): string | null => {
    return localStorage.getItem('token');
};

const getHeaders = (): HeadersInit => {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// ============================================
// SERVICIOS (SIN TRANSFORMAR)
// ============================================

// GET - Obtener experiencias laborales de un usuario
export const getWorkExperiences = async (username: string): Promise<{ success: boolean; message: string; laboralExperiences: WorkExperienceBackend[] }> => {
    const response = await fetch(
        `${API_URL}/api/v1/portfolio/users/laboral-experience?username=${username}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Error al obtener experiencias laborales');
    }

    return data;
};

// POST - Crear nueva experiencia laboral
export const createWorkExperience = async (data: CreateWorkExperienceBackendDto): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(
        `${API_URL}/api/v1/portfolio/users/laboral-experience`,
        {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        }
    );

    const responseData = await response.json();
    
    if (!response.ok) {
        throw new Error(responseData.message || 'Error al crear experiencia laboral');
    }

    return responseData;
};

// PATCH - Modificar experiencia laboral
export const updateWorkExperience = async (id: number, data: UpdateWorkExperienceBackendDto): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(
        `${API_URL}/api/v1/portfolio/users/laboral-experience?id=${id}`,
        {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data),
        }
    );

    const responseData = await response.json();
    
    if (!response.ok) {
        throw new Error(responseData.message || 'Error al modificar experiencia laboral');
    }

    return responseData;
};

// DELETE - Eliminar experiencia laboral
export const deleteWorkExperience = async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(
        `${API_URL}/api/v1/portfolio/users/laboral-experience?id=${id}`,
        {
            method: 'DELETE',
            headers: getHeaders(),
        }
    );

    const responseData = await response.json();
    
    if (!response.ok) {
        throw new Error(responseData.message || 'Error al eliminar experiencia laboral');
    }

    return responseData;
};