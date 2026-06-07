import { useState } from "react";
import { Search } from "lucide-react";
import { useEducation } from "../../features/Education/hooks/useEducation";
import EducationCard from "../../features/Education/components/EducationCard";
import EducationForm from "../../features/Education/components/EducationForm";
import ViewEducationPopup from "../../features/Education/components/ViewEducationPopup";
import EducationPopup from "../../features/Education/components/EducationPopup";
import ConfirmDeleteModal from "../../features/Education/components/DeleteEducationPopup";
import type { EducationEntry } from "../../features/Education/services/educationService";
import Button from "../../components/Button";

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
    pageBtn: (active: boolean) => `w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-nunito text-sm sm:text-base font-semibold transition-all ${active ? "bg-[#90DDF0] text-[#07393C]" : "border border-white/20 text-white/70 hover:border-[#90DDF0] hover:text-[#90DDF0]"}`,
    pageArrow: "w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-white/20 text-white/70 text-sm sm:text-base hover:border-[#90DDF0] hover:text-[#90DDF0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
    toast: "font-nunito text-sm text-center py-2 px-4 rounded-xl",
};

// Página principal de gestión de formación académica
const EducationPage = () => {
    const { entries, academicDegrees, isLoading, error, successMessage, addEntry, editEntry, deleteEntry } = useEducation();

    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);

    const [selectedEntry, setSelectedEntry] = useState<EducationEntry | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const closeAll = () => {
        setIsAddOpen(false);
        setIsEditOpen(false);
        setIsMenuOpen(false);
        setIsConfirmDeleteOpen(false);
        setIsViewOpen(false);
        setSelectedEntry(null);
    };

    const goToMenu = () => {
        setIsAddOpen(false);
        setIsEditOpen(false);
        setIsConfirmDeleteOpen(false);
        setIsViewOpen(false);
        setIsMenuOpen(true);
    };

    const handleSearch = () => {
        setActiveSearch(searchInput);
        setCurrentPage(1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };

    // Filtrar por título o institución
    const filtered = entries.filter((e) => {
        if (!activeSearch.trim()) return true;
        const term = activeSearch.toLowerCase();
        return e.degree.toLowerCase().includes(term) || e.institution.toLowerCase().includes(term);
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleCardClick = (entry: EducationEntry) => {
        setSelectedEntry(entry);
        setIsMenuOpen(true);
    };

    const handleViewDetail = () => {
        setIsMenuOpen(false);
        setIsViewOpen(true);
    };

    const handleEditClick = (entry: EducationEntry) => {
        setSelectedEntry(entry);
        setFormError(null);
        setIsMenuOpen(false);
        setIsEditOpen(true);
    };

    const handleDeleteClick = (entry: EducationEntry) => {
        setSelectedEntry(entry);
        setIsMenuOpen(false);
        setIsConfirmDeleteOpen(true);
    };

    const handleAddSubmit = async (data: Omit<EducationEntry, "id">) => {
        setIsSubmitting(true);
        setFormError(null);
        try {
            await addEntry(data);
            closeAll();
        } catch (err: any) {
            setFormError(err.message || "Error al registrar Formación Académica");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async (data: Omit<EducationEntry, "id">) => {
        if (!selectedEntry) return;
        setIsSubmitting(true);
        setFormError(null);
        try {
            await editEntry(selectedEntry.id, data);
            closeAll();
        } catch (err: any) {
            setFormError(err.message || "Error al modificar Formación Académica");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedEntry) return;
        setIsSubmitting(true);
        try {
            await deleteEntry(selectedEntry.id);
            // Si era el último elemento de la página, retroceder
            if (paginated.length === 1 && currentPage > 1) setCurrentPage((p) => p - 1);
            closeAll();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.pageContent}>
                <div className={styles.outerCard}>
                    <div className={styles.greenContainer}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Formación Académica</h1>
                            <div className={styles.searchRow}>
                                <div className={styles.searchInputWrapper}>
                                    <Search size={16} className={styles.searchIcon} />
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Buscar título o institución..."
                                        className={styles.searchInput}
                                    />
                                </div>

                                <div className={styles.actionRow}>
                                    <Button
                                        variant="secondary"
                                        onClick={handleSearch}
                                        disabled={isLoading}
                                        fullWidth
                                    >
                                        Buscar
                                    </Button>
                                    <Button
                                        variant="quaternary"
                                        onClick={() => { setFormError(null); setIsAddOpen(true); }}
                                        disabled={isLoading}
                                        fullWidth
                                    >
                                        Registrar
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Mensajes de error/éxito */}
                        {error && (
                            <p className={`${styles.toast} bg-red-500/10 border border-red-500 text-red-400`}>
                                {error}
                            </p>
                        )}
                        {successMessage && (
                            <p className={`${styles.toast} bg-[#90DDF0]/10 border border-[#90DDF0]/40 text-[#90DDF0]`}>
                                {successMessage}
                            </p>
                        )}

                        {isLoading ? (
                            <p className={styles.loading}>Cargando...</p>
                        ) : paginated.length === 0 ? (
                            <p className={styles.empty}>
                                {activeSearch ? "No se encontraron registros." : "No tienes experiencias académicas registradas."}
                            </p>
                        ) : (
                            <div className={styles.listWrapper}>
                                {paginated.map((entry) => (
                                    <EducationCard key={entry.id} entry={entry} onView={handleCardClick} />
                                ))}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button type="button" onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1} className={styles.pageArrow}>‹</button>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button key={i} type="button" onClick={() => setCurrentPage(i + 1)} className={styles.pageBtn(currentPage === i + 1)}>
                                        {i + 1}
                                    </button>
                                ))}
                                <button type="button" onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages} className={styles.pageArrow}>›</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Popup de acciones al hacer clic en una tarjeta */}
            {isMenuOpen && selectedEntry && (
                <EducationPopup
                    isOpen={isMenuOpen}
                    entry={selectedEntry}
                    onClose={closeAll}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onView={handleViewDetail}
                />
            )}

            {/* Modal para ver detalle */}
            {isViewOpen && selectedEntry && (
                <ViewEducationPopup
                    isOpen={isViewOpen}
                    entry={selectedEntry}
                    onClose={closeAll}
                    onBack={goToMenu}
                />
            )}

            {/* Modal para crear nueva entrada */}
            {isAddOpen && (
                <EducationForm
                    mode="add"
                    academicDegrees={academicDegrees}
                    onSubmit={handleAddSubmit}
                    onClose={closeAll}
                    serverError={formError}
                    isSubmitting={isSubmitting}
                />
            )}

            {/* Modal para editar entrada existente */}
            {isEditOpen && selectedEntry && (
                <EducationForm
                    mode="edit"
                    initial={selectedEntry}
                    academicDegrees={academicDegrees}
                    onSubmit={handleEditSubmit}
                    onClose={closeAll}
                    onBack={goToMenu}
                    serverError={formError}
                    isSubmitting={isSubmitting}
                />
            )}

            {/* Modal de confirmación para eliminar */}
            {isConfirmDeleteOpen && selectedEntry && (
                <ConfirmDeleteModal
                    degree={selectedEntry.degree}
                    onConfirm={handleConfirmDelete}
                    onClose={closeAll}
                    onBack={goToMenu}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
};

export default EducationPage;