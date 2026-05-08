export interface SoftSkill {
    name: string;
}

export interface CreateSoftSkillDto {
    skillName: string;
}

export interface DeleteSoftSkillDto {
    skillName: string;
}

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/skills`;

const getToken = () => localStorage.getItem("token") ?? "";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
});

const jsonHeaders = () => ({
    "Content-Type": "application/json",
});

export const getSoftSkills = async (username: string): Promise<SoftSkill[]> => {
    const res = await fetch(`${BASE_URL}/users/soft-skills?username=${username}`, {
        headers: jsonHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Error al obtener habilidades blandas");
    return data.skills ?? [];
};

export const fetchCatalogSoftSkills = async (): Promise<string[]> => {
    const res = await fetch(`${BASE_URL}/system/all-soft-skills`, {
        headers: jsonHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener catálogo de habilidades blandas");
    const data = await res.json();
    return (data.data ?? []).map((s: { name: string }) => s.name);
};

export const getUserSoftSkillNames = async (username: string): Promise<string[]> => {
    try {
        const data = await getSoftSkills(username);
        return data.map((s) => s.name.toLowerCase());
    } catch {
        return [];
    }
};

export const postSoftSkillFromCatalog = async (skillName: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/users/soft-skills`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ skillName }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Error al registrar habilidad blanda");
};

export const postNewSoftSkill = async (
    skillName: string
): Promise<"success" | "not-found"> => {
    const res = await fetch(`${BASE_URL}/users/new-soft-skill`, {
        method: "POST",
        headers: authHeaders(),
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

export const deleteSoftSkill = async (data: DeleteSoftSkillDto): Promise<void> => {
    const res = await fetch(`${BASE_URL}/users/soft-skills`, {
        method: "DELETE",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message ?? "Error al eliminar habilidad blanda");
};

export const createSoftSkill = async (data: CreateSoftSkillDto): Promise<void> => {
    await postSoftSkillFromCatalog(data.skillName);
};