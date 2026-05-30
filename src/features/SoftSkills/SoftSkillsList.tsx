import { useState } from 'react';
import { useSoftSkills } from '../../hooks/userSoftSkills';
import { SoftSkillItem } from './SoftSkillItem';
import AddSoftSkillPopup from './AddSoftSkillPopup';
import ConfirmModal from './ConfirmModal';

const PAGE_SIZE = 5;

const styles = {
    container: "flex flex-col gap-3",
    header: "flex justify-between items-center mb-2",
    title: "text-xl font-semibold text-surface font-inter",
    empty: "text-surface text-center py-8 font-nunito",
    loading: "text-surface/50 text-center py-8 font-nunito",
    success: "text-green-300 font-nunito text-sm py-1",
    addButton: "px-4 py-2 rounded-xl bg-primary text-white text-sm font-nunito font-semibold transition-all hover:brightness-110 active:scale-95",
    list: "flex flex-col gap-3",
    paginationWrapper: "flex items-center justify-center gap-4 pt-3",
    paginationBtn: "w-10 h-10 rounded-xl border border-white text-white flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed",
    paginationLabel: "text-[14px] font-nunito text-surface/70",
};

const SoftSkillsList = () => {
    const { skills, isLoading, successMessage, username, addSkill, removeSkill } = useSoftSkills();
    const [modalOpen, setModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(skills.length / PAGE_SIZE);
    const paginated = skills.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleSubmit = (name: string) => {
        addSkill(name);
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
            if (paginated.length === 1 && currentPage > 1) {
                setCurrentPage((p) => p - 1);
            }
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
                    <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className={styles.addButton}
                        disabled={isSubmitting}
                    >
                        Agregar
                    </button>
                </div>

                {successMessage && <p className={styles.success}>{successMessage}</p>}

                {skills.length === 0 ? (
                    <div className={styles.empty}>No hay habilidades blandas aún. ¡Agrega una!</div>
                ) : (
                    <>
                        <div className={styles.list}>
                            {paginated.map((skill, index) => (
                                <SoftSkillItem
                                    key={index}
                                    skillName={skill.name}
                                    onDelete={handleDeleteClick}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className={styles.paginationWrapper}>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className={styles.paginationBtn}
                                >
                                    ‹
                                </button>
                                <span className={styles.paginationLabel}>
                                    {currentPage} / {totalPages}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className={styles.paginationBtn}
                                >
                                    ›
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {modalOpen && (
                <AddSoftSkillPopup
                    onSubmit={handleSubmit}
                    onClose={() => setModalOpen(false)}
                    username={username}
                    userSkills={skills}
                />
            )}

            <ConfirmModal
                isOpen={confirmModalOpen}
                onClose={() => {
                    setConfirmModalOpen(false);
                    setSkillToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title={`Eliminar: ${skillToDelete}`}
                message="¿Estás seguro que quieres eliminar esta habilidad?"
                isLoading={isSubmitting}
            />
        </>
    );
};

export default SoftSkillsList;