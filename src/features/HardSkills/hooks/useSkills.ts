import { useState, useEffect, useCallback } from "react";
import type { Skill } from "../types/skill.types";
import { fetchSkills, patchSkill, deleteSkill as apiDeleteSkill, fetchCatalogSkills, fetchSkillsPublicNew } from "../services/skillsService";
import { useParams } from "react-router-dom";

/*
  Características:
  -Hook personalizado que gestiona el estado y operaciones CRUD de habilidades técnicas
  -Maneja dos contextos:
    - Modo privado: carga habilidades del usuario autenticado (requiere token)
    - Modo público: carga habilidades de un usuario específico (vista de portafolio)
  -Detecta si hay username en la URL (modo público) y evita cargar datos privados
  -Carga catálogo de habilidades disponibles para autocompletado
  -Operaciones: agregar (local), editar, eliminar
  -Maneja mensajes de éxito y error (se autolimpian después de 3 segundos)

  @ Ejemplo modo privado:
  const { skills, catalogSkills, addSkill, editSkill, deleteSkill } = useSkills();

  @ Ejemplo modo público:
  const { publicSkills, isLoadingPublic, setPublicUser } = useSkills();
  setPublicUser("juanperez");
*/
export const useSkills = () => {
    const { username: publicUsernameUrl } = useParams<{ username: string }>();

    const [skills, setSkills] = useState<Skill[]>([]);
    const [catalogSkills, setCatalogSkills] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [publicSkills, setPublicSkills] = useState<Skill[]>([]);
    const [isLoadingPublic, setIsLoadingPublic] = useState(false);
    const [currentPublicUsername, setCurrentPublicUsername] = useState<string | null>(null);

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const showError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 3000);
    };

    // Carga de habilidades privadas (autenticado) - solo si no estamos en modo público por URL
    useEffect(() => {
        if (publicUsernameUrl) {
            setIsLoading(false);
            return;
        }

        const load = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [data, catalog] = await Promise.all([fetchSkills(), fetchCatalogSkills()]);
                const list = data.skills ?? [];

                const formattedSkills: Skill[] = list.map((s: any) => ({
                    skill_id: Number(s.skill_id),
                    name: s.name,
                    level: s.punctuation ?? s.level,
                    visible: s.visible === true || s.visible === 1 || String(s.visible) === "true"
                }));

                setSkills(formattedSkills);
                setCatalogSkills(catalog);
            } catch (err) {
                showError("No se pudieron cargar las habilidades");
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [publicUsernameUrl]);

    // Carga de habilidades públicas cuando cambia currentPublicUsername
    useEffect(() => {
        if (!currentPublicUsername || currentPublicUsername.trim() === "") {
            setPublicSkills([]);
            setIsLoadingPublic(false);
            return;
        }

        const fetchPublicUserSkills = async () => {
            setIsLoadingPublic(true);
            setError(null);
            try {
                const response = await fetchSkillsPublicNew(currentPublicUsername);
                const rawSkills = response?.data?.hardSkills ?? response?.skills ?? response?.data ?? [];

                const formattedSkills: Skill[] = rawSkills.map((s: any, index: number) => ({
                    skill_id: s.id ?? s.skill_id ?? index,
                    name: s.name,
                    level: s.level ?? s.punctuation ?? 0,
                    visible: true
                }));

                setPublicSkills(formattedSkills);
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : "Error al obtener habilidades públicas del usuario";
                showError(errorMsg);
                setPublicSkills([]);
            } finally {
                setIsLoadingPublic(false);
            }
        };

        fetchPublicUserSkills();
    }, [currentPublicUsername]);

    // Función pública para cambiar el usuario a visualizar en el portafolio
    const setPublicUser = useCallback((username: string | null) => {
        setCurrentPublicUsername(username);
    }, []);

    /*
      Agrega una habilidad localmente (optimista)
      -Asigna un ID temporal (timestamp)
      -No espera respuesta del backend, actualiza inmediatamente el estado
      -La habilidad se guarda realmente en el backend a través de postSkill
    */
    const addSkill = (name: string, level: number) => {
        const tempId = Date.now();
        const newSkill: Skill = {
            skill_id: tempId,
            name,
            level,
            visible: true
        };

        setSkills((prev) => [...prev, newSkill]);
        showSuccess("Habilidad registrada correctamente");
    };

    /*
      Edita una habilidad existente
      -Llama al servicio patchSkill para actualizar en el backend
      -Actualiza el estado local optimistamente
    */
    const editSkill = async (skillId: number | string, name: string, level: number) => {
        try {
            await patchSkill(name, level);
            setSkills((prev) =>
                prev.map((s) => (s.skill_id === Number(skillId) ? { ...s, name, level } : s))
            );
            showSuccess("Habilidad modificada correctamente");
        } catch (err) {
            throw err;
        }
    };

    /*
      Elimina una habilidad
      -Llama al servicio deleteSkill (por nombre)
      -Actualiza el estado local filtrando la habilidad eliminada
    */
    const deleteSkill = async (skillName: string) => {
        try {
            await apiDeleteSkill(skillName);
            setSkills((prev) => prev.filter((s) => s.name !== skillName));
            showSuccess("Habilidad eliminada correctamente");
        } catch (err) {
            throw err;
        }
    };

    return {
        skills,
        catalogSkills,
        isLoading,
        error,
        successMessage,
        addSkill,
        editSkill,
        deleteSkill,
        publicSkills,
        isLoadingPublic,
        setPublicUser,
        currentPublicUsername
    };
};

