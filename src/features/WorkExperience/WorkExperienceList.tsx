import { useState } from 'react';
import { useWorkExperiences } from '../../hooks/useWorkExperiences';
import WorkExperienceItem from './WorkExperienceItem';
import WorkExperienceDetailModal from './WorkExperienceDetailModal';
import AddWorkExperienceModal from './AddWorkExperienceModal';
import EditWorkExperienceModal from './EditWorkExperienceModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import type { WorkExperience } from '../../hooks/useWorkExperiences';

const styles = {
    container: "w-full",
    header: "flex justify-between items-center mb-6",
    title: "text-2xl font-bold text-surface font-inter",
    addButton: "px-4 py-2 rounded-xl bg-primary text-white text-sm font-nunito font-semibold transition-all hover:brightness-110 active:scale-95",
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
    empty: "text-surface text-center py-12 font-nunito col-span-full",
    loading: "text-surface text-center py-12 font-nunito col-span-full",
    error: "text-red-500 text-center py-12 font-nunito bg-red-500/10 rounded-xl col-span-full",
};

const WorkExperienceList = () => {
    const { experiences, isLoading, error, addExperience, updateExperience, deleteExperience } = useWorkExperiences();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState<WorkExperience | null>(null);
    const [experienceToDelete, setExperienceToDelete] = useState<number | null>(null);

    const handleAdd = () => {
        setIsAddModalOpen(true);
    };

    const handleView = (experience: WorkExperience) => {
        setSelectedExperience(experience);
        setIsDetailModalOpen(true);
    };

    const handleEdit = (experience: WorkExperience) => {
        // Cerrar modal de detalle antes de abrir edición
        setIsDetailModalOpen(false);
        setSelectedExperience(experience);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        // Cerrar modal de detalle antes de abrir confirmación
        setIsDetailModalOpen(false);
        setSelectedExperience(null);
        setExperienceToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (experienceToDelete) {
            await deleteExperience(experienceToDelete);
            // Limpiar todo después de eliminar
            setExperienceToDelete(null);
            setSelectedExperience(null);
            setIsDetailModalOpen(false);
            setIsConfirmModalOpen(false);
            setIsEditModalOpen(false);
        }
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedExperience(null);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedExperience(null);
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Experiencia Laboral</h2>
                    <button className={styles.addButton} disabled>Agregar</button>
                </div>
                <div className={styles.grid}>
                    <div className={styles.loading}>Cargando experiencias...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Experiencia Laboral</h2>
                    <button onClick={handleAdd} className={styles.addButton}>Agregar</button>
                </div>
                <div className={styles.grid}>
                    <div className={styles.error}>{error}</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Experiencia Laboral</h2>
                    <button onClick={handleAdd} className={styles.addButton} title="Agregar">
                        Agregar
                    </button>
                </div>

                <div className={styles.grid}>
                    {experiences.length === 0 ? (
                        <div className={styles.empty}>
                            No hay experiencias laborales aún. ¡Agrega una!
                        </div>
                    ) : (
                        experiences.map((exp) => (
                            <WorkExperienceItem
                                key={exp.id}
                                experience={exp}
                                onView={handleView}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Modal de detalle - solo mostrar si hay experiencia seleccionada */}
            <WorkExperienceDetailModal
                isOpen={isDetailModalOpen && selectedExperience !== null}
                experience={selectedExperience}
                onClose={handleCloseDetailModal}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            {/* Modal de agregar */}
            <AddWorkExperienceModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={addExperience}
            />

            {/* Modal de editar */}
            <EditWorkExperienceModal
                isOpen={isEditModalOpen && selectedExperience !== null}
                onClose={handleCloseEditModal}
                onEdit={updateExperience}
                experience={selectedExperience}
            />

            {/* Modal de confirmación de eliminación */}
            <ConfirmDeleteModal
                isOpen={isConfirmModalOpen}
                onClose={() => {
                    setIsConfirmModalOpen(false);
                    setExperienceToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Eliminar experiencia"
                message="¿Estás seguro de que deseas eliminar esta experiencia laboral?"
            />
        </>
    );
};

export default WorkExperienceList;