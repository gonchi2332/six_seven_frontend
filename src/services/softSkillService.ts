// ============================================
// TIPOS
// ============================================

export interface SoftSkill {
    name: string;
}

export interface CreateSoftSkillDto {
    skillName: string;
}

export interface DeleteSoftSkillDto {
    skillName: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const getToken = (): string | null => {
    return localStorage.getItem('token');
};

const getAuthHeaders = (): HeadersInit => {
    const token = getToken();
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Authorization ${token}`;
    return headers;
};

const MOCK_SOFT_CATALOG = [
    "comunicación", "trabajo en equipo", "liderazgo", "resolución de problemas",
    "adaptabilidad", "creatividad", "empatía", "pensamiento crítico",
    "gestión del tiempo", "proactividad", "responsabilidad", "negociación",
    "inteligencia emocional", "toma de decisiones", "organización",
];

const BAD_WORDS = [
    "mierda", "puta", "puto", "culo", "idiota", "estupido", "estúpido",
    "pendejo", "cabron", "cabrón", "coño", "joder",
];

export const containsBadWordSoft = (text: string): boolean => {
    const lower = text.toLowerCase();
    return BAD_WORDS.some((word) => lower.includes(word));
};

export const getCatalogSoftSkills = (): string[] => MOCK_SOFT_CATALOG;

export const getUserSoftSkillNames = async (username: string): Promise<string[]> => {
    try {
        const data = await getSoftSkills(username);
        return data.map((s) => s.name.toLowerCase());
    } catch {
        return [];
    }
};

export const postSoftSkill = async (
    skillName: string,
    username: string
): Promise<"success" | "not-found"> => {
    if (containsBadWordSoft(skillName)) throw new Error("INAPPROPRIATE");

    const userSkills = await getUserSoftSkillNames(username);
    if (userSkills.includes(skillName.toLowerCase())) throw new Error("ALREADY_EXISTS");

    const existsInCatalog = MOCK_SOFT_CATALOG.includes(skillName.toLowerCase());

    // await createSoftSkill({ skillName });

    return existsInCatalog ? "success" : "not-found";
};

export const getSoftSkills = async (username: string): Promise<SoftSkill[]> => {
    // const response = await fetch(`${API_URL}/api/v1/skills/users/${username}/soft-skills`, {
    //     method: 'GET',
    //     headers: { 'Content-Type': 'application/json' },
    // });
    // const data = await response.json();
    // if (!response.ok) throw new Error(data.message || 'Error al obtener habilidades blandas');
    // if (data.success && Array.isArray(data.softSkills)) return data.softSkills;
    // return [];
    void username;
    void API_URL;
    return [];
};

export const createSoftSkill = async (data: CreateSoftSkillDto): Promise<void> => {
    // const response = await fetch(`${API_URL}/api/v1/skills/users/soft-skills`, {
    //     method: 'POST',
    //     headers: getAuthHeaders(),
    //     body: JSON.stringify(data),
    // });
    // const responseData = await response.json();
    // if (!response.ok) throw new Error(responseData.message || 'Error al agregar la habilidad');
    void data;
    void getAuthHeaders;
};

export const deleteSoftSkill = async (data: DeleteSoftSkillDto): Promise<void> => {
    // const response = await fetch(`${API_URL}/api/v1/skills/users/soft-skills`, {
    //     method: 'DELETE',
    //     headers: getAuthHeaders(),
    //     body: JSON.stringify(data),
    // });
    // const responseData = await response.json();
    // if (!response.ok) throw new Error(responseData.message || 'Error al eliminar la habilidad');
    void data;
    void getAuthHeaders;
};