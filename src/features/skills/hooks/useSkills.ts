import { useState, useEffect } from "react";
import type { Skill } from "../types/skill.types";
import { getSkills } from "../services/getSkills";

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getSkills();
        setSkills(data);
      } catch (err) {
        console.error("Error al obtener las habilidades:", err);
        setError("No se pudieron cargar las habilidades");
        setSkills([
          { id: "1", name: "HTML/CSS", level: 5 },
          { id: "2", name: "React", level: 4 },
          { id: "3", name: "TypeScript", level: 3 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const addSkill = (name: string, level: number) => {
    const newSkill: Skill = {
      id: crypto.randomUUID(),
      name,
      level,
    };
    setSkills((prev) => [...prev, newSkill]);
    // TODO: conectar a POST /skills
  };

  const editSkill = (id: string, name: string, level: number) => {
    setSkills((prev) =>
      prev.map((skill) => (skill.id === id ? { ...skill, name, level } : skill))
    );
    // TODO: conectar a PUT /skills/:id
  };

  const deleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((skill) => skill.id !== id));
    // TODO: conectar a DELETE /skills/:id
  };

  return { skills, isLoading, error, addSkill, editSkill, deleteSkill };
};