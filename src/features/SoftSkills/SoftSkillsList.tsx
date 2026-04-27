import { useState } from 'react';
import { useSoftSkills } from '../../hooks/userSoftSkills';
import { SoftSkillItem } from './SoftSkillItem';
import SoftSkillModal from './SoftSkillModal';
import ConfirmModal from './ConfirmModal';

const styles = {
    container: "flex flex-col gap-3",
    header: "flex justify-between items-center mb-2",
    title: "text-xl font-semibold text-surface font-inter",
    empty: "text-surface/50 text-center py-8 font-nunito",
    loading: "text-surface/50 text-center py-8 font-nunito",
    error: "text-red-500 text-center py-8 font-nunito bg-red-500/10 rounded-xl",
    addButton: "w-10 h-10 rounded-xl bg-primary text-surface hover:bg-primary/90 transition-colors flex items-center justify-center text-2xl font-bold",
};
const SoftSkillsList = () => {
    const { skills, isLoading, addSkill, editSkill, removeSkill } = useSoftSkills();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<string | null>(null);
    const [modalError, setModalError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Estado para el modal de confirmación
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState<string | null>(null);

    const handleAdd = () => {
        setEditingSkill(null);
        setModalError(null);
        setModalOpen(true);
    };

    const handleEdit = (name: string) => {
        setEditingSkill(name);
        setModalError(null);
        setModalOpen(true);
    };

    const handleDeleteClick = (name: string) => {
        setSkillToDelete(name);
        setConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!skillToDelete) return;
        
        setIsSubmitting(true);
        try {
            await removeSkill(skillToDelete);
            setConfirmModalOpen(false);
            setSkillToDelete(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSave = async (newName: string, oldName?: string) => {
        setModalError(null);
        setIsSubmitting(true);
        try {
            if (oldName) {
                await editSkill(oldName, newName);
            } else {
                await addSkill(newName);
            }
            setModalOpen(false);
        } catch (err: any) {
            setModalError(err.message || 'Error al guardar la habilidad');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Cargando habilidades blandas...</div>;
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Habilidades Blandas</h2>
                    <button onClick={handleAdd} className={styles.addButton} title="Agregar" disabled={isSubmitting}>
                        +
                    </button>
                </div>

                {skills.length === 0 ? (
                    <div className={styles.empty}>
                        No hay habilidades blandas aún. ¡Agrega una!
                    </div>
                ) : (
                    skills.map((skill, index) => (
                        <SoftSkillItem
                            key={index}
                            skillName={skill.name}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                        />
                    ))
                )}
            </div>

            {/* Modal para agregar/editar */}
            <SoftSkillModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                initialName={editingSkill || ''}
                isEditing={!!editingSkill}
                error={modalError}
                isSubmitting={isSubmitting}
            />

            {/* Modal de confirmación para eliminar */}
            <ConfirmModal
                isOpen={confirmModalOpen}
                onClose={() => {
                    setConfirmModalOpen(false);
                    setSkillToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Eliminar habilidad"
                message={`¿Estás seguro de que deseas eliminar la habilidad "${skillToDelete}"?`}
                isLoading={isSubmitting}
            />
        </>
    );
};

export default SoftSkillsList;