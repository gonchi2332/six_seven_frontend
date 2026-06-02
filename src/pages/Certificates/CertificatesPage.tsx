import SkillSearchBar from "../../components/SkillSearchBar";
import SkillPagination from "../../components/SkillPagination";
import CertificateCard from "../../features/Certificates/components/CertificateCard";
import CertificateActionPopup from "../../features/Certificates/components/CertificateActionPopup";
import ViewCertificatePopup from "../../features/Certificates/components/ViewCertificatePopup";
import CertificateForm from "../../features/Certificates/components/CertificateForm";
import DeleteCertificatePopup from "../../features/Certificates/components/DeleteCertificatePopup";
import useCertificatesPage from "../../features/Certificates/hooks/useCertificatesPage";

const styles = {
    wrapper: "flex-1 flex flex-col overflow-hidden",
    pageContent: "flex-1 flex items-start justify-center px-3 sm:px-6 py-1 overflow-y-auto",
    outerCard: "w-full max-w-[1400px] px-2 sm:px-6 lg:px-14 py-4 sm:py-8 flex flex-col gap-3",
    greenContainer: "rounded-2xl border border-[#2C666E] bg-[#07393C] px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-4",
    header: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
    title: "text-xl sm:text-2xl font-bold font-inter text-white",
    listWrapper: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3",
    empty: "text-white/70 font-nunito text-sm sm:text-base text-center py-8 sm:py-12 bg-black/20 rounded-xl border border-white/10",
    loading: "text-white/70 font-nunito text-sm sm:text-base text-center py-8 sm:py-12 bg-black/20 rounded-xl border border-white/10",
    toast: "font-nunito text-sm text-center py-2 px-4 rounded-xl",
};

const CertificatesPage = () => {
    const {
        isLoading, error, successMessage, searchInput, paginated, filtered, certificates, currentPage, totalPages,
        prevPage, nextPage, onSearch, handleKeyDown, handleChange, certAction, setCertAction, certToView, setCertToView,
        certToEdit, setCertToEdit, certToDelete, setCertToDelete, showAdd, setShowAdd, formError, setFormError,
        isSubmitting, closeAll, goToMenu, onAddSubmit, onEditSubmit, onDeleteConfirm, } = useCertificatesPage();

    return (
        <div className={styles.wrapper}>
            <div className={styles.pageContent}>
                <div className={styles.outerCard}>
                    <div className={styles.greenContainer}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Certificados</h1>
                            <SkillSearchBar
                                value={searchInput}
                                onChange={handleChange}
                                onSearch={onSearch}
                                onKeyDown={handleKeyDown}
                                onAdd={() => { setFormError(null); setShowAdd(true); }}
                                placeholder="Buscar certificado..."
                                addLabel="Registrar"
                            />
                        </div>

                        {error && <p className={`${styles.toast} bg-red-500/10 border border-red-500 text-red-400`}>{error}</p>}
                        {successMessage && <p className={`${styles.toast} bg-[#90DDF0]/10 border border-[#90DDF0]/40 text-[#90DDF0]`}>{successMessage}</p>}

                        {isLoading ? (<p className={styles.loading}>Cargando...</p>) : paginated.length === 0 ? (
                            <p className={styles.empty}>
                                {filtered.length === 0 && certificates.length > 0
                                    ? "No se encontraron certificados."
                                    : "No tienes certificados registrados."}
                            </p>
                        ) : (<div className={styles.listWrapper}>
                            {paginated.map((cert) => (<CertificateCard key={cert.id} certificate={cert} onClick={setCertAction} />))}
                        </div>)}
                        <SkillPagination currentPage={currentPage} totalPages={totalPages} onPrev={prevPage} onNext={nextPage} />
                    </div>
                </div>
            </div>

            {certAction && (
                <CertificateActionPopup
                    certificate={certAction}
                    onView={() => { setCertToView(certAction); setCertAction(null); }}
                    onModify={() => { setFormError(null); setCertToEdit(certAction); setCertAction(null); }}
                    onDelete={() => { setCertToDelete(certAction); setCertAction(null); }}
                    onClose={() => setCertAction(null)}
                />
            )}

            {certToView && (
                <ViewCertificatePopup certificate={certToView} onClose={() => goToMenu(certToView)} />
            )}

            {showAdd && (
                <CertificateForm mode="add"
                    onSubmit={onAddSubmit}
                    onClose={closeAll}
                    serverError={formError}
                    isSubmitting={isSubmitting}
                />
            )}

            {certToEdit && (
                <CertificateForm
                    mode="edit"
                    initial={certToEdit}
                    onSubmit={onEditSubmit}
                    onClose={() => goToMenu(certToEdit)}
                    serverError={formError}
                    isSubmitting={isSubmitting}
                />
            )}

            {certToDelete && (
                <DeleteCertificatePopup
                    title={certToDelete.title}
                    onConfirm={onDeleteConfirm}
                    onClose={() => goToMenu(certToDelete)}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
};

export default CertificatesPage;
