const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/skills/users`;

const getToken = () => localStorage.getItem("token") ?? "";
const getUsername = () => localStorage.getItem("username") ?? "";

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Authorization ${getToken()}`,
});



export const fetchSkills = async () => {
  const username = getUsername();
  const res = await fetch(`${BASE_URL}/hard-skills?username=${username}`, { headers: headers() });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message ?? "Error al obtener habilidades");
  }
  return res.json();
};
export const postSkill = async (skillName: string, punctuation: number) => {
  const res = await fetch(`${BASE_URL}/hard-skills`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ skillName, punctuation }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message ?? "Error al registrar habilidad");
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