import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useProjects } from "../features/PersonalProjects/hooks/useProjects";
import ProjectCard from "../features/PersonalProjects/components/PersonalProjectsModal/PersonalProjectCard";
import ViewProjectPopup from "../features/PersonalProjects/components/PersonalProjectsModal/ViewProjectPopup";
import PersonalProjectsModal from "../features/PersonalProjects/components/PersonalProjectsModal/PersonalProjectsModal";
import PopUpCard from "../components/PopUpCard";
import Button from "../components/Button";
import type { ProjectEntry, CreateProjectPayload, UpdateProjectPayload } from "../features/PersonalProjects/services/personalProjectsService";

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
    toastSuccess: "bg-green-500/10 border border-green-500 text-green-400 text-center py-2 px-4 rounded-xl font-nunito text-sm",
    toastError: "bg-red-500/10 border border-red-500 text-red-400 text-center py-2 px-4 rounded-xl font-nunito text-sm",
    optionsModalContent: "flex flex-col gap-4",
    optionsModalText: "text-white/90 font-nunito text-center mb-2",
    optionsModalButtons: "flex gap-3",
};

const ProjectsPage = () => {
    const { projects, isLoading, error, successMessage, addProject, editProject, deleteProject } = useProjects();
    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showAdd, setShowAdd] = useState(false);
    const [selectedProject, setSelectedProject] = useState<ProjectEntry | null>(null);
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [localSuccess, setLocalSuccess] = useState<string | null>(null);

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

    const handleSearch = () => {
        setActiveSearch(searchInput);
        setCurrentPage(1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };

    const handleAddProject = async (data: CreateProjectPayload) => {
        await addProject(data);
        setShowAdd(false);
    };

    const handleEditProject = async (data: UpdateProjectPayload, id: string) => {
        await editProject(id, data);
        closeAllModals();
    };

    const handleDeleteProject = async () => {
        if (selectedProject) {
            await deleteProject(selectedProject.id);
            closeAllModals();
        }
    };

    const closeAllModals = () => {
        setShowOptionsModal(false);
        setShowViewModal(false);
        setShowEditModal(false);
        setShowAdd(false);
        setSelectedProject(null);
    };

    const handleCardClick = (project: ProjectEntry) => {
        setSelectedProject(project);
        setShowOptionsModal(true);
    };

    const handleView = () => {
        setShowOptionsModal(false);
        setShowViewModal(true);
    };

    const handleEdit = () => {
        setShowOptionsModal(false);
        setShowEditModal(true);
    };

    const handleCancel = () => {
        closeAllModals();
    };

    const handleViewModalClose = () => {
        setShowViewModal(false);
        setSelectedProject(null);
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
        setSelectedProject(null);
    };

    const transformProjectToPayload = (project: ProjectEntry): Partial<CreateProjectPayload> => {
        return {
            name: project.name,
            description: project.description,
            topic: project.topic,
            role: project.role,
            status: project.status,
            links: project.links,
            image: null,
        };
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
                                        Registrar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {(localError || error) && (
                            <p className={styles.toastError}>{localError || error}</p>
                        )}

                        {(localSuccess || successMessage) && (
                            <p className={styles.toastSuccess}>{localSuccess || successMessage}</p>
                        )}

                        {isLoading ? (
                            <p className={styles.empty}>Cargando proyectos...</p>
                        ) : paginated.length === 0 ? (
                            <div className={styles.empty}>
                                {activeSearch ? (
                                    "No se encontraron proyectos."
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <p>No tienes proyectos personales registrados.</p>
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
                                            onClick={handleCardClick}
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

            {/* Modal de opciones - Botones horizontales con tamaños iguales */}
            {showOptionsModal && selectedProject && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="w-full max-w-2xl">
                        <PopUpCard title={selectedProject.name}>
                            <div className="flex flex-col gap-6 p-6">
                                <p className="text-white/90 font-nunito text-center text-base">
                                    Selecciona una acción para el proyecto
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <Button
                                        variant="secondary"
                                        onClick={handleCancel}
                                        fullWidth
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={handleView}
                                        fullWidth
                                    >
                                        Ver
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={handleEdit}
                                        fullWidth
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={handleDeleteProject}
                                        disabled={isLoading}
                                        fullWidth
                                    >
                                        {isLoading ? "..." : "Eliminar"}
                                    </Button>
                                </div>
                            </div>
                        </PopUpCard>
                    </div>
                </div>
            )}

            {showAdd && (
                <PersonalProjectsModal
                    mode="create"
                    onClose={() => setShowAdd(false)}
                    onSubmit={(data, _id) => handleAddProject(data as CreateProjectPayload)}
                    isSubmitting={isLoading}
                    error={error}
                />
            )}

            {/* Modal para ver proyecto */}
            {showViewModal && selectedProject && (
                <ViewProjectPopup
                    project={selectedProject}
                    onClose={handleViewModalClose}
                    onEdit={() => {
                        setShowViewModal(false);
                        setShowEditModal(true);
                    }}
                    onDelete={handleDeleteProject}
                />
            )}

            {/* Modal para editar proyecto */}
            {showEditModal && selectedProject && (
                <PersonalProjectsModal
                    mode="edit"
                    projectId={selectedProject.id}
                    initialData={transformProjectToPayload(selectedProject)}
                    onClose={handleEditModalClose}
                    onSubmit={(data, id) => handleEditProject(data as UpdateProjectPayload, id!)}
                    isSubmitting={isLoading}
                    error={error}
                />
            )}
        </div>
    );
};

export default ProjectsPage;
