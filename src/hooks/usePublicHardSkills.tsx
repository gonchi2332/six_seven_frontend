import { useState, useEffect } from "react";
import type { Skill } from "../features/skills/types/skill.types";
import { fetchSkillsPublic } from "../services/skillsService"; // Crearemos este service

export const usePublicHardSkills = (username: string | undefined) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!username) return;
      setIsLoading(true);
      try {
        const data = await fetchSkillsPublic(username);
        const list = data.hardSkills ?? [];
        setSkills(
          list.map((s: { name: string; punctuation: number }) => ({
            id: s.name,
            name: s.name,
            level: s.punctuation,
          }))
        );
      } catch (err) {
        setError("No se pudieron cargar las habilidades técnicas");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [username]);

  return { skills, isLoading, error };
};