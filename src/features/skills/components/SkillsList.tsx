import { useState } from "react";
import SkillBar from "./SkillBar";
import AddSkillPopup from "./AddSkillPopup";
import EditSkillPopup from "./EditSkillPopup";
import DeleteSkillPopup from "./DeleteSkillPopup";
import { useSkills } from "../../../hooks/useSkills";
import type { Skill } from "../types/skill.types";

const styles = {
  container: "flex flex-col gap-3",
  header: "flex justify-between items-center mb-2",
  title: "text-xl font-semibold text-surface font-inter",
  empty: "text-surface text-center py-8 font-nunito",
  loading: "text-surface/50 text-center py-8 font-nunito",
  error: "text-red-500 text-center py-8 font-nunito bg-red-500/10 rounded-xl",
  success: "text-green-300 font-nunito text-sm py-1",
  addButton: "w-10 h-10 rounded-xl bg-primary text-surface hover:bg-primary/90 transition-colors flex items-center justify-center text-2xl font-bold",
};

const SkillsList = () => {
  const { skills, isLoading, error, successMessage, addSkill, editSkill, deleteSkill } = useSkills();
  const [showAdd, setShowAdd] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = () => {
    setModalError(null);
    setShowAdd(true);
  };

  const handleEdit = (skill: Skill) => {
    setModalError(null);
    setEditingSkill(skill);
  };

  const handleSaveAdd = async (name: string, level: number) => {
    setModalError(null);
    setIsSubmitting(true);
    try {
      await addSkill(name, level);
      setShowAdd(false);
    } catch (err: any) {
    
      setModalError(err?.message || JSON.stringify(err) || "Error al guardar");
      throw err; 
    }finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (id: string, name: string, level: number) => {
    setModalError(null);
    setIsSubmitting(true);
    try {
      await editSkill(id, name, level);
      setEditingSkill(null);
    } catch (err: any) {
  
      setModalError(err?.message || JSON.stringify(err) || "Error al guardar");
      throw err; 
    }finally {
          setIsSubmitting(false);
        }
      };

  const handleConfirmDelete = async () => {
    if (!deletingSkill) return;
    setIsSubmitting(true);
    try {
      await deleteSkill(deletingSkill.id);
      setDeletingSkill(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Cargando habilidades técnicas...</div>;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Habilidades Técnicas</h2>
          <button onClick={handleAdd} className={styles.addButton} title="Agregar">
            +
          </button>
        </div>

        {successMessage && <p className={styles.success}>{successMessage}</p>}
        {error && <div className={styles.error}>{error}</div>}

        {!error && skills.length === 0 ? (
          <div className={styles.empty}>No hay habilidades técnicas aún. ¡Agrega una!</div>
        ) : (
          skills.map((skill) => (
            <SkillBar
              key={skill.id}
              skill={skill}
              onEdit={handleEdit}
              onDelete={setDeletingSkill}
            />
          ))
        )}
      </div>

      {showAdd && (
        <AddSkillPopup
          onSubmit={handleSaveAdd}
          onClose={() => setShowAdd(false)}
          serverError={modalError}
          isSubmitting={isSubmitting}
        />
      )}

      {editingSkill && (
        <EditSkillPopup
          skill={editingSkill}
          onSubmit={handleSaveEdit}
          onClose={() => setEditingSkill(null)}
          serverError={modalError}
          isSubmitting={isSubmitting}
        />
      )}

      {deletingSkill && (
        <DeleteSkillPopup
          skillName={deletingSkill.name}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingSkill(null)}
        />
      )}
    </>
  );
};

export default SkillsList;