import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useEducation } from "../hooks/useEducation";
import EducationCard from "../features/Education/EducationCard";
import { visibilityService } from "../services/visibilityServices";
import Button from "../components/Button";
import Switch from "../components/Switch/Switch";

const PAGE_SIZE = 10;

const styles = {
    wrapper: "flex-1 flex flex-col overflow-hidden",
    pageContent: "flex-1 flex items-start justify-center px-3 sm:px-6 py-1 overflow-y-auto",
    outerCard: "w-full max-w-[1400px] px-2 sm:px-6 lg:px-14 py-4 sm:py-8 flex flex-col",
    greenContainer: "rounded-2xl border border-[#2C666E] bg-[#07393C] px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-3 sm:gap-4",
    header: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4",
    title: "text-xl sm:text-2xl font-bold font-inter text-white",
    controlsRow: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 lg:justify-end",
    searchRow: "flex items-center gap-2 flex-1 sm:flex-none",
    searchInputWrapper: "flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/10 bg-black/30 focus-within:border-[#90DDF0] transition-colors flex-1",
    searchIcon: "text-white shrink-0",
    searchInput: "bg-transparent outline-none text-white font-nunito text-[14px] sm:text-[15px] placeholder:text-white/40 w-full sm:w-56",
    actionRow: "flex items-center gap-2",
    listWrapper: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4",
    empty: "text-white/70 font-nunito text-sm sm:text-base text-center py-8 sm:py-12 bg-black/20 rounded-xl border border-white/10",
    loading: "text-white/70 font-nunito text-sm sm:text-base text-center py-8 sm:py-12 bg-black/20 rounded-xl border border-white/10",
    pagination: "flex items-center justify-center gap-1 sm:gap-2 pt-4",
    pageBtn: (active: boolean) => `w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-nunito text-sm sm:text-base font-semibold transition-all ${active ? "bg-[#90DDF0] text-[#07393C]" : "border border-white/20 text-white/70 hover:border-[#90DDF0] hover:text-[#90DDF0]"}`,
    pageArrow: "w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-white/20 text-white/70 text-sm sm:text-base hover:border-[#90DDF0] hover:text-[#90DDF0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
    toast: "font-nunito text-sm text-center py-2 px-4 rounded-xl",
    toastSuccess: "bg-[#90DDF0]/10 border border-[#90DDF0]/40 text-[#90DDF0]",
    toastError: "bg-red-500/10 border border-red-500 text-red-400",
    cardConfigWrapper: "flex flex-col gap-3 p-3 bg-black/30 border border-white/10 rounded-xl hover:border-[#90DDF0]/40 transition-all",
    switchRow: "flex items-center justify-center border-t border-white/5 pt-2 mt-auto",
};

const EducationConfigPage = () => {
    const { entries, isLoading, error, successMessage } = useEducation();

    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    
    const [localError, setLocalError] = useState<string | null>(null);
    const [localSuccess, setLocalSuccess] = useState<string | null>(null);
    const [visibilityMap, setVisibilityMap] = useState<Record<string | number, boolean>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (entries) {
            const initialMap: Record<string | number, boolean> = {};
            entries.forEach((entry: any) => {
                initialMap[entry.id] = entry.is_visible ?? entry.visible ?? false;
            });
            setVisibilityMap(initialMap);
        }
    }, [entries]);

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

    useEffect(() => {
        if (searchInput === "") {
            setActiveSearch("");
            setCurrentPage(1);
        }
    }, [searchInput]);

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

    const handleSaveChanges = async () => {
        try {
            setIsSaving(true);
            setLocalError(null);
            const res = await visibilityService.updateEducation(visibilityMap);
            setLocalSuccess(res.message || "Cambios guardados exitosamente.");
            setTimeout(() => setLocalSuccess(null), 3000);
        } catch (err: any) {
            setLocalError(err.message || "Error al guardar los cambios.");
            setTimeout(() => setLocalError(null), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSearch = () => {
        setActiveSearch(searchInput);
        setCurrentPage(1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };

    const filtered = entries.filter((e) => {
        if (!activeSearch.trim()) return true;
        const term = activeSearch.toLowerCase();
        return e.degree.toLowerCase().includes(term) || e.institution.toLowerCase().includes(term);
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div className={styles.wrapper}>
            <div className={styles.pageContent}>
                <div className={styles.outerCard}>
                    <div className={styles.greenContainer}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Configuración de visibilidad de Formación Académica</h1>

                            <div className={styles.controlsRow}>
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
                                    <Button
                                        variant="secondary"
                                        onClick={handleSearch}
                                        disabled={isLoading}
                                    >
                                        Buscar
                                    </Button>
                                </div>

                                <div className={styles.actionRow}>
                                    <Button
                                        variant="secondary"
                                        onClick={handleHideAll}
                                        disabled={isLoading || paginated.length === 0}
                                    >
                                        <span>Ocultar todo</span>
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={handleSaveChanges}
                                        disabled={isLoading || isSaving || paginated.length === 0}
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
                                {activeSearch ? "No se encontraron registros." : "No tienes experiencias académicas aún."}
                            </p>
                        ) : (
                            <div className={styles.listWrapper}>
                                {paginated.map((entry) => {
                                    const currentVisibility = visibilityMap[entry.id] ?? entry.visible ?? entry.visible ?? false;
                                    return (
                                        <div key={entry.id} className={styles.cardConfigWrapper}>
                                            <EducationCard entry={entry} onView={() => {}} />
                                            <div className={styles.switchRow}>
                                                <Switch 
                                                    key={`${entry.id}-${currentVisibility}`}
                                                    id={entry.id} 
                                                    initialState={currentVisibility}
                                                    onChange={handleLocalVisibilityChange}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
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
        </div>
    );
};

export default EducationConfigPage;