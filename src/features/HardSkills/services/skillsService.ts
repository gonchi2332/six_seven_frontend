import { fetchWithAuth } from "../../../services/refreshToken";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/skills`;
const getUsername = () => localStorage.getItem("username") ?? "";

const jsonHeaders = () => ({
    "Content-Type": "application/json",
});

/*
  Características:
  -Obtiene habilidades técnicas públicas de un usuario (NO requiere autenticación)
  -Endpoint: GET /api/v1/skills/users/{username}/hard-skills

  @ Parámetro: username - Nombre de usuario del portafolio a visualizar
  @ Retorna: Habilidades técnicas públicas del usuario
  @ Lanza: Error si la solicitud falla
*/
export const fetchSkillsPublicNew = async (username: string) => {
    const res = await fetch(`${BASE_URL}/users/${username}/hard-skills`,{
        headers: jsonHeaders(),
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Error al obtener habilidades");
    }
    return res.json();
}

/*
  Características:
  -Obtiene habilidades técnicas del usuario autenticado (requiere token)
  -Endpoint: GET /api/v1/skills/users/hard-skills?username={username}
  -Usa fetchWithAuth para manejo automático de refresh token

  @ Retorna: Habilidades técnicas del usuario
  @ Lanza: Error si la solicitud falla
*/
export const fetchSkills = async () => {
    const username = getUsername();
    const res = await fetchWithAuth(`${BASE_URL}/users/hard-skills?username=${username}`, {
        method: "GET",
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Error al obtener habilidades");
    }
    return res.json();
};

/*
  Características:
  -Obtiene el catálogo completo de habilidades técnicas del sistema
  -Endpoint: GET /api/v1/skills/system/all-hard-skills
  -No requiere autenticación

  @ Retorna: Array de nombres de habilidades del catálogo
  @ Lanza: Error si la solicitud falla
*/
export const fetchCatalogSkills = async (): Promise<string[]> => {
    const res = await fetch(`${BASE_URL}/system/all-hard-skills`, {
        headers: jsonHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener catálogo");
    const data = await res.json();
    return (data.data ?? []).map((s: { name: string }) => s.name);
};

/*
  Características:
  -Obtiene los nombres de las habilidades que ya tiene registradas el usuario
  -Útil para validar que no se dupliquen habilidades

  @ Retorna: Array de nombres de habilidades (en minúsculas) del usuario
*/
export const getUserSkillNames = async (): Promise<string[]> => {
    try {
        const data = await fetchSkills();
        const list: { name: string }[] = data.skills ?? [];
        return list.map((s) => s.name.toLowerCase());
    } catch {
        return [];
    }
};

/*
  Características:
  -Registra una habilidad desde el catálogo (habilidad existente en el sistema)
  -Endpoint: POST /api/v1/skills/users/hard-skills
  -Requiere autenticación

  @ Parámetros: skillName - Nombre de la habilidad, punctuation - Nivel (1-5)
  @ Lanza: Error si la habilidad ya existe o hay problema
*/
export const postSkillFromCatalog = async (skillName: string, punctuation: number) => {
    const res = await fetchWithAuth(`${BASE_URL}/users/hard-skills`, {
        method: "POST",
        body: JSON.stringify({ skillName, punctuation }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Error al registrar habilidad");
    return data;
};

/*
  Características:
  -Registra una nueva habilidad (no existe en el catálogo)
  -Endpoint: POST /api/v1/skills/users/new-hard-skill
  -Requiere autenticación
  -Maneja errores específicos:
    - INAPPROPRIATE: nombre contiene palabras prohibidas
    - ALREADY_EXISTS: ya tiene registrada esa habilidad
    - not-found: habilidad no reconocida en el campo técnico

  @ Parámetros: skillName - Nombre de la nueva habilidad, punctuation - Nivel (1-5)
  @ Retorna: "success" si se registra, "not-found" si no es reconocida
  @ Lanza: Error con mensajes específicos (INAPPROPRIATE, ALREADY_EXISTS)
*/
export const postNewSkill = async (
    skillName: string,
    punctuation: number
): Promise<"success" | "not-found"> => {
    const res = await fetchWithAuth(`${BASE_URL}/users/new-hard-skill`, {
        method: "POST",
        body: JSON.stringify({ skillName, punctuation }),
    });
    const data = await res.json();
    if (!res.ok) {
        if (data.message?.includes("inapropiado") || data.message?.includes("ofensivo")) {
            throw new Error("INAPPROPRIATE");
        }
        if (data.message?.includes("ya tiene registrada")) {
            throw new Error("ALREADY_EXISTS");
        }
        if (data.message?.includes("no corresponde")) {
            return "not-found";
        }
        throw new Error(data.message ?? "Error al registrar habilidad");
    }
    return "success";
};

/*
  Características:
  -Función principal de registro de habilidades (decide si usar catálogo o nueva)
  -Primero intenta registrar desde el catálogo
  -Si la habilidad "no existe" en el catálogo, intenta registrar como nueva
  -Maneja caso de habilidad ya existente

  @ Parámetros: skillName - Nombre de la habilidad, punctuation - Nivel (1-5)
  @ Retorna: "success" si se registra, "not-found" si no es reconocida
  @ Lanza: Error ALREADY_EXISTS si ya tiene la habilidad registrada
*/
export const postSkill = async (
    skillName: string,
    punctuation: number
): Promise<"success" | "not-found"> => {
    try {
        await postSkillFromCatalog(skillName, punctuation);
        return "success";
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("no existe")) {
            return postNewSkill(skillName, punctuation);
        }
        if (msg.includes("ya tiene registrada")) {
            throw new Error("ALREADY_EXISTS");
        }
        throw err;
    }
};

/*
  Características:
  -Modifica el nivel de una habilidad existente
  -Endpoint: PATCH /api/v1/skills/users/hard-skills
  -Requiere autenticación

  @ Parámetros: skillName - Nombre de la habilidad, newPunctuation - Nuevo nivel (1-5)
  @ Lanza: Error si la solicitud falla
*/
export const patchSkill = async (skillName: string, newPunctuation: number) => {
    const res = await fetchWithAuth(`${BASE_URL}/users/hard-skills`, {
        method: "PATCH",
        body: JSON.stringify({ skillName, newPunctuation }),
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Error al modificar habilidad");
    }
};

/*
  Características:
  -Elimina una habilidad del usuario
  -Endpoint: DELETE /api/v1/skills/users/hard-skills
  -Requiere autenticación

  @ Parámetro: skillName - Nombre de la habilidad a eliminar
  @ Lanza: Error si la solicitud falla
*/
export const deleteSkill = async (skillName: string) => {
    const res = await fetchWithAuth(`${BASE_URL}/users/hard-skills`, {
        method: "DELETE",
        body: JSON.stringify({ skillName }),
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Error al eliminar habilidad");
    }
};

/*
  Características:
  -Obtiene habilidades técnicas públicas (versión antigua, sin username específico)
  -Endpoint: GET /api/v1/skills/users/hard-skills

  @ Retorna: Habilidades técnicas públicas
  @ Lanza: Error si la solicitud falla
*/
export const fetchSkillsPublic = async () => {
    const res = await fetch(`${BASE_URL}/users/hard-skills`, {
        headers: jsonHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener habilidades públicas");
    return res.json();
};

export const getCatalogSkills = (): string[] => [];

