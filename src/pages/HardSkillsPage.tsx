import { useState } from "react";
import { Search } from "lucide-react";
import { useSkills } from "../hooks/useSkills";
import AddSkillPopup from "../features/skills/components/AddSkillPopup";
import EditSkillPopup from "../features/skills/components/EditSkillPopup";
import DeleteSkillPopup from "../features/skills/components/DeleteSkillPopup";
import ViewHardSkillPopup from "../features/skills/components/ViewHardSkillPopup";
import type { Skill } from "../features/skills/types/skill.types";

const TOTAL_BARS = 5;
const PAGE_SIZE_COMPACT = 3;
const PAGE_SIZE_FULL = 5;

type ActionMode = "ver" | "edit" | "delete";

const styles = {
    wrapper: "flex-1 flex flex-col overflow-hidden",
    pageContent: "flex-1 flex items-start justify-center px-3 sm:px-6 py-1 overflow-y-auto",
    outerCard: "w-full max-w-[1400px] px-2 sm:px-6 lg:px-14 py-4 sm:py-8 flex flex-col gap-3",
    topRow: "flex items-center justify-between flex-wrap gap-2",
    title: "text-xl sm:text-2xl font-bold font-inter text-white",
    topButtons: "flex items-center gap-2 flex-wrap",
    topBtn: (active: boolean) => `px-4 py-2 rounded-xl border font-nunito text-sm font-semibold transition-all hover:brightness-110 active:scale-95 ${active ? "bg-[#90DDF0] border-[#90DDF0] text-[#07393C]" : "border-white/30 text-white bg-white/5 hover:border-[#90DDF0] hover:text-[#90DDF0]"}`,
    greenContainer: "rounded-2xl border border-[#2C666E] bg-[#07393C] px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-4",
    innerHeader: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
    modeLabel: "text-lg sm:text-xl font-bold font-inter text-[#90DDF0]",
    searchRow: "flex items-center gap-2",
    searchInputWrapper: "flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/10 bg-black/30 focus-within:border-[#90DDF0] transition-colors",
    searchIcon: "text-white shrink-0",
    searchInput: "bg-transparent outline-none text-white font-nunito text-[14px] sm:text-[15px] placeholder:text-white/40 w-40 sm:w-56",
    searchBtn: "px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#2C666E] text-white font-nunito text-sm font-semibold transition-all hover:brightness-110 active:scale-95",
    listWrapper: "flex flex-col gap-2 sm:gap-3",
    empty: "text-white/70 font-nunito text-sm sm:text-base text-center py-8 sm:py-12 bg-black/20 rounded-xl border border-white/10",
    loading: "text-white/70 font-nunito text-sm sm:text-base text-center py-8 sm:py-12 bg-black/20 rounded-xl border border-white/10",
    skillRow: (clickable: boolean) =>
        `flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 rounded-xl border transition-all ${
            clickable
                ? "border-white/20 bg-black/30 cursor-pointer hover:border-[#90DDF0]/60 hover:bg-white/5"
                : "border-white/10 bg-black/30"
        }`,
    skillLeft: "flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 flex-1 min-w-0",
    skillName: "text-white font-nunito text-[14px] sm:text-[16px] sm:w-36 shrink-0 truncate",
    barsWrapper: "flex gap-1 sm:gap-1.5 p-1 flex-1 bg-black/40 rounded-md",
    barActive: "h-2 sm:h-3 flex-1 rounded-sm bg-[#90DDF0]",
    barInactive: "h-2 sm:h-3 flex-1 rounded-sm bg-white/10",
    pagination: "flex items-center justify-center gap-4 pt-2",
    pageArrow: "w-10 h-10 rounded-xl border border-white/20 text-white text-lg hover:border-[#90DDF0] hover:text-[#90DDF0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center",
    toast: "font-nunito text-sm text-center py-2 px-4 rounded-xl",
};

const MODE_LABELS: Record<ActionMode, string> = {
    ver: "Ver",
    edit: "Modificar",
    delete: "Eliminar",
};

const HardSkillsPage = () => {
    const { skills, catalogSkills, isLoading, error, successMessage, addSkill, editSkill, deleteSkill } = useSkills();
    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showExpanded, setShowExpanded] = useState(false);
    const [actionMode, setActionMode] = useState<ActionMode>("ver");
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [skillToView, setSkillToView] = useState<Skill | null>(null);
    const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);
    const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
    const [editError, setEditError] = useState<string | null>(null);
    const [isEditSubmitting, setIsEditSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const pageSize = showExpanded ? PAGE_SIZE_FULL : PAGE_SIZE_COMPACT;
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

    const handleToggleVer = () => {
        const nextExpanded = !showExpanded;
        const nextPageSize = nextExpanded ? PAGE_SIZE_FULL : PAGE_SIZE_COMPACT;
        const nextTotalPages = Math.max(1, Math.ceil(filtered.length / nextPageSize));
        setShowExpanded(nextExpanded);
        setActionMode("ver");
        setSelectedSkill(null);
        setCurrentPage((p) => Math.min(p, nextTotalPages));
    };

    const handleSetMode = (mode: ActionMode) => {
        setActionMode((prev) => prev === mode ? "ver" : mode);
        setSelectedSkill(null);
    };

    const handleSkillClick = (skill: Skill) => {
        if (actionMode === "ver") {
            setSkillToView(skill);
        } else if (actionMode === "edit") {
            setSelectedSkill(skill);
            setEditError(null);
            setSkillToEdit(skill);
        } else if (actionMode === "delete") {
            setSelectedSkill(skill);
            setSkillToDelete(skill);
        }
    };

    const handleAddSubmit = async (name: string, level: number) => {
        await addSkill(name, level);
    };

    const handleEditSubmit = async (id: string, name: string, level: number) => {
        setIsEditSubmitting(true);
        setEditError(null);
        try {
            await editSkill(id, name, level);
            setSkillToEdit(null);
            setSelectedSkill(null);
            setActionMode("ver");
        } catch {
            setEditError("Ocurrió un error al guardar los cambios.");
        } finally {
            setIsEditSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!skillToDelete) return;
        setIsDeleting(true);
        try {
            await deleteSkill(skillToDelete.id);
            setSkillToDelete(null);
            setSelectedSkill(null);
            setActionMode("ver");
            if (paginated.length === 1 && safePage > 1) setCurrentPage((p) => p - 1);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.pageContent}>
                <div className={styles.outerCard}>
                    <div className={styles.topRow}>
                        <h1 className={styles.title}>Habilidades Técnicas</h1>
                        <div className={styles.topButtons}>
                            <button type="button" onClick={() => setShowAdd(true)} className={styles.topBtn(false)}>
                                Agregar
                            </button>
                            <button type="button" onClick={() => handleSetMode("edit")} className={styles.topBtn(actionMode === "edit")}>
                                Modificar
                            </button>
                            <button type="button" onClick={() => handleSetMode("delete")} className={styles.topBtn(actionMode === "delete")}>
                                Eliminar
                            </button>
                            <button type="button" onClick={handleToggleVer} className={styles.topBtn(showExpanded)}>
                                {showExpanded ? "Atrás" : "Ver"}
                            </button>
                        </div>
                    </div>

                    <div className={styles.greenContainer}>
                        <div className={styles.innerHeader}>
                            <span className={styles.modeLabel}>{MODE_LABELS[actionMode]}</span>
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
                                <button type="button" onClick={handleSearch} className={styles.searchBtn}>
                                    Buscar
                                </button>
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
                                    <div
                                        key={skill.id}
                                        className={styles.skillRow(true)}
                                        onClick={() => handleSkillClick(skill)}
                                    >
                                        <div className={styles.skillLeft}>
                                            <span className={styles.skillName}>{skill.name}</span>
                                            <div className={styles.barsWrapper}>
                                                {Array.from({ length: TOTAL_BARS }).map((_, i) => (
                                                    <div key={i} className={i < skill.level ? styles.barActive : styles.barInactive} />
                                                ))}
                                            </div>
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
                                    disabled={safePage === 1}
                                    className={styles.pageArrow}
                                >
                                    ‹
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                    disabled={safePage === totalPages}
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
                    catalogSkills={catalogSkills}
                />
            )}

            {skillToView && (
                <ViewHardSkillPopup skill={skillToView} onClose={() => { setSkillToView(null); setSelectedSkill(null); }} />
            )}

            {skillToEdit && (
                <EditSkillPopup
                    skill={skillToEdit}
                    onSubmit={handleEditSubmit}
                    onClose={() => { setSkillToEdit(null); setSelectedSkill(null); }}
                    serverError={editError}
                    isSubmitting={isEditSubmitting}
                />
            )}

            {skillToDelete && (
                <DeleteSkillPopup
                    skillName={skillToDelete.name}
                    onConfirm={handleDeleteConfirm}
                    onClose={() => { setSkillToDelete(null); setSelectedSkill(null); }}
                    isSubmitting={isDeleting}
                />
            )}
        </div>
    );
};

export default HardSkillsPage;