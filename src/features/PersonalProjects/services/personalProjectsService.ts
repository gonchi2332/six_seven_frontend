export interface Link {
    label: string;
    url: string;
}

export interface CreateProjectPayload {
    name: string;
    description: string;
    topic: string;
    role: string;
    status: "En proceso" | "Finalizado" | "Cancelado";
    links: Link[];
    image: File | null;
}

export interface ProjectEntry {
    id: string;
    name: string;
    description: string;
    topic: string;
    role: string;
    status: "En proceso" | "Finalizado" | "Cancelado";
    links: Link[];
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}

interface CreateProjectResponse {
    success: boolean;
    message: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export const createProjectService = async (
    payload: CreateProjectPayload
): Promise<CreateProjectResponse> => {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("description", payload.description);
    formData.append("topic", payload.topic);
    formData.append("role", payload.role);
    formData.append("status", payload.status);

    if (payload.image) {
        formData.append("image", payload.image);
    }

    formData.append("links", JSON.stringify(payload.links));

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/api/v1/portfolio/users/projects`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });

    const responseText = await response.text();

    if (!response.ok) {
        let errorMessage = `Error ${response.status}`;
        try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
            errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return JSON.parse(responseText);
};

export const fetchProjectsService = async (): Promise<ProjectEntry[]> => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/api/v1/portfolio/users/projects`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error al obtener los proyectos");
    }

    const data = await response.json();
    return data.projects;
};
