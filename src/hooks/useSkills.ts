import { useState, useEffect } from "react";
import type { Skill } from "../features/skills/types/skill.types";
import { fetchSkills, patchSkill, deleteSkill as apiDeleteSkill } from "../services/skillsService";

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchSkills();
        const list = data.hardSkills ?? [];
        setSkills(
          list.map((s: { name: string; punctuation: number }) => ({
            id: s.name,
            name: s.name,
            level: s.punctuation,
          }))
        );
      } catch (err) {
        console.error(err);
        showError("No se pudieron cargar las habilidades");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const addSkill = (name: string, level: number) => {
    setSkills((prev) => [...prev, { id: name, name, level }]);
    showSuccess("Habilidad registrada correctamente");
  };

  const editSkill = async (id: string, name: string, level: number) => {
    try {
      const original = skills.find((s) => s.id === id);
      if (!original) return;

      if (original.name !== name) {
        await patchSkill(name, level);
        await apiDeleteSkill(original.name);
      } else {
        await patchSkill(name, level);
      }

      setSkills((prev) =>
        prev.map((s) => (s.id === id ? { id: name, name, level } : s))
      );

      showSuccess("Habilidad modificada correctamente");
    } catch (err: unknown) {
      throw err;
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      await apiDeleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      throw err;
    }
  };

  return { skills, isLoading, error, successMessage, addSkill, editSkill, deleteSkill };
};