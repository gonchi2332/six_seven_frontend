import { useState, useEffect } from "react";
import { useSoftSkills } from "../hooks/userSoftSkills";
import useSearch from "../hooks/useSearch";
import usePagination from "../hooks/usePagination";
import SkillSearchBar from "../components/SkillSearchBar";
import SkillPagination from "../components/SkillPagination";
import { visibilityService } from "../services/visibilityServices";
import Switch from "../components/Switch/Switch";
import Button from "../components/Button";

const PAGE_SIZE = 12;

const styles = {
    wrapper: "flex-1 flex flex-col overflow-hidden",
    pageContent: "flex-1 flex items-start justify-center px-3 sm:px-6 py-1 overflow-y-auto",
    outerCard: "w-full max-w-[1400px] px-2 sm:px-6 lg:px-14 py-4 sm:py-8 flex flex-col gap-3",
    greenContainer: "rounded-2xl border border-[#2C666E] bg-[#07393C] px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-4",
    header: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4",
    title: "text-xl sm:text-2xl font-bold font-inter text-white",
    headerControls: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 lg:justify-end",
    actionRow: "flex items-center gap-2",
    listWrapper: "flex flex-col gap-2 sm:gap-3",
    empty: "text-white/70 font-nunito text-sm sm:text-base text-center py-8 sm:py-12 bg-black/20 rounded-xl border border-white/10",
    loading: "text-white/70 font-nunito text-sm sm:text-base text-center py-8 sm:py-12 bg-black/20 rounded-xl border border-white/10",
    skillRow: "flex items-center justify-between gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 rounded-xl border border-white/20 bg-black/30 hover:border-[#90DDF0]/60 hover:bg-white/5 transition-all",
    skillName: "text-white font-nunito text-[14px] sm:text-[16px] truncate flex-1 min-w-0",
    toast: "font-nunito text-sm text-center py-2 px-4 rounded-xl",
    toastSuccess: "bg-[#90DDF0]/10 border border-[#90DDF0]/40 text-[#90DDF0]",
    toastError: "bg-red-500/10 border border-red-500 text-red-400",
};

const SoftSkillsConfigPage = () => {
    const { skills, isLoading, error, successMessage } = useSoftSkills();
    const { searchInput, filtered, handleSearch, handleKeyDown, handleChange } = useSearch(
        skills,
        (s, q) => s.name.toLowerCase().includes(q.toLowerCase())
    );
    const { currentPage, totalPages, paginated, prevPage, nextPage, resetPage } = usePagination(filtered, PAGE_SIZE);

    const [localError, setLocalError] = useState<string | null>(null);
    const [localSuccess, setLocalSuccess] = useState<string | null>(null);
    const [initialVisibilityMap, setInitialVisibilityMap] = useState<Record<string | number, boolean>>({});
    const [visibilityMap, setVisibilityMap] = useState<Record<string | number, boolean>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (skills) {
            const initialMap: Record<string | number, boolean> = {};
            skills.forEach((skill: any) => {
                const targetId = skill.skill_id ?? skill.id;
                initialMap[targetId] = skill.is_visible ?? skill.visible ?? false;
            });
            setInitialVisibilityMap(initialMap);
            setVisibilityMap(initialMap);
        }
    }, [skills]);

    useEffect(() => {
        if (successMessage) {
            setLocalSuccess(successMessage);
            const timer = setTimeout(() => setLocalSuccess(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        if (error) {
            setLocalError(error);
            const timer = setTimeout(() => setLocalError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleLocalVisibilityChange = (id: string | number, isChecked: boolean) => {
        setVisibilityMap((prev) => ({
            ...prev,
            [id]: isChecked,
        }));
    };

    const handleHideAll = () => {
        setVisibilityMap((prev) => {
            const updated = { ...prev };
            Object.keys(updated).forEach((key) => {
                updated[key] = false;
            });
            return updated;
        });
    };

    const handleShowAll = () => {
        setVisibilityMap((prev) => {
            const updated = { ...prev };
            Object.keys(updated).forEach((key) => {
                updated[key] = true;
            });
            return updated;
        });
    };

    const handleSaveChanges = async () => {
        try {
            setIsSaving(true);
            setLocalError(null);
            const res = await visibilityService.updateSkill(visibilityMap);
            setInitialVisibilityMap(visibilityMap);
            setLocalSuccess(res.message || "Cambios guardados exitosamente.");
            setTimeout(() => setLocalSuccess(null), 3000);
        } catch (err: any) {
            setLocalError(err.message || "Error al guardar los cambios.");
            setTimeout(() => setLocalError(null), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const onSearch = () => {
        handleSearch();
        resetPage();
    };

    const hasChanges = JSON.stringify(initialVisibilityMap) !== JSON.stringify(visibilityMap);

    const visibilityValues = Object.values(visibilityMap);
    const isAllVisible = visibilityValues.length > 0 && visibilityValues.every((v) => v === true);
    const isAllHidden = visibilityValues.length > 0 && visibilityValues.every((v) => v === false);

    return (
        <div className={styles.wrapper}>
            <div className={styles.pageContent}>
                <div className={styles.outerCard}>
                    <div className={styles.greenContainer}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Configuración de visibilidad de Habilidades Blandas</h1>
                            
                            <div className={styles.headerControls}>
                                <SkillSearchBar
                                    value={searchInput}
                                    onChange={handleChange}
                                    onSearch={onSearch}
                                    onKeyDown={handleKeyDown}
                                    onAdd={() => {}}
                                    placeholder="Buscar habilidad..."
                                    addLabel="Registrar"
                                    isPublic={true}
                                />

                                <div className={styles.actionRow}>
                                    <Button
                                        variant="secondary"
                                        onClick={handleShowAll}
                                        disabled={isLoading || isAllVisible || paginated.length === 0}
                                    >
                                        <span>Mostrar todo</span>
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={handleHideAll}
                                        disabled={isLoading || isAllHidden || paginated.length === 0}
                                    >
                                        <span>Ocultar todo</span>
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={handleSaveChanges}
                                        disabled={isLoading || isSaving || !hasChanges || paginated.length === 0}
                                    >
                                        <span>Guardar</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {localError && (
                            <p className={`${styles.toast} ${styles.toastError}`}>{localError}</p>
                        )}
                        {localSuccess && (
                            <p className={`${styles.toast} ${styles.toastSuccess}`}>{localSuccess}</p>
                        )}

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
                                {paginated.map((skill) => {
                                    const targetId = skill.skill_id;
                                    const currentVisibility = visibilityMap[targetId] ?? skill.visible ?? false;
                                    return (
                                        <div key={targetId} className={styles.skillRow}>
                                            <span className={styles.skillName}>{skill.name}</span>
                                            <Switch 
                                                key={`${targetId}-${currentVisibility}`}
                                                id={targetId} 
                                                initialState={currentVisibility}
                                                onChange={handleLocalVisibilityChange}
                                            />
                                        </div>
                                    );
                                })}
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

export default SoftSkillsConfigPage;