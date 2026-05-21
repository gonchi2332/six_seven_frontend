// ============================================
// TIPOS
// ============================================

export interface EducationEntry {
    id: string;
    degree: string;
    academicLevel: string;
    academicLevelId: number;
    institution: string;
    startDate: string;
    educationState: string;
}

export interface AcademicDegree {
    id: number;
    academicdegree: string;
}

// ============================================
// CONSTANTES
// ============================================

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/portfolio`;

const getToken = (): string => {
    return localStorage.getItem("token") ?? "";
};

const getUsername = (): string => {
    return localStorage.getItem("username") ?? "";
};

const authHeaders = (): HeadersInit => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`,
});

const jsonHeaders = (): HeadersInit => ({
    "Content-Type": "application/json",
});

// ============================================
// FUNCIONES AUXILIARES
// ============================================

const formatStartDate = (dateStr: string): string => {
    // Si viene en formato YYYY, dejarlo así
    if (/^\d{4}$/.test(dateStr)) return dateStr;
    // Si viene en formato ISO, extraer el año
    return dateStr.split('-')[0] ?? dateStr;
};

const formatToISO = (year: string): string => {
    return `${year}-01-01T00:00:00.000Z`;
};

// ============================================
// SERVICIOS
// ============================================

// GET - Obtener grados académicos (catálogo)
export const fetchAcademicDegrees = async (): Promise<AcademicDegree[]> => {
    const res = await fetch(`${BASE_URL}/education_degree`, {
        headers: jsonHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener grados académicos");
    const data = await res.json();
    return data.educationGrade ?? [];
};

// GET - Obtener formaciones académicas del usuario
export const fetchEducation = async (): Promise<EducationEntry[]> => {
    const username = getUsername();
    if (!username) return [];
    
    const res = await fetch(`${BASE_URL}/users/education?username=${username}`, {
        headers: jsonHeaders(),
    });
    if (!res.ok) throw new Error("Error al cargar formaciones académicas");
    const data = await res.json();
    
    if (!data.education) return [];
    
    return data.education.map((e: {
        id: number;
        title: string;
        institution: string;
        academicdegree: string;
        start_date: string;
        education_state: string;
    }) => ({
        id: String(e.id),
        degree: e.title,
        academicLevel: e.academicdegree,
        academicLevelId: 0, // Se actualizará con el ID correspondiente
        institution: e.institution,
        startDate: formatStartDate(e.start_date),
        educationState: e.education_state || 'Culminado',
    }));
};

// POST - Crear nueva formación académica
export const createEducation = async (
    data: Omit<EducationEntry, "id">
): Promise<EducationEntry[]> => {
    const body = {
        title: data.degree,
        academyDegreeId: data.academicLevelId,
        institution: data.institution,
        startDate: formatToISO(data.startDate),
        educationState: data.educationState,
    };

    const res = await fetch(`${BASE_URL}/users/education`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(body),
    });
    
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message ?? "Error al crear formación académica");
    
    return fetchEducation();
};

// PATCH - Actualizar formación académica
export const updateEducation = async (
    id: string,
    data: Omit<EducationEntry, "id">
): Promise<EducationEntry[]> => {
    const body: Record<string, unknown> = {};
    
    if (data.degree) body.title = data.degree;
    if (data.academicLevelId && data.academicLevelId !== 0) body.academyDegreeId = data.academicLevelId;
    if (data.institution) body.institution = data.institution;
    if (data.startDate) body.startDate = formatToISO(data.startDate);
    if (data.educationState) body.educationState = data.educationState;

    const res = await fetch(`${BASE_URL}/users/education?id=${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(body),
    });
    
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message ?? "Error al actualizar formación académica");
    
    return fetchEducation();
};

// DELETE - Eliminar formación académica
export const deleteEducation = async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/users/education?id=${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Error al eliminar formación académica");
    }
};