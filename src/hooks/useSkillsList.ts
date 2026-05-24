import { useState } from "react";
import { useSkills } from "./useSkills";
import type { Skill } from "../features/skills/types/skill.types";

const PAGE_SIZE = 5;

const useSkillsList = () => {
    const { skills, isLoading, error, successMessage, addSkill, editSkill, deleteSkill } = useSkills();
    const [showAdd, setShowAdd] = useState(false);
    const [editTarget, setEditTarget] = useState<Skill | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(skills.length / PAGE_SIZE);
    const paginated = skills.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const handleAdd = (name: string, level: number) => {
        addSkill(name, level);
    };

    const handleEdit = async (id: string, name: string, level: number) => {
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

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteSkill(deleteTarget.id);
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