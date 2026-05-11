import getUsernameFromToken from "../../../utils/getUsernameToken";

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
    image: File | string | null;
}

export interface UpdateProjectPayload {
    description?: string;
    topic?: string;
    role?: string;
    status?: "En proceso" | "Finalizado" | "Cancelado";
    links?: Link[];
    image?: File | string | null;
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
    image: string | null;
    createdAt: string;
    updatedAt: string;
}

interface CreateProjectResponse {
    success: boolean;
    message: string;
}

interface UpdateProjectResponse {
    success: boolean;
    message: string;
}

interface DeleteProjectResponse {
    success: boolean;
    message: string;
}

interface FetchProjectsResponse {
    success: boolean;
    message: string;
    projects: any[];
}

const API_URL = import.meta.env.VITE_API_URL;

// Crear proyecto
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

// Obtener proyectos del usuario autenticado
export const fetchProjectsService = async (): Promise<ProjectEntry[]> => {
    const username = getUsernameFromToken();
    const response = await fetch(`${API_URL}/api/v1/portfolio/users/${username}/projects`, {
        method: "GET",
    });

    if (!response.ok) {
        let errorMessage = "Error al obtener los proyectos";
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }

    const data: FetchProjectsResponse = await response.json();

    return data.projects.map((project: any) => ({
        id: String(project.id),
        name: project.name,
        description: project.description,
        topic: project.topic,
        role: project.role,
        status: project.status,
        links: project.links || [],
        image: project.image || null,
        imageUrl: project.image || "",
        createdAt: project.createdAt || new Date().toISOString(),
        updatedAt: project.updatedAt || new Date().toISOString(),
    }));
};

// Modificar proyecto (PATCH)
export const updateProjectService = async (
    id: string,
    payload: UpdateProjectPayload
): Promise<UpdateProjectResponse> => {
    const formData = new FormData();

    if (payload.description) formData.append("description", payload.description);
    if (payload.topic) formData.append("topic", payload.topic);
    if (payload.role) formData.append("role", payload.role);
    if (payload.status) formData.append("status", payload.status);
    if (payload.links) formData.append("links", JSON.stringify(payload.links));
    if (payload.image) formData.append("image", payload.image);

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/api/v1/portfolio/users/projects?id=${id}`, {
        method: "PATCH",
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

// Eliminar proyecto (DELETE)
export const deleteProjectService = async (id: string): Promise<DeleteProjectResponse> => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/api/v1/portfolio/users/projects?id=${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
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


