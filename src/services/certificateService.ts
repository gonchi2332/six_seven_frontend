import { parseProfilePicture } from "./decodeBase64";

export interface Certificate {
    id: number;
    title: string;
    description: string;
    area: string;
    issueDate: string;
    coverImage: string;
    visible:boolean;
}

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/portfolio`;

const getToken = () => localStorage.getItem("token") ?? "";

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

const authHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
});

export const fetchCertificates = async (): Promise<Certificate[]> => {
    const username = getUsername();
    if (!username) return [];

    const res = await fetch(`${BASE_URL}/users/certificates?username=${username}`, {
        headers: authHeaders(),
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
        visible:boolean
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

    const res = await fetch(`${BASE_URL}/users/certificates`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
    });

    const resData = await res.json();
    if (!res.ok) {
        const msg = resData.message ?? "";
        if (msg.toLowerCase().includes("file too large") || msg.toLowerCase().includes("multer")) {
            throw new Error("La imagen es demasiado grande. Por favor selecciona una imagen más pequeña.");
        }
        throw new Error(msg || "Error al registrar certificado.");
    }
};

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

    const res = await fetch(`${BASE_URL}/users/certificates?id=${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: formData,
    });

    const resData = await res.json();
    if (!res.ok) {
        const msg = resData.message ?? "";
        if (msg.toLowerCase().includes("file too large") || msg.toLowerCase().includes("multer")) {
            throw new Error("La imagen es demasiado grande. Por favor selecciona una imagen más pequeña.");
        }
        throw new Error(msg || "Error al modificar certificado.");
    }
};

export const deleteCertificate = async (id: number): Promise<void> => {
    const username = getUsername();
    if (!username) throw new Error("Usuario no autenticado.");

    const res = await fetch(`${BASE_URL}/users/certificates?id=${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Error al eliminar certificado.");
    }
};