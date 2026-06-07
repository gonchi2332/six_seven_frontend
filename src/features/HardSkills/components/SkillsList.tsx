import SkillBar from "./SkillBar";
import AddSkillPopup from "./AddSkillPopup";
import EditSkillPopup from "./EditSkillPopup";
import DeleteSkillPopup from "./DeleteSkillPopup";
import useSkillsList from "../hooks/useSkillsList";

const styles = {
    wrapper: "flex flex-col gap-4",
    header: "flex items-center justify-between",
    title: "text-xl font-bold font-inter text-surface",
    addBtn: "px-4 py-2 rounded-xl bg-primary text-white text-sm font-nunito font-semibold transition-all hover:brightness-110 active:scale-95",
    list: "flex flex-col gap-3",
    empty: "text-surface/50 font-nunito text-sm text-center py-6",
    error: "p-3 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-nunito text-center",
    success: "p-3 rounded-xl bg-primary/10 border border-primary text-primary text-sm font-nunito text-center",
    paginationWrapper: "flex items-center justify-center gap-4 pt-3",
    paginationBtn: "w-10 h-10 rounded-xl border border-white text-white flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed",
    paginationLabel: "text-[14px] font-nunito text-surface/70",
};

/*
  Características:
  -Componente principal que renderiza la lista de habilidades técnicas
  -Muestra cabecera con título y botón "Registrar"
  -Maneja estados: carga, error, éxito, lista vacía
  -Paginación: muestra botones anterior/siguiente si hay más de una página
  -Popups modales: AddSkillPopup, EditSkillPopup, DeleteSkillPopup
  -Usa useSkillsList para toda la lógica de estado y operaciones CRUD

  Flujo:
  1. Carga habilidades del usuario
  2. Muestra cada habilidad con SkillBar (nombre + barras de nivel + botones)
  3. Click en "Registrar" -> abre AddSkillPopup
  4. Click en editar (lápiz) -> abre EditSkillPopup
  5. Click en eliminar (basurero) -> abre DeleteSkillPopup
  6. Después de cada operación, refresca la lista automáticamente

  @ Ejemplo:
  <SkillsList />
*/
const SkillsList = () => {
    const {
        skills,
        isLoading,
        error,
        successMessage,
        paginated,
        totalPages,
        currentPage,
        setCurrentPage,
        showAdd,
        setShowAdd,
        editTarget,
        setEditTarget,
        deleteTarget,
        setDeleteTarget,
        serverError,
        isSubmitting,
        handleAdd,
        handleEdit,
        handleDelete,
    } = useSkillsList();

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>Habilidades Técnicas</h2>
                <button type="button" className={styles.addBtn} onClick={() => setShowAdd(true)}>
                    Registrar
                </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}
            {successMessage && <p className={styles.success}>{successMessage}</p>}

            {isLoading ? (
                <p className={styles.empty}>Cargando...</p>
            ) : skills.length === 0 ? (
                <p className={styles.empty}>No tienes habilidades registradas.</p>
            ) : (
                <>
                    <div className={styles.list}>
                        {paginated.map((skill) => (
                            <SkillBar
                                key={skill.skill_id}
                                skill={skill}
                                onEdit={() => setEditTarget(skill)}
                                onDelete={() => setDeleteTarget(skill)}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className={styles.paginationWrapper}>
                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={styles.paginationBtn}
                            >
                                ‹
                            </button>
                            <span className={styles.paginationLabel}>
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className={styles.paginationBtn}
                            >
                                ›
                            </button>
                        </div>
                    )}
                </>
            )}

            {showAdd && (
                <AddSkillPopup
                    onSubmit={handleAdd}
                    onClose={() => setShowAdd(false)}
                    isSubmitting={isSubmitting}
                />
            )}

            {editTarget && (
                <EditSkillPopup
                    skill={editTarget}
                    onSubmit={handleEdit}
                    onClose={() => setEditTarget(null)}
                    serverError={serverError}
                    isSubmitting={isSubmitting}
                />
            )}

            {deleteTarget && (
                <DeleteSkillPopup
                    skillName={deleteTarget.name}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
};

export default SkillsList;

