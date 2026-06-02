import { useState } from "react";
import { useSoftSkills } from "../../features/SoftSkills/hooks/userSoftSkills";
import useSearch from "../../hooks/useSearch";
import usePagination from "../../hooks/usePagination";
import SkillSearchBar from "../../components/SkillSearchBar";
import SkillPagination from "../../components/SkillPagination";
import ConfirmDeletePopup from "../../components/ConfirmDeletePopup/ConfirmDeletePopup ";
import AddSoftSkillPopup from "../../features/SoftSkills/components/AddSoftSkillPopup";
import SoftSkillActionPopup from "../../features/SoftSkills/components/SoftSkillActionPopup";
import ViewSoftSkillPopup from "../../features/SoftSkills/components/ViewSoftSkillPopup";
import type { SoftSkill } from "../../features/SoftSkills/services/softSkillService";

const PAGE_SIZE = 12;

const styles = {
    wrapper: "flex-1 flex flex-col overflow-hidden",
    pageContent: "flex-1 flex items-start justify-center px-3 sm:px-6 py-1 overflow-y-auto",
    outerCard: "w-full max-w-[1400px] px-2 sm:px-6 lg:px-14 py-4 sm:py-8 flex flex-col gap-3",
    greenContainer: "rounded-2xl border border-[#2C666E] bg-[#07393C] px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-4",
    header: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
    title: "text-xl sm:text-2xl font-bold font-inter text-white",
    listWrapper: "flex flex-col gap-2 sm:gap-3",
    empty: "text-white/70 font-nunito text-sm sm:text-base text-center py-8 sm:py-12 bg-black/20 rounded-xl border border-white/10",
    loading: "text-white/70 font-nunito text-sm sm:text-base text-center py-8 sm:py-12 bg-black/20 rounded-xl border border-white/10",
    skillRow: "flex items-center px-3 sm:px-5 py-3 sm:py-4 rounded-xl border border-white/20 bg-black/30 cursor-pointer hover:border-[#90DDF0]/60 hover:bg-white/5 transition-all",
    skillName: "text-white font-nunito text-[14px] sm:text-[16px] truncate flex-1 min-w-0",
    toast: "font-nunito text-sm text-center py-2 px-4 rounded-xl",
};

const SoftSkillsPage = () => {
    const { skills, catalogSkills, isLoading, error, successMessage, username, addSkill, removeSkill } = useSoftSkills();
    const { searchInput, filtered, handleSearch, handleKeyDown, handleChange } = useSearch(
        skills,
        (s, q) => s.name.toLowerCase().includes(q.toLowerCase())
    );
    const { currentPage, totalPages, paginated, prevPage, nextPage, resetPage, adjustAfterDelete } = usePagination(filtered, PAGE_SIZE);

    const [showAdd, setShowAdd] = useState(false);
    const [skillAction, setSkillAction] = useState<SoftSkill | null>(null);
    const [skillToView, setSkillToView] = useState<SoftSkill | null>(null);
    const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const onSearch = () => { handleSearch(); resetPage(); };

    const handleAddSubmit = (name: string) => {
        addSkill(name);
    };

    const handleDeleteConfirm = async () => {
        if (!skillToDelete) return;
        setIsDeleting(true);
        try {
            await removeSkill(skillToDelete);
            adjustAfterDelete(paginated.length);
            setSkillToDelete(null);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.pageContent}>
                <div className={styles.outerCard}>
                    <div className={styles.greenContainer}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Habilidades Blandas</h1>
                            <SkillSearchBar
                                value={searchInput}
                                onChange={handleChange}
                                onSearch={onSearch}
                                onKeyDown={handleKeyDown}
                                onAdd={() => setShowAdd(true)}
                                placeholder="Buscar habilidad..."
                                addLabel="Registrar"
                            />
                        </div>

                        {error && <p className={`${styles.toast} bg-red-500/10 border border-red-500 text-red-400`}>{error}</p>}
                        {successMessage && <p className={`${styles.toast} bg-[#90DDF0]/10 border border-[#90DDF0]/40 text-[#90DDF0]`}>{successMessage}</p>}

                        {isLoading ? (
                            <p className={styles.loading}>Cargando...</p>
                        ) : paginated.length === 0 ? (
                            <p className={styles.empty}>
                                {filtered.length === 0 && skills.length > 0
                                    ? "No se encontraron habilidades."
                                    : "No hay habilidades blandas registradas."}
                            </p>
                        ) : (
                            <div className={styles.listWrapper}>
                                {paginated.map((skill, i) => (
                                    <div key={i} className={styles.skillRow} onClick={() => setSkillAction(skill)}>
                                        <span className={styles.skillName}>{skill.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <SkillPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPrev={prevPage}
                            onNext={nextPage}
                        />
                    </div>
                </div>
            </div>

            {showAdd && (
                <AddSoftSkillPopup
                    onSubmit={handleAddSubmit}
                    onClose={() => setShowAdd(false)}
                    username={username}
                    userSkills={skills}
                    catalogSkills={catalogSkills}
                />
            )}

            {skillAction && (
                <SoftSkillActionPopup
                    skillName={skillAction.name}
                    onView={() => { setSkillToView(skillAction); setSkillAction(null); }}
                    onDelete={() => { setSkillToDelete(skillAction.name); setSkillAction(null); }}
                    onClose={() => setSkillAction(null)}
                />
            )}

            {skillToView && (
                <ViewSoftSkillPopup
                    name={skillToView.name}
                    onClose={() => { setSkillToView(null); setSkillAction(skillToView); }}
                />
            )}

            <ConfirmDeletePopup
                isOpen={!!skillToDelete}
                skillName={skillToDelete ?? ""}
                onConfirm={handleDeleteConfirm}
                onClose={() => { setSkillToDelete(null); setSkillAction(skillAction ?? { name: skillToDelete ?? "" } as SoftSkill); }}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default SoftSkillsPage;
