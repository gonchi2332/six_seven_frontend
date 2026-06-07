import { useState, useEffect, useCallback } from "react";
import type { EducationEntry, AcademicDegree } from "../services/educationService";
import {
    fetchEducation,
    fetchPublicEducation,
    fetchAcademicDegrees,
    createEducation,
    updateEducation,
    deleteEducation as apiDeleteEducation,
} from "../services/educationService";

/*
  Características:
  -Hook personalizado que gestiona el estado y operaciones CRUD de formación académica
  -Maneja dos conjuntos de datos: formaciones privadas (autenticado) y públicas (vista de portafolio)
  -Carga automática de grados académicos y formaciones privadas al montar el componente
  -Carga automática de formaciones públicas cuando cambia currentPublicUsername
  -Maneja mensajes de éxito y error (se autolimpian después de 3 segundos)
  -Operaciones CRUD: agregar, editar, eliminar (recargan la lista automáticamente)

  @ Ejemplo:
  const {
    entries, publicEntries, academicDegrees, isLoading,
    addEntry, editEntry, deleteEntry, setPublicUser
  } = useEducation();

  // Vista privada (panel de control)
  <EducationList entries={entries} onDelete={deleteEntry} />

  // Vista pública (portafolio)
  setPublicUser("juanperez");
  <PublicEducationList entries={publicEntries} isLoading={isLoadingPublic} />
*/
export const useEducation = () => {
    const [entries, setEntries] = useState<EducationEntry[]>([]);
    const [publicEntries, setPublicEntries] = useState<EducationEntry[]>([]);
    const [academicDegrees, setAcademicDegrees] = useState<AcademicDegree[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPublic, setIsLoadingPublic] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [publicError, setPublicError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [currentPublicUsername, setCurrentPublicUsername] = useState<string | null>(null);

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const showError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 3000);
    };

    // Carga de formaciones privadas y grados académicos al montar el componente
    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [data, degrees] = await Promise.all([
                    fetchEducation(),
                    fetchAcademicDegrees(),
                ]);
                setEntries(data);
                setAcademicDegrees(degrees);
            } catch {
                showError("No se pudieron cargar las formaciones académicas");
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    // Carga formaciones públicas automáticamente cuando cambia currentPublicUsername
    useEffect(() => {
        const fetchPublicUserEducation = async () => {
            if (!currentPublicUsername || currentPublicUsername.trim() === "") {
                setPublicEntries([]);
                setIsLoadingPublic(false);
                return;
            }

            setIsLoadingPublic(true);
            setPublicError(null);
            try {
                const data = await fetchPublicEducation(currentPublicUsername);
                setPublicEntries(data);
            } catch (err: any) {
                console.error(err);
                // No mostrar error de autenticación en vista pública
                if (!err.message?.includes("token") && !err.message?.includes("autenticacion") && !err.message?.includes("Authorization")) {
                    setPublicError(err.message || 'Error al obtener formaciones académicas públicas');
                }
                setPublicEntries([]);
            } finally {
                setIsLoadingPublic(false);
            }
        };

        fetchPublicUserEducation();
    }, [currentPublicUsername]);

    // Función pública para cambiar el usuario a visualizar en el portafolio
    const setPublicUser = useCallback((username: string | null) => {
        setCurrentPublicUsername(username);
    }, []);

    /*
      Agrega una nueva formación académica
      -Envía los datos al servicio createEducation
      -Actualiza la lista con la respuesta del servidor
    */
    const addEntry = async (data: Omit<EducationEntry, "id">) => {
        try {
            const updated = await createEducation(data);
            setEntries(updated);
            showSuccess("Formación académica registrada correctamente");
        } catch (err: unknown) {
            throw new Error(err instanceof Error ? err.message : "Error al registrar formación académica");
        }
    };

    /*
      Edita una formación académica existente
      -Envía los datos actualizados al servicio updateEducation
      -Actualiza la lista con la respuesta del servidor
    */
    const editEntry = async (id: string, data: Omit<EducationEntry, "id">) => {
        try {
            const updated = await updateEducation(id, data);
            setEntries(updated);
            showSuccess("Formación académica modificada correctamente");
        } catch (err: unknown) {
            throw new Error(err instanceof Error ? err.message : "Error al modificar formación académica");
        }
    };

    /*
      Elimina una formación académica:
      -Llama al servicio deleteEducation
      -Actualiza el estado local filtrando la entrada eliminada
    */
    const deleteEntry = async (id: string) => {
        try {
            await apiDeleteEducation(id);
            setEntries((prev) => prev.filter((e) => e.id !== id));
            showSuccess("Formación académica eliminada correctamente");
        } catch (err: unknown) {
            throw new Error(err instanceof Error ? err.message : "Error al eliminar formación académica");
        }
    };

    return {
        entries,
        publicEntries,
        academicDegrees,
        isLoading,
        isLoadingPublic,
        error,
        publicError,
        successMessage,
        addEntry,
        editEntry,
        deleteEntry,
        setPublicUser,
        currentPublicUsername,
    };
};

