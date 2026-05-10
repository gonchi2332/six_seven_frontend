import { useState } from 'react';
import { Search } from 'lucide-react';
import { useWorkExperiences } from '../../hooks/useWorkExperiences';
import WorkExperienceItem from './WorkExperienceItem';
import WorkExperiencePopUp from './WorkExperiencePopUp';
import AddWorkExperienceModal from './AddWorkExperienceModal';
import EditWorkExperienceModal from './EditWorkExperienceModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import type { WorkExperience } from '../../hooks/useWorkExperiences';
import WorkExperienceDetailModal from './WorkExperienceDetailModal';

const PAGE_SIZE = 10;

const styles = {
    wrapper: "flex-1 flex flex-col overflow-hidden",
    pageContent: "flex-1 flex items-start justify-center px-3 sm:px-6 py-1 overflow-y-auto",
    outerCard: "w-full max-w-[1400px] px-2 sm:px-6 lg:px-14 py-4 sm:py-8 flex flex-col",
    greenContainer: "rounded-2xl border border-[#2C666E] bg-[#07393C] px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-3 sm:gap-4",
    header: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
    title: "text-xl sm:text-2xl font-bold font-inter text-white",
    searchRow: "flex flex-col sm:flex-row items-stretch sm:items-center gap-2",
    searchInputWrapper: "flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/10 bg-black/30 focus-within:border-[#90DDF0] transition-colors flex-1 sm:flex-none",
    searchIcon: "text-white shrink-0",
    searchInput: "bg-transparent outline-none text-white font-nunito text-[14px] sm:text-[15px] placeholder:text-white/40 w-full sm:w-56",
    actionRow: "flex items-center gap-2",
    searchBtn: "flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#2C666E] text-white font-nunito text-sm font-semibold transition-all hover:brightness-110 active:scale-95",
    addBtn: "flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#90DDF0] text-[#07393C] font-nunito text-sm font-semibold transition-all hover:brightness-110 active:scale-95",
    listWrapper: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3",
    empty: "text-white/70 font-nunito text-sm sm:text-base text-center py-8 sm:py-12 bg-black/20 rounded-xl border border-white/10",
    loading: "text-white/70 font-nunito text-sm sm:text-base text-center py-8 sm:py-12 bg-black/20 rounded-xl border border-white/10",
    pagination: "flex items-center justify-center gap-1 sm:gap-2 pt-2",
    pageBtn: (active: boolean) => `w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-nunito text-sm sm:text-base font-semibold transition-all ${active ? 'bg-[#90DDF0] text-[#07393C]' : 'border border-white/20 text-white/70 hover:border-[#90DDF0] hover:text-[#90DDF0]'}`,
    pageArrow: "w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-white/20 text-white/70 text-sm sm:text-base hover:border-[#90DDF0] hover:text-[#90DDF0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
    toast: "font-nunito text-sm text-center py-2 px-4 rounded-xl",
};

const WorkExperienceList = () => {
    const { experiences, isLoading, error, addExperience, updateExperience, deleteExperience } = useWorkExperiences();
    const [searchInput, setSearchInput] = useState('');
    const [activeSearch, setActiveSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState<WorkExperience | null>(null);
    const [experienceToDelete, setExperienceToDelete] = useState<number | null>(null);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const handleSearch = () => {
        setActiveSearch(searchInput);
        setCurrentPage(1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
    };

    const filteredExperiences = experiences.filter((experience) =>
        experience.position.toLowerCase().includes(activeSearch.toLowerCase()) ||
        experience.company_name.toLowerCase().includes(activeSearch.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filteredExperiences.length / PAGE_SIZE));
    const paginatedExperiences = filteredExperiences.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleAdd = () => {
        setIsAddModalOpen(true);
    };

    const handleView = (experience: WorkExperience) => {
        setSelectedExperience(experience);
        setIsDetailModalOpen(true);
    };

    const handleOpenInfo = (experience: WorkExperience) => {
        setIsDetailModalOpen(false); // Cerramos el menú
        setIsInfoOpen(true);        // Abrimos la info real
    };

    const handleEdit = (experience: WorkExperience) => {
        setIsDetailModalOpen(false);
        setIsInfoOpen(false);
        setSelectedExperience(experience);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setIsDetailModalOpen(false);
        setSelectedExperience(null);
        setExperienceToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (experienceToDelete) {
            await deleteExperience(experienceToDelete);
            setExperienceToDelete(null);
            setSelectedExperience(null);
            setIsDetailModalOpen(false);
            setIsConfirmModalOpen(false);
            setIsEditModalOpen(false);
            if (paginatedExperiences.length === 1 && currentPage > 1) {
                setCurrentPage((page) => page - 1);
            }
        }
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedExperience(null);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setIsDetailModalOpen(true);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.pageContent}>
                <div className={styles.outerCard}>
                    <div className={styles.greenContainer}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Experiencia Laboral</h1>

                            <div className={styles.searchRow}>
                                <div className={styles.searchInputWrapper}>
                                    <Search size={16} className={styles.searchIcon} />
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Buscar puesto o empresa..."
                                        className={styles.searchInput}
                                    />
                                </div>
                                <div className={styles.actionRow}>
                                    <button type="button" onClick={handleSearch} className={styles.searchBtn}>
                                        Buscar
                                    </button>
                                    <button type="button" onClick={handleAdd} className={styles.addBtn}>
                                        Agregar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <p className={`${styles.toast} bg-red-500/10 border border-red-500 text-red-400`}>{error}</p>
                        )}

                        {isLoading ? (
                            <p className={styles.loading}>Cargando...</p>
                        ) : paginatedExperiences.length === 0 ? (
                            <p className={styles.empty}>
                                {activeSearch ? 'No se encontraron registros.' : 'No tienes experiencias laborales registradas.'}
                            </p>
                        ) : (
                            <div className={styles.listWrapper}>
                                {paginatedExperiences.map((experience) => (
                                    <WorkExperienceItem
                                        key={experience.id}
                                        experience={experience}
                                        onView={handleView}
                                    />
                                ))}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((page) => page - 1)}
                                    disabled={currentPage === 1}
                                    className={styles.pageArrow}
                                >
                                    ‹
                                </button>
                                {Array.from({ length: totalPages }).map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={styles.pageBtn(currentPage === index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((page) => page + 1)}
                                    disabled={currentPage === totalPages}
                                    className={styles.pageArrow}
                                >
                                    ›
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddWorkExperienceModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={addExperience}
            />

            <EditWorkExperienceModal
                isOpen={isEditModalOpen && selectedExperience !== null}
                onClose={handleCloseEditModal}
                onEdit={updateExperience}
                experience={selectedExperience}
            />

            <WorkExperiencePopUp
                isOpen={isDetailModalOpen && selectedExperience !== null}
                experience={selectedExperience}
                onClose={() => setIsDetailModalOpen(false)}
                onView={handleOpenInfo} // Ahora llama a abrir la info real
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            <WorkExperienceDetailModal
                isOpen={isInfoOpen && selectedExperience !== null}
                experience={selectedExperience}
                onClose={() => {
                    setIsInfoOpen(false);
                    setIsDetailModalOpen(true);
                }}
            />

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
        </div>
    );
};

export default WorkExperienceList;