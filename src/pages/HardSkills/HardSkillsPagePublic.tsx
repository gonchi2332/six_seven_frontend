import { useEffect, useState } from "react";
import { useSkills } from "../../hooks/useSkills";
import useSearch from "../../hooks/useSearch";
import usePagination from "../../hooks/usePagination";
import SkillSearchBar from "../../components/SkillSearchBar";
import SkillPagination from "../../components/SkillPagination";
import LevelBars from "../../components/LevelBars/Levelbars ";
import type { Skill } from "../../features/skills/types/skill.types";
import { useParams } from "react-router-dom";

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
    skillRow: "flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 rounded-xl border border-white/20 bg-black/30 cursor-pointer hover:border-[#90DDF0]/60 hover:bg-white/5 transition-all",
    skillLeft: "flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 flex-1 min-w-0",
    skillName: "text-white font-nunito text-[14px] sm:text-[16px] sm:w-36 shrink-0 truncate",
    toast: "font-nunito text-sm text-center py-2 px-4 rounded-xl",
};

const HardSkillsPage = () => {
    const { username } = useParams<{ username: string }>();
    const {
        publicSkills,
        isLoadingPublic,
        error,
        setPublicUser,
    } = useSkills();

    const { searchInput, filtered, handleSearch, handleKeyDown, handleChange } = useSearch(
        publicSkills,
        (s, q) => s.name.toLowerCase().includes(q.toLowerCase())
    );

    const { currentPage, totalPages, paginated, prevPage, nextPage, resetPage } = usePagination(filtered, PAGE_SIZE);

    const [, setSkillAction] = useState<Skill | null>(null);

    useEffect(() => {
        if (username) {
            setPublicUser(username);
        }
    }, [username, setPublicUser]);

    const onSearch = () => {
        handleSearch();
        resetPage();
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.pageContent}>
                <div className={styles.outerCard}>
                    <div className={styles.greenContainer}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Habilidades Técnicas</h1>
                            <SkillSearchBar
                                value={searchInput}
                                onChange={handleChange}
                                onSearch={onSearch}
                                onKeyDown={handleKeyDown}
                                onAdd={() => { }}
                                placeholder="Buscar habilidad..."
                                addLabel="Registrar"
                                isPublic={true}
                            />
                        </div>

                        {error && <p className={`${styles.toast} bg-red-500/10 border border-red-500 text-red-400`}>{error}</p>}

                        {isLoadingPublic ? (
                            <p className={styles.loading}>Cargando...</p>
                        ) : paginated.length === 0 ? (
                            <p className={styles.empty}>
                                {filtered.length === 0 && publicSkills.length > 0
                                    ? "No se encontraron habilidades."
                                    : "No hay habilidades técnicas para mostrar."}
                            </p>
                        ) : (
                            <div className={styles.listWrapper}>
                                {paginated.map((skill) => (
                                    <div key={skill.skill_id} className={styles.skillRow} onClick={() => setSkillAction(skill)}>
                                        <div className={styles.skillLeft}>
                                            <span className={styles.skillName}>{skill.name}</span>
                                            <LevelBars level={skill.level} size="sm" />
                                        </div>
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
        </div>
    );
};

export default HardSkillsPage;
