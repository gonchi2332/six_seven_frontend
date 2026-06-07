import { fetchWithAuth } from "../../../services/refreshToken";

export interface EducationEntry {
    id: string;
    degree: string;
    academicLevel: string;
    academicLevelId: number;
    institution: string;
    startDate: string;
    educationState: string;
    visible: boolean;
}

export interface AcademicDegree {
    id: number;
    academicdegree: string;
}

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/portfolio`;

const getUsername = (): string => {
    return localStorage.getItem("username") ?? "";
};

// Extrae solo el año de una fecha ISO o la devuelve tal cual si ya es YYYY
const formatStartDate = (dateStr: string): string => {
    if (/^\d{4}$/.test(dateStr)) return dateStr;
    return dateStr.split('-')[0] ?? dateStr;
};

// Convierte un año YYYY al formato ISO requerido por el backend
const formatToISO = (year: string): string => {
    return `${year}-01-01T00:00:00.000Z`;
};

// Obtiene el catálogo de grados académicos disponibles
export const fetchAcademicDegrees = async (): Promise<AcademicDegree[]> => {
    const res = await fetchWithAuth(`${BASE_URL}/education_degree`, { method: "GET" });
    if (!res.ok) throw new Error("Error al obtener grados académicos");
    const data = await res.json();
    return data.educationGrade ?? [];
};

// Obtiene formaciones académicas públicas de un usuario sin autenticación
export const fetchPublicEducation = async (username: string): Promise<EducationEntry[]> => {
    const res = await fetch(`${BASE_URL}/users/${username}/education`);
    if (!res.ok) throw new Error("Error al cargar formaciones académicas");
    const data = await res.json();
    if (!data.education) return [];

    return data.education.map((e: {
        id: number; title: string; institution: string;
        academicdegree: string; start_date: string; education_state: string; visible: string;
    }) => ({
        id: String(e.id),
        degree: e.title,
        academicLevel: e.academicdegree,
        academicLevelId: 0, // Se actualiza con el ID correspondiente al cargar el catálogo
        institution: e.institution,
        startDate: formatStartDate(e.start_date),
        educationState: e.education_state || 'Culminado',
        visible: e.visible
    }));
};

// Obtiene formaciones académicas del usuario autenticado
export const fetchEducation = async (): Promise<EducationEntry[]> => {
    const username = getUsername();
    if (!username) return [];

    const res = await fetchWithAuth(`${BASE_URL}/users/education?username=${username}`, { method: "GET" });
    if (!res.ok) throw new Error("Error al cargar formaciones académicas");
    const data = await res.json();
    if (!data.education) return [];

    return data.education.map((e: {
        id: number; title: string; institution: string;
        academicdegree: string; start_date: string; education_state: string; visible: string;
    }) => ({
        id: String(e.id),
        degree: e.title,
        academicLevel: e.academicdegree,
        academicLevelId: 0,
        institution: e.institution,
        startDate: formatStartDate(e.start_date),
        educationState: e.education_state || 'Culminado',
        visible: e.visible
    }));
};

// Crea una nueva formación académica y retorna la lista actualizada
export const createEducation = async (data: Omit<EducationEntry, "id">): Promise<EducationEntry[]> => {
    const body = {
        title: data.degree,
        academyDegreeId: data.academicLevelId,
        institution: data.institution,
        startDate: formatToISO(data.startDate),
        educationState: data.educationState,
    };
    const res = await fetchWithAuth(`${BASE_URL}/users/education`, {
        method: "POST",
        body: JSON.stringify(body),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message ?? "Error al crear formación académica");
    return fetchEducation();
};

// Actualiza una formación académica existente por ID
export const updateEducation = async (id: string, data: Omit<EducationEntry, "id">): Promise<EducationEntry[]> => {
    const body: Record<string, unknown> = {};
    if (data.degree) body.title = data.degree;
    if (data.academicLevelId && data.academicLevelId !== 0) body.academyDegreeId = data.academicLevelId;
    if (data.institution) body.institution = data.institution;
    if (data.startDate) body.startDate = formatToISO(data.startDate);
    if (data.educationState) body.educationState = data.educationState;

    const res = await fetchWithAuth(`${BASE_URL}/users/education?id=${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message ?? "Error al actualizar formación académica");
    return fetchEducation();
};

// Elimina una formación académica por ID
export const deleteEducation = async (id: string): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/users/education?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Error al eliminar formación académica");
    }
};