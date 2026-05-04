export interface EducationEntry {
    id: string;
    institution: string;
    degree: string;
    title: string;
    startDate: string;
    endDate?: string;
}

const mockData: EducationEntry[] = [
    {
        id: "1",
        institution: "Maryknoll",
        degree: "Primaria",
        title: "Estudios primarios y secundarios",
        startDate: "2020",
        endDate: "2022",
    },
    {
        id: "2",
        institution: "Universidad Mayor",
        degree: "PostGrado",
        title: "Licenciatura en Ingeniería de Sistemas",
        startDate: "2015",
        endDate: "2020",
    },
];

export const fetchEducation = async (): Promise<EducationEntry[]> => {
    // TODO: replace with real endpoint
    // const res = await fetch("/api/education", { headers: { Authorization: `Bearer ${token}` } });
    // if (!res.ok) throw new Error("Error al cargar educación");
    // return res.json();
    return new Promise((resolve) => setTimeout(() => resolve(mockData), 500));
};

export const createEducation = async (data: Omit<EducationEntry, "id">): Promise<EducationEntry> => {
    // TODO: replace with real endpoint
    // const res = await fetch("/api/education", { method: "POST", headers: { ... }, body: JSON.stringify(data) });
    // if (!res.ok) throw new Error("Error al crear educación");
    // return res.json();
    return new Promise((resolve) =>
        setTimeout(() => resolve({ ...data, id: Date.now().toString() }), 400)
    );
};

export const updateEducation = async (id: string, data: Omit<EducationEntry, "id">): Promise<EducationEntry> => {
    // TODO: replace with real endpoint
    // const res = await fetch(`/api/education/${id}`, { method: "PUT", headers: { ... }, body: JSON.stringify(data) });
    // if (!res.ok) throw new Error("Error al modificar educación");
    // return res.json();
    return new Promise((resolve) =>
        setTimeout(() => resolve({ ...data, id }), 400)
    );
};

export const deleteEducation = async (id: string): Promise<void> => {
    // TODO: replace with real endpoint
    // const res = await fetch(`/api/education/${id}`, { method: "DELETE", headers: { ... } });
    // if (!res.ok) throw new Error("Error al eliminar educación");
    return new Promise((resolve) => setTimeout(() => resolve(), 400));
};