import { parseProfilePicture } from "../../../services/decodeBase64";
import { fetchWithAuth } from "../../../services/refreshToken";

/*
  Interfaz que define la estructura de un certificado:
  -id: Identificador único del certificado
  -title: Título del certificado
  -description: Descripción detallada del contenido o logro
  -area: Área o especialidad (ej: Cloud Computing, Desarrollo Web)
  -issueDate: Fecha de emisión en formato YYYY-MM-DD
  -coverImage: URL o base64 de la imagen de portada
  -visible: Indica si es público en el portafolio
*/
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

/*
  Características:
  -Extrae el nombre de usuario del token JWT almacenado en localStorage
  -Divide el token por "." y toma la segunda parte (payload)
  -Decodifica base64 (atob) y extrae la propiedad username
  -Si no hay token o falla, retorna cadena vacía

  @ Retorna: Nombre de usuario o cadena vacía
*/
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

/*
  Características:
  -Obtiene certificados públicos de un usuario (NO requiere autenticación)
  -Endpoint: GET /api/v1/portfolio/users/{username}/certificates
  -Filtra solo certificados visibles (visible === true)
  -Convierte issue_date a issueDate (YYYY-MM-DD)
  -Decodifica la imagen con parseProfilePicture

  @ Parámetro: username - Nombre de usuario del portafolio a visualizar
  @ Retorna: Array de certificados públicos (vacío si error)

  @ Ejemplo:
  const publicCerts = await fetchCertificatesPublic("juanperez");
*/
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

/*
  Características:
  -Obtiene certificados del usuario autenticado (requiere token)
  -Endpoint: GET /api/v1/portfolio/users/certificates?username={username}
  -Usa fetchWithAuth para manejo automático de refresh token
  -Convierte issue_date a issueDate (YYYY-MM-DD)
  -Decodifica la imagen con parseProfilePicture

  @ Retorna: Array de certificados del usuario (vacío si error o no autenticado)

  @ Ejemplo:
  const myCerts = await fetchCertificates();
*/
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

/*
  Características:
  -Crea un nuevo certificado para el usuario autenticado
  -Endpoint: POST /api/v1/portfolio/users/certificates
  -Usa FormData para enviar archivo de imagen
  -Manejo específico de error "File too large" con mensaje amigable

  @ Parámetro: data - Datos del certificado (título, descripción, área, fecha, imagen)
  @ Lanza: Error si el usuario no está autenticado o la solicitud falla

  @ Ejemplo:
  await createCertificate({
    title: "AWS Certified",
    description: "Certificación en AWS Solutions Architect",
    area: "Cloud Computing",
    issueDate: "2024-03-15",
    coverImage: selectedFile
  });
*/
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

/*
  Características:
  -Actualiza un certificado existente del usuario autenticado
  -Endpoint: PATCH /api/v1/portfolio/users/certificates?id={id}
  -Usa FormData para enviar archivo de imagen
  -Manejo específico de error "File too large" con mensaje amigable

  @ Parámetros:
  -id: Identificador del certificado a modificar
  -data: Datos actualizados (título, descripción, área, fecha, imagen)
  @ Lanza: Error si el usuario no está autenticado o la solicitud falla

  @ Ejemplo:
  await updateCertificate(123, {
    title: "AWS Certified (Actualizado)",
    description: "Descripción actualizada",
    area: "Cloud Computing",
    issueDate: "2024-03-15",
    coverImage: newImageFile
  });
*/
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

/*
  Características:
  -Elimina un certificado del usuario autenticado
  -Endpoint: DELETE /api/v1/portfolio/users/certificates?id={id}

  @ Parámetro: id - Identificador del certificado a eliminar
  @ Lanza: Error si el usuario no está autenticado o la solicitud falla

  @ Ejemplo:
  await deleteCertificate(123);
*/
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

