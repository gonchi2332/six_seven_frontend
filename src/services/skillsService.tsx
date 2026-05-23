const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/skills`;
const getToken = () => localStorage.getItem("token") ?? "";
const getUsername = () => localStorage.getItem("username") ?? "";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
});

const jsonHeaders = () => ({
    "Content-Type": "application/json",
});

export const fetchSkillsPublicNew = async (username: string) => {
    const res = await fetch(`${BASE_URL}/users/${username}/hard-skills`);
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Error al obtener habilidades");
    }
    return res.json();
}


export const fetchSkills = async () => {
    const username = getUsername();
    const res = await fetch(`${BASE_URL}/users/hard-skills?username=${username}`, {
        headers: authHeaders(),
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Error al obtener habilidades");
    }
    return res.json();
};

export const fetchCatalogSkills = async (): Promise<string[]> => {
    const res = await fetch(`${BASE_URL}/system/all-hard-skills`, {
        headers: jsonHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener catálogo");
    const data = await res.json();
    return (data.data ?? []).map((s: { name: string }) => s.name);
};

export const getUserSkillNames = async (): Promise<string[]> => {
    try {
        const data = await fetchSkills();
        const list: { name: string }[] = data.skills ?? [];
        return list.map((s) => s.name.toLowerCase());
    } catch {
        return [];
    }
};

export const postSkillFromCatalog = async (skillName: string, punctuation: number) => {
    const res = await fetch(`${BASE_URL}/users/hard-skills`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ skillName, punctuation }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Error al registrar habilidad");
    return data;
};

export const postNewSkill = async (
    skillName: string,
    punctuation: number
): Promise<"success" | "not-found"> => {
    const res = await fetch(`${BASE_URL}/users/new-hard-skill`, {
        method: "POST",
        headers: authHeaders(),
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

export const patchSkill = async (skillName: string, newPunctuation: number) => {
    const res = await fetch(`${BASE_URL}/users/hard-skills`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ skillName, newPunctuation }),
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Error al modificar habilidad");
    }
};

export const deleteSkill = async (skillName: string) => {
    const res = await fetch(`${BASE_URL}/users/hard-skills`, {
        method: "DELETE",
        headers: authHeaders(),
        body: JSON.stringify({ skillName }),
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Error al eliminar habilidad");
    }
};

export const fetchSkillsPublic = async () => {
    const res = await fetch(`${BASE_URL}/users/hard-skills`, {
        headers: jsonHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener habilidades públicas");
    return res.json();
};

export const getCatalogSkills = (): string[] => [];
