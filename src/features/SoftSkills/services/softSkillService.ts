// services/softSkillService.ts
import { fetchWithAuth } from "../../../services/refreshToken";

export interface SoftSkill {
    name: string;
    visible: boolean;
    skill_id: string;
}

export interface CreateSoftSkillDto {
    skillName: string;
}

export interface DeleteSoftSkillDto {
    skillName: string;
}

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/skills`;

const jsonHeaders = () => ({
    "Content-Type": "application/json",
});

// Obtener habilidades blandas de un usuario por nombre de usuario
export const getSoftSkills = async (username: string): Promise<SoftSkill[]> => {
    const res = await fetchWithAuth(`${BASE_URL}/users/soft-skills?username=${username}`, {
        method: "GET",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Error al obtener habilidades blandas");
    return data.skills ?? [];
};

// Obtener habilidades blandas publicas de un usuario
export const fetchPublicSoftSkills = async (username: string): Promise<SoftSkill[]> => {
    const res = await fetch(`${BASE_URL}/users/${username}/soft-skills`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Error al obtener habilidades blandas");
    return data.skills ?? [];
};

// Obtener catalogo de todas las habilidades blandas disponibles
export const fetchCatalogSoftSkills = async (): Promise<string[]> => {
    const res = await fetch(`${BASE_URL}/system/all-soft-skills`, {
        headers: jsonHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener catálogo de habilidades blandas");
    const data = await res.json();
    return (data.data ?? []).map((s: { name: string }) => s.name);
};

// Obtener nombres de habilidades blandas de un usuario en minusculas
export const getUserSoftSkillNames = async (username: string): Promise<string[]> => {
    try {
        const data = await getSoftSkills(username);
        return data.map((s) => s.name.toLowerCase());
    } catch {
        return [];
    }
};

// Registrar una habilidad blanda desde el catalogo
export const postSoftSkillFromCatalog = async (skillName: string): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/users/soft-skills`, {
        method: "POST",
        body: JSON.stringify({ skillName }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Error al registrar habilidad blanda");
};

// Registrar una nueva habilidad blanda no existente en el catalogo
export const postNewSoftSkill = async (
    skillName: string
): Promise<"success" | "not-found"> => {
    const res = await fetchWithAuth(`${BASE_URL}/users/new-soft-skill`, {
        method: "POST",
        body: JSON.stringify({ skillName }),
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
        throw new Error(data.message ?? "Error al registrar habilidad blanda");
    }
    return "success";
};

// Registrar habilidad blanda intentando primero desde catalogo
export const postSoftSkill = async (
    skillName: string
): Promise<"success" | "not-found"> => {
    try {
        await postSoftSkillFromCatalog(skillName);
        return "success";
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "";

        if (msg.includes("no existe")) {
            return postNewSoftSkill(skillName);
        }
        if (msg.includes("ya tiene registrada")) {
            throw new Error("ALREADY_EXISTS");
        }
        throw err;
    }
};

// Eliminar una habilidad blanda de un usuario
export const deleteSoftSkill = async (data: DeleteSoftSkillDto): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/users/soft-skills`, {
        method: "DELETE",
        body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message ?? "Error al eliminar habilidad blanda");
};

// Crear una habilidad blanda (alias de postSoftSkillFromCatalog)
export const createSoftSkill = async (data: CreateSoftSkillDto): Promise<void> => {
    await postSoftSkillFromCatalog(data.skillName);
};