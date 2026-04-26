// ============================================
// TIPOS
// ============================================

export interface SoftSkill {
    name: string;          
}

export interface CreateSoftSkillDto {
    skillName: string;
}

export interface UpdateSoftSkillDto {
    oldSkillName: string;
    newSkillName: string;
}

export interface DeleteSoftSkillDto {
    skillName: string;
}

// ============================================
// CONSTANTES
// ============================================

const API_URL = import.meta.env.VITE_API_URL;

// ============================================
// TOKEN DESDE LOCALSTORAGE
// ============================================

const getToken = (): string | null => {
    return localStorage.getItem('token');
};

// ============================================
// HEADERS (SOLO PARA ENDPOINTS PROTEGIDOS)
// ============================================

const getAuthHeaders = (): HeadersInit => {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Authorization ${token}`;
    }
    return headers;
};

// ============================================
// SERVICIOS
// ============================================

// GET - Obtener habilidades blandas de un usuario (público)
export const getSoftSkills = async (username: string): Promise<SoftSkill[]> => {
    const response = await fetch(`${API_URL}/api/v1/skills/users/${username}/soft-skills`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error al obtener habilidades blandas');
    }

    // La respuesta viene como { success, message, softSkills: [{ name }, ...] }
    if (data.success && Array.isArray(data.softSkills)) {
        return data.softSkills;
    }
    return [];
};

// POST - Registrar nueva habilidad blanda
export const createSoftSkill = async (data: CreateSoftSkillDto): Promise<void> => {
    const response = await fetch(`${API_URL}/api/v1/skills/users/soft-skills`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || 'Error al agregar la habilidad');
    }
};

// PATCH - Modificar habilidad blanda
export const updateSoftSkill = async (data: UpdateSoftSkillDto): Promise<void> => {
    const response = await fetch(`${API_URL}/api/v1/skills/users/soft-skills`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || 'Error al modificar la habilidad');
    }
};

// DELETE - Eliminar habilidad blanda
export const deleteSoftSkill = async (data: DeleteSoftSkillDto): Promise<void> => {
    const response = await fetch(`${API_URL}/api/v1/skills/users/soft-skills`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || 'Error al eliminar la habilidad');
    }
};