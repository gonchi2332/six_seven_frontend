import { useState } from "react";
import { useSkills } from "./useSkills";
import type { Skill } from "../types/skill.types";

const PAGE_SIZE = 5;

/*
  Características:
  -Hook personalizado que orquesta la página de gestión de habilidades técnicas
  -Combina useSkills (CRUD) con lógica de UI local
  -Paginación: 5 habilidades por página (PAGE_SIZE = 5)
  -Maneja estados de UI: popup de agregar, editar, eliminar
  -Maneja estado de carga y errores del servidor
  -isSubmitting: deshabilita botones durante operaciones CRUD
  -Después de eliminar, si la página actual queda vacía, retrocede una página automáticamente

  @ Ejemplo:
  const {
    paginated, isLoading, totalPages, currentPage, setCurrentPage,
    showAdd, setShowAdd, editTarget, setEditTarget, deleteTarget, setDeleteTarget,
    handleAdd, handleEdit, handleDelete
  } = useSkillsList();
*/
const useSkillsList = () => {
    const { skills, isLoading, error, successMessage, addSkill, editSkill, deleteSkill } = useSkills();
    const [showAdd, setShowAdd] = useState(false);
    const [editTarget, setEditTarget] = useState<Skill | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Paginación: calcula total de páginas y obtiene los elementos de la página actual
    const totalPages = Math.ceil(skills.length / PAGE_SIZE);
    const paginated = skills.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    
    const handleAdd = (name: string, level: number) => {
        addSkill(name, level);
    };

    /*
      Maneja la edición de una habilidad
      -Muestra estado de carga durante la operación
      -Captura errores del servidor y los muestra en el popup
      -Al finalizar, cierra el popup de edición
    */
    const handleEdit = async (id: string | number, name: string, level: number) => {
        setServerError(null);
        setIsSubmitting(true);
        try {
            await editSkill(id, name, level);
            setEditTarget(null);
        } catch (err: unknown) {
            setServerError(err instanceof Error ? err.message : "Error al modificar");
        } finally {
            setIsSubmitting(false);
        }
    };

    /*
      Maneja la eliminación de una habilidad
      -Ejecuta la eliminación a través del servicio
      -Si la página actual queda vacía después de eliminar, retrocede a la página anterior
      -Cierra el popup de eliminación al finalizar
    */
    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteSkill(deleteTarget.name);
            setDeleteTarget(null);
            if (paginated.length === 1 && currentPage > 1) {
                setCurrentPage((p) => p - 1);
            }
        } catch {
            setDeleteTarget(null);
        }
    };

    return {
        skills,
        isLoading,
        error,
        successMessage,
        paginated,
        totalPages,
        currentPage,
        setCurrentPage,
        showAdd,
        setShowAdd,
        editTarget,
        setEditTarget,
        deleteTarget,
        setDeleteTarget,
        serverError,
        isSubmitting,
        handleAdd,
        handleEdit,
        handleDelete,
    };
};

export default useSkillsList;

