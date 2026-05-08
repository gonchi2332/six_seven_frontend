// pages/ProjectsPage.tsx
import { useState } from "react";
import { Search, FolderGit2 } from "lucide-react";
import ProjectCard from "../features/PersonalProjects/components/PersonalProjectsModal/PersonalProjectCard";
import ViewProjectPopup from "../features/PersonalProjects/components/PersonalProjectsModal/ViewProjectPopup";
import PersonalProjectsModal from "../features/PersonalProjects/components/PersonalProjectsModal/PersonalProjectsModal";
import { mockProjects } from "../mocks/projectsMock";
import type { ProjectEntry } from "../features/PersonalProjects/services/personalProjectsService";

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
    listWrapper: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4",
    empty: "text-white/70 font-nunito text-sm sm:text-base text-center py-8 sm:py-12 bg-black/20 rounded-xl border border-white/10",
    pagination: "flex items-center justify-center gap-1 sm:gap-2 pt-2",
    pageBtn: (active: boolean) => `w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-nunito text-sm sm:text-base font-semibold transition-all ${active ? "bg-[#90DDF0] text-[#07393C]" : "border border-white/20 text-white/70 hover:border-[#90DDF0] hover:text-[#90DDF0]"}`,
    pageArrow: "w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-white/20 text-white/70 text-sm sm:text-base hover:border-[#90DDF0] hover:text-[#90DDF0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
};

const ProjectsPage = () => {
    const [projects] = useState<ProjectEntry[]>(mockProjects);
    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showAdd, setShowAdd] = useState(false);
    const [projectToView, setProjectToView] = useState<ProjectEntry | null>(null);
    const [projectToEdit, setProjectToEdit] = useState<ProjectEntry | null>(null);

    const handleSearch = () => {
        setActiveSearch(searchInput);
        setCurrentPage(1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };

    const handleDelete = (project: ProjectEntry) => {
        // TODO: Implementar lógica de eliminación
        console.log("Eliminar proyecto:", project);
    };

    const filtered = projects.filter((p) =>
        p.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        p.topic.toLowerCase().includes(activeSearch.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div className={styles.wrapper}>
            <div className={styles.pageContent}>
                <div className={styles.outerCard}>
                    <div className={styles.greenContainer}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Proyectos Personales</h1>

                            <div className={styles.searchRow}>
                                <div className={styles.searchInputWrapper}>
                                    <Search size={16} className={styles.searchIcon} />
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Buscar proyecto..."
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

                        {paginated.length === 0 ? (
                            <div className={styles.empty}>
                                {activeSearch ? (
                                    "No se encontraron proyectos."
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <FolderGit2 size={48} className="text-white/30" />
                                        <p>No tienes proyectos personales registrados.</p>
                                        <button
                                            onClick={() => setShowAdd(true)}
                                            className="mt-2 px-4 py-2 rounded-xl bg-[#90DDF0] text-[#07393C] font-nunito text-sm font-semibold"
                                        >
                                            Agregar tu primer proyecto
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className={styles.listWrapper}>
                                    {paginated.map((project) => (
                                        <ProjectCard
                                            key={project.id}
                                            project={project}
                                            onView={setProjectToView}
                                        />
                                    ))}
                                </div>

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
                            </>
                        )}
                    </div>
                </div>
            </div>

            {showAdd && (
                <PersonalProjectsModal
                    mode="create"
                    onClose={() => setShowAdd(false)}
                />
            )}

            {projectToView && (
                <ViewProjectPopup
                    project={projectToView}
                    onClose={() => setProjectToView(null)}
                    onEdit={() => {
                        setProjectToView(null);
                        setProjectToEdit(projectToView);
                    }}
                    onDelete={() => handleDelete(projectToView)}
                />
            )}

            {projectToEdit && (
                <PersonalProjectsModal
                    mode="edit"
                    initialData={projectToEdit}
                    onClose={() => setProjectToEdit(null)}
                />
            )}
        </div>
    );
};

export default ProjectsPage;
