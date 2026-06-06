import { parseProfilePicture } from "../../../services/decodeBase64";
import { fetchWithAuth } from "../../../services/refreshToken";

export interface Certificate {
    id: number;
    title: string;
    description: string;
    area: string;
    issueDate: string;
    coverImage: string;
    visible: boolean;
}

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/portfolio`;

const getUsername = (): string => {
    const token = localStorage.getItem("token");
    if (!token) return "";
    try {
        const part = token.split(".").at(1);
        if (!part) return "";
        const payload = JSON.parse(atob(part));
        return payload.username ?? "";
    } catch {
        return "";
    }
};

const jsonHeaders = () => ({
    "Content-Type": "application/json",
});

// GET - Certificados públicos (NO requiere autenticación)
export const fetchCertificatesPublic = async (username: string): Promise<Certificate[]> => {
    const res = await fetch(`${BASE_URL}/users/${username}/certificates`, {
        headers: jsonHeaders(),
    });
    const data = await res.json();
    if (!res.ok) return [];
    if (!data.certificates) return [];

    return data.certificates.map((c: {
        id: number;
        title: string;
        description: string;
        area: string;
        issue_date: string;
        file: string;
        visible: boolean
    }) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        area: c.area,
        issueDate: c.issue_date.split("T")[0],
        coverImage: parseProfilePicture(c.file) ?? "",
        visible: c.visible,
    }));
}

// GET - Certificados del usuario autenticado (requiere token)
export const fetchCertificates = async (): Promise<Certificate[]> => {
    const username = getUsername();
    if (!username) return [];

    const res = await fetchWithAuth(`${BASE_URL}/users/certificates?username=${username}`, {method: "GET"});

    const data = await res.json();
    if (!res.ok) return [];
    if (!data.certificates) return [];

    return data.certificates.map((c: {
        id: number;
        title: string;
        description: string;
        area: string;
        issue_date: string;
        file: string;
        visible: boolean
    }) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        area: c.area,
        issueDate: c.issue_date.split("T")[0],
        coverImage: parseProfilePicture(c.file) ?? "",
        visible: c.visible,
    }));
};

// POST - Crear certificado
export const createCertificate = async (
    data: Omit<Certificate, "id" | "coverImage"> & { coverImage: File }
): Promise<void> => {
    const username = getUsername();
    if (!username) throw new Error("Usuario no autenticado.");

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("area", data.area);
    formData.append("issueDate", data.issueDate);
    formData.append("coverImage", data.coverImage);

    const res = await fetchWithAuth(`${BASE_URL}/users/certificates`, {
        method: "POST",
        body: formData,
    }, true);

    const resData = await res.json();
    if (!res.ok) {
        const msg = resData.message ?? "";
        if (msg.toLowerCase().includes("file too large") || msg.toLowerCase().includes("multer")) {
            throw new Error("La imagen es demasiado grande. Por favor selecciona una imagen más pequeña.");
        }
        throw new Error(msg || "Error al registrar certificado.");
    }
};

// PATCH - Actualizar certificado
export const updateCertificate = async (
    id: number,
    data: Omit<Certificate, "id" | "coverImage"> & { coverImage: File }
): Promise<void> => {
    const username = getUsername();
    if (!username) throw new Error("Usuario no autenticado.");

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("area", data.area);
    formData.append("issueDate", data.issueDate);
    formData.append("coverImage", data.coverImage);

    const res = await fetchWithAuth(`${BASE_URL}/users/certificates?id=${id}`, {
        method: "PATCH",
        body: formData,
    }, true);

    const resData = await res.json();
    if (!res.ok) {
        const msg = resData.message ?? "";
        if (msg.toLowerCase().includes("file too large") || msg.toLowerCase().includes("multer")) {
            throw new Error("La imagen es demasiado grande. Por favor selecciona una imagen más pequeña.");
        }
        throw new Error(msg || "Error al modificar certificado.");
    }
};

// DELETE - Eliminar certificado
export const deleteCertificate = async (id: number): Promise<void> => {
    const username = getUsername();
    if (!username) throw new Error("Usuario no autenticado.");

    const res = await fetchWithAuth(`${BASE_URL}/users/certificates?id=${id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Error al eliminar certificado.");
    }
};
