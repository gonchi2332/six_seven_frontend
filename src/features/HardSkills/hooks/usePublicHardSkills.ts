import { useState, useEffect } from "react";
import type { Skill } from "../types/skill.types";
import { fetchSkillsPublicNew } from "../services/skillsService";

/*
  Características:
  -Hook personalizado que carga las habilidades técnicas públicas de un usuario
  -Útil para la vista de portafolio público (no requiere autenticación)
  -Carga automáticamente cuando cambia el username
  -Mapea la respuesta del servicio al formato Skill (skill_id, name, level, visible)
  -Maneja estado de carga (isLoading) y errores (error)

  @ Parámetro: username - Nombre de usuario del portafolio a visualizar
  @ Retorna:
  -skills: Array de habilidades técnicas del usuario
  -isLoading: Estado de carga
  -error: Mensaje de error (opcional)

  @ Ejemplo:
  const { skills, isLoading, error } = usePublicHardSkills("juanperez");
  
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  return <SkillsList skills={skills} />;
*/
export const usePublicHardSkills = (username: string | undefined) => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!username) return;
            setIsLoading(true);
            try {
                const response = await fetchSkillsPublicNew(username);
                // Extrae las habilidades duras de la respuesta (puede venir en diferentes estructuras)
                const rawSkills = response?.data?.hardSkills ?? response?.skills ?? response?.data ?? [];
                setSkills(
                    rawSkills.map((s: { name: string; punctuation?: number; level?: number }, index: number) => ({
                        skill_id: index,
                        name: s.name,
                        level: s.punctuation ?? s.level ?? 0,
                        visible: true,
                    }))
                );
            } catch {
                setError("No se pudieron cargar las habilidades técnicas");
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [username]);

    return { skills, isLoading, error };
};

