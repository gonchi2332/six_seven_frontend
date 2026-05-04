import { useState } from "react";
import { Search } from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import { useSkills } from "../hooks/useSkills";
import AddSkillPopup from "../features/skills/components/AddSkillPopup";
import EditSkillPopup from "../features/skills/components/EditSkillPopup";
import DeleteSkillPopup from "../features/skills/components/DeleteSkillPopup";
import ViewHardSkillPopup from "../features/skills/components/ViewHardSkillPopup";
import type { Skill } from "../features/skills/types/skill.types";

const TOTAL_BARS = 5;
const PAGE_SIZE = 5;

const styles = {
    wrapper: "h-screen bg-main flex flex-col overflow-hidden",
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
    listWrapper: "flex flex-col gap-2 sm:gap-3",
    empty: "text-white/70 font-nunito text-sm sm:text-base text-center py-8 sm:py-12 bg-black/20 rounded-xl border border-white/10",
    loading: "text-white/70 font-nunito text-sm sm:text-base text-center py-8 sm:py-12 bg-black/20 rounded-xl border border-white/10",
    skillRow: "flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 rounded-xl border border-white/10 bg-black/30 hover:border-[#90DDF0]/40 transition-all gap-2 sm:gap-6",
    skillLeft: "flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 flex-1 min-w-0",
    skillName: "text-white font-nunito text-[14px] sm:text-[16px] sm:w-36 shrink-0 truncate",
    barsWrapper: "flex gap-1 sm:gap-1.5 p-1 flex-1 bg-black/40 rounded-md",
    barActive: "h-2 sm:h-3 flex-1 rounded-sm bg-[#90DDF0]",
    barInactive: "h-2 sm:h-3 flex-1 rounded-sm bg-white/10",
    skillButtons: "flex items-center gap-1 sm:gap-2 shrink-0 sm:pl-4 sm:border-l sm:border-white/10",
    btnVer: "px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/20 text-white font-nunito text-xs sm:text-sm hover:border-[#90DDF0] hover:text-[#90DDF0] transition-colors",
    btnModificar: "px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/20 text-white font-nunito text-xs sm:text-sm hover:border-[#90DDF0] hover:text-[#90DDF0] transition-colors",
    btnEliminar: "px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-red-500/40 text-red-400 font-nunito text-xs sm:text-sm hover:border-red-400 hover:text-red-300 transition-colors",
    pagination: "flex items-center justify-center gap-1 sm:gap-2 pt-2",
    pageBtn: (active: boolean) => `w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-nunito text-sm sm:text-base font-semibold transition-all ${active ? "bg-[#90DDF0] text-[#07393C]" : "border border-white/20 text-white/70 hover:border-[#90DDF0] hover:text-[#90DDF0]"}`,
    pageArrow: "w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-white/20 text-white/70 text-sm sm:text-base hover:border-[#90DDF0] hover:text-[#90DDF0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
    toast: "font-nunito text-sm text-center py-2 px-4 rounded-xl",
};

const HardSkillsPage = () => {
    const { skills, isLoading, error, successMessage, addSkill, editSkill, deleteSkill } = useSkills();
    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showAdd, setShowAdd] = useState(false);
    const [skillToView, setSkillToView] = useState<Skill | null>(null);
    const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);
    const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
    const [editError, setEditError] = useState<string | null>(null);
    const [isEditSubmitting, setIsEditSubmitting] = useState(false);

    const handleSearch = () => {
        setActiveSearch(searchInput);
        setCurrentPage(1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };

    const filtered = skills.filter((s) =>
        s.name.toLowerCase().includes(activeSearch.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleAddSubmit = async (name: string, level: number) => {
        await addSkill(name, level);
    };

    const handleEditSubmit = async (id: string, name: string, level: number) => {
        setIsEditSubmitting(true);
        setEditError(null);
        try {
            await editSkill(id, name, level);
            setSkillToEdit(null);
        } catch {
            setEditError("Ocurrió un error al guardar los cambios.");
        } finally {
            setIsEditSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!skillToDelete) return;
        await deleteSkill(skillToDelete.id);
        setSkillToDelete(null);
    };

    return (
        <div className={styles.wrapper}>
            <Navbar />

            <div className={styles.pageContent}>
                <div className={styles.outerCard}>
                    <div className={styles.greenContainer}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Habilidades Técnicas</h1>

                            <div className={styles.searchRow}>
                                <div className={styles.searchInputWrapper}>
                                    <Search size={16} className={styles.searchIcon} />
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Buscar habilidad..."
                                        className={styles.searchInput}
                                    />
                                </div>
                                <div className={styles.actionRow}>
                                    <button type="button" onClick={handleSearch} className={styles.searchBtn}>
                                        Buscar
                                    </button>
                                    <button type="button" onClick={() => setShowAdd(true)} className={styles.addBtn}>
                                        Agregar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <p className={`${styles.toast} bg-red-500/10 border border-red-500 text-red-400`}>{error}</p>
                        )}
                        {successMessage && (
                            <p className={`${styles.toast} bg-[#90DDF0]/10 border border-[#90DDF0]/40 text-[#90DDF0]`}>{successMessage}</p>
                        )}

                        {isLoading ? (
                            <p className={styles.loading}>Cargando...</p>
                        ) : paginated.length === 0 ? (
                            <p className={styles.empty}>
                                {activeSearch ? "No se encontraron habilidades." : "No tienes habilidades registradas."}
                            </p>
                        ) : (
                            <div className={styles.listWrapper}>
                                {paginated.map((skill) => (
                                    <div key={skill.id} className={styles.skillRow}>
                                        <div className={styles.skillLeft}>
                                            <span className={styles.skillName}>{skill.name}</span>
                                            <div className={styles.barsWrapper}>
                                                {Array.from({ length: TOTAL_BARS }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={i < skill.level ? styles.barActive : styles.barInactive}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className={styles.skillButtons}>
                                            <button
                                                type="button"
                                                onClick={() => setSkillToView(skill)}
                                                className={styles.btnVer}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setEditError(null); setSkillToEdit(skill); }}
                                                className={styles.btnModificar}
                                            >
                                                Modificar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setSkillToDelete(skill)}
                                                className={styles.btnEliminar}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                    disabled={currentPage === 1}
                                    className={styles.pageArrow}
                                >
                                    ‹
                                </button>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={styles.pageBtn(currentPage === i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((p) => p + 1)}
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

            {showAdd && (
                <AddSkillPopup
                    onSubmit={handleAddSubmit}
                    onClose={() => setShowAdd(false)}
                />
            )}

            {skillToView && (
                <ViewHardSkillPopup
                    skill={skillToView}
                    onClose={() => setSkillToView(null)}
                />
            )}

            {skillToEdit && (
                <EditSkillPopup
                    skill={skillToEdit}
                    onSubmit={handleEditSubmit}
                    onClose={() => setSkillToEdit(null)}
                    serverError={editError}
                    isSubmitting={isEditSubmitting}
                />
            )}

            {skillToDelete && (
                <DeleteSkillPopup
                    skillName={skillToDelete.name}
                    onConfirm={handleDeleteConfirm}
                    onClose={() => setSkillToDelete(null)}
                />
            )}
        </div>
    );
};

export default HardSkillsPage;