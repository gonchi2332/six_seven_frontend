import { fetchWithAuth } from "../../../services/refreshToken";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/skills`;
const getUsername = () => localStorage.getItem("username") ?? "";

const jsonHeaders = () => ({
    "Content-Type": "application/json",
});

// Obtener habilidades técnicas públicas de un usuario (portafolio visible)
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

// Obtener habilidades técnicas del usuario autenticado
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

// Obtener catálogo de habilidades disponibles (para autocompletado)
export const fetchCatalogSkills = async (): Promise<string[]> => {
    const res = await fetch(`${BASE_URL}/system/all-hard-skills`, {
        headers: jsonHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener catálogo");
    const data = await res.json();
    return (data.data ?? []).map((s: { name: string }) => s.name);
};

// Obtener nombres de habilidades que ya tiene el usuario (para evitar duplicados)
export const getUserSkillNames = async (): Promise<string[]> => {
    try {
        const data = await fetchSkills();
        const list: { name: string }[] = data.skills ?? [];
        return list.map((s) => s.name.toLowerCase());
    } catch {
        return [];
    }
};

// Registrar habilidad desde catálogo
export const postSkillFromCatalog = async (skillName: string, punctuation: number) => {
    const res = await fetchWithAuth(`${BASE_URL}/users/hard-skills`, {
        method: "POST",
        body: JSON.stringify({ skillName, punctuation }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Error al registrar habilidad");
    return data;
};

// Registrar nueva habilidad (no existe en catálogo)
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
        // Palabras inapropiadas/ofensivas
        if (data.message?.includes("inapropiado") || data.message?.includes("ofensivo")) {
            throw new Error("INAPPROPRIATE");
        }
        // Ya existe en habilidades del usuario
        if (data.message?.includes("ya tiene registrada")) {
            throw new Error("ALREADY_EXISTS");
        }
        // No reconocida como habilidad técnica
        if (data.message?.includes("no corresponde")) {
            return "not-found";
        }
        throw new Error(data.message ?? "Error al registrar habilidad");
    }
    return "success";
};

// Registrar habilidad (decide automáticamente si es del catálogo o nueva)
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

// Modificar nivel de habilidad existente
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

// Eliminar habilidad
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

// Obtener habilidades públicas (versión antigua, sin username específico)
export const fetchSkillsPublic = async () => {
    const res = await fetch(`${BASE_URL}/users/hard-skills`, {
        headers: jsonHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener habilidades públicas");
    return res.json();
};

// Función obsoleta (vacía, para compatibilidad)
export const getCatalogSkills = (): string[] => [];

