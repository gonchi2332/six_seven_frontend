const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/skills/users`;
const getToken = () => localStorage.getItem("token") ?? "";
const getUsername = () => localStorage.getItem("username") ?? "";
const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Authorization ${getToken()}`,
});

const MOCK_CATALOG = [
  "javascript", "typescript", "react", "vue", "angular", "python", "java",
  "c#", "c++", "php", "ruby", "swift", "kotlin", "go", "rust", "sql",
  "postgresql", "mysql", "mongodb", "redis", "docker", "kubernetes",
  "git", "linux", "html", "css", "tailwind", "node", "express", "django",
  "spring", "laravel", "flutter", "react native", "figma", "photoshop",
];

const BAD_WORDS = [
  "mierda", "puta", "puto", "culo", "idiota", "estupido", "estúpido",
  "pendejo", "cabron", "cabrón", "coño", "joder",
];

const containsBadWord = (text: string): boolean => {
  const lower = text.toLowerCase();
  return BAD_WORDS.some((word) => lower.includes(word));
};

export const fetchSkills = async () => {
  const username = getUsername();
  const res = await fetch(`${BASE_URL}/hard-skills?username=${username}`, { headers: headers() });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message ?? "Error al obtener habilidades");
  }
  return res.json();
};

export const getCatalogSkills = (): string[] => {
  return MOCK_CATALOG;
};

export const getUserSkillNames = async (): Promise<string[]> => {
  try {
    const data = await fetchSkills();
    const list: { name: string }[] = data.hardSkills ?? [];
    return list.map((s) => s.name.toLowerCase());
  } catch {
    return [];
  }
};

export const patchSkill = async (skillName: string, newPunctuation: number) => {
  const res = await fetch(`${BASE_URL}/hard-skills`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({ skillName, newPunctuation }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message ?? "Error al modificar habilidad");
  }
};

export const deleteSkill = async (skillName: string) => {
  const res = await fetch(`${BASE_URL}/hard-skills`, {
    method: "DELETE",
    headers: headers(),
    body: JSON.stringify({ skillName }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message ?? "Error al eliminar habilidad");
  }
};

export const fetchSkillsPublic = async (username: string) => {
  const res = await fetch(`${BASE_URL}/hard-skills?username=${username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Error al obtener habilidades públicas");
  return res.json();
};

export const postSkill = async (
  skillName: string,
  punctuation: number
): Promise<"success" | "not-found"> => {
  if (containsBadWord(skillName)) {
    throw new Error("INAPPROPRIATE");
  }

  const userSkills = await getUserSkillNames();
  if (userSkills.includes(skillName.toLowerCase())) {
    throw new Error("ALREADY_EXISTS");
  }

  const existsInCatalog = MOCK_CATALOG.includes(skillName.toLowerCase());

  await fetch(`${BASE_URL}/hard-skills`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ skillName, punctuation }),
  });

  return existsInCatalog ? "success" : "not-found";
};