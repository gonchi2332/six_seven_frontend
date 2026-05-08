export interface EducationEntry {
    id: string;
    degree: string;
    academicLevel: string;
    institution: string;
    description: string;
    startDate: string;
    endDate?: string;
}

const USE_MOCK = true;
const BASE_URL = "/api/education";
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

let mockData: EducationEntry[] = [
    {
        id: "1",
        degree: "Ingeniería en Sistemas",
        academicLevel: "Licenciatura",
        institution: "Universidad Mayor de San Simón",
        description: "Carrera de ingeniería enfocada en desarrollo de software y sistemas computacionales.",
        startDate: "2018",
        endDate: undefined,
    },
    {
        id: "2",
        degree: "Bachillerato en Ciencias",
        academicLevel: "Bachillerato",
        institution: "Colegio Nacional Simón Bolívar",
        description: "Educación secundaria con énfasis en ciencias exactas y matemáticas.",
        startDate: "2012",
        endDate: "2017",
    },
];

let nextId = 3;

const mock = {
    fetch: async (): Promise<EducationEntry[]> => {
        await delay(500);
        return [...mockData];
    },
    create: async (data: Omit<EducationEntry, "id">): Promise<EducationEntry> => {
        await delay(400);
        const created: EducationEntry = { id: String(nextId++), ...data };
        mockData = [...mockData, created];
        return created;
    },
    update: async (id: string, data: Omit<EducationEntry, "id">): Promise<EducationEntry> => {
        await delay(400);
        const updated: EducationEntry = { id, ...data };
        mockData = mockData.map((e) => (e.id === id ? updated : e));
        return updated;
    },
    delete: async (id: string): Promise<void> => {
        await delay(400);
        mockData = mockData.filter((e) => e.id !== id);
    },
};

const api = {
    fetch: async (): Promise<EducationEntry[]> => {
        const res = await fetch(BASE_URL, { credentials: "include" });
        if (!res.ok) throw new Error("Error al cargar experiencias académicas");
        return res.json();
    },
    create: async (data: Omit<EducationEntry, "id">): Promise<EducationEntry> => {
        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al crear experiencia académica");
        return res.json();
    },
    update: async (id: string, data: Omit<EducationEntry, "id">): Promise<EducationEntry> => {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al actualizar experiencia académica");
        return res.json();
    },
    delete: async (id: string): Promise<void> => {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Error al eliminar experiencia académica");
    },
};

const service = USE_MOCK ? mock : api;

export const fetchEducation = (): Promise<EducationEntry[]> => service.fetch();
export const createEducation = (data: Omit<EducationEntry, "id">): Promise<EducationEntry> => service.create(data);
export const updateEducation = (id: string, data: Omit<EducationEntry, "id">): Promise<EducationEntry> => service.update(id, data);
export const deleteEducation = (id: string): Promise<void> => service.delete(id);