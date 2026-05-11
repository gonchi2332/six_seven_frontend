export interface EducationEntry {
    id: string;
    degree: string;
    academicLevel: string;
    academicLevelId: number;
    institution: string;
    startDate: string;
    endDate?: string;
}

export interface AcademicDegree {
    id: number;
    academicdegree: string;
}

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/portfolio`;

const getToken = () => localStorage.getItem("token") ?? "";
const getUsername = () => localStorage.getItem("username") ?? "";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
});

const jsonHeaders = () => ({
    "Content-Type": "application/json",
});

export const fetchAcademicDegrees = async (): Promise<AcademicDegree[]> => {
    const res = await fetch(`${BASE_URL}/education_degree`, {
        headers: jsonHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener grados académicos");
    const data = await res.json();
    return data.educationGrade ?? [];
};

export const fetchEducation = async (): Promise<EducationEntry[]> => {
    const username = getUsername();
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
        end_date: string | null;
    }) => ({
        id: String(e.id),
        degree: e.title,
        academicLevel: e.academicdegree,
        academicLevelId: 0,
        institution: e.institution,
        startDate: e.start_date?.split("-")[0] ?? "",
        endDate: e.end_date?.split("-")[0] ?? undefined,
    }));
};

export const createEducation = async (
    data: Omit<EducationEntry, "id">
): Promise<EducationEntry[]> => {
    const body: Record<string, unknown> = {
        title: data.degree,
        academyDegreeId: data.academicLevelId,
        institution: data.institution,
        startDate: data.startDate,
    };
    if (data.endDate) body.endDate = data.endDate;

    const res = await fetch(`${BASE_URL}/users/education`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(body),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message ?? "Error al crear formación académica");
    return fetchEducation();
};

export const updateEducation = async (
    id: string,
    data: Omit<EducationEntry, "id">
): Promise<EducationEntry[]> => {
    const body: Record<string, unknown> = {
        startDate: data.startDate,
    };
    if (data.academicLevelId && data.academicLevelId !== 0) {
        body.academyDegreeId = data.academicLevelId;
    }
    if (data.institution) body.institution = data.institution;
    if (data.endDate) body.endDate = data.endDate;

    const res = await fetch(`${BASE_URL}/users/education?id=${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(body),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message ?? "Error al actualizar formación académica");
    return fetchEducation();
};

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