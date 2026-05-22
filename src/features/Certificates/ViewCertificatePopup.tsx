import Button from "../../components/Button";
import PopUpCard from "../../components/PopUpCard";
import type { Certificate } from "../../services/certificateService";

interface Props {
    certificate: Certificate;
    onClose: () => void;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 py-4 z-50",
    content: "px-4 sm:px-6 pb-2 pt-0 flex flex-col gap-4 sm:gap-5",
    imageWrapper: "w-full max-h-48 overflow-hidden rounded-xl bg-black/40 flex items-center justify-center",
    image: "w-full h-full object-contain",
    imageFallback: "text-white/30 font-nunito text-sm py-8",
    field: "flex flex-col gap-1",
    label: "text-secondary text-xs uppercase tracking-wide font-bold mb-1",
    value: "text-surface font-nunito text-sm sm:text-base",
    row: "grid grid-cols-1 sm:grid-cols-2 gap-4",
    buttonContainer: "flex gap-3 px-4 sm:px-6 pb-6",
};

const ViewCertificatePopup = ({ certificate, onClose }: Props) => {
    const formattedDate = certificate.issueDate ? new Date(certificate.issueDate + "T00:00:00").toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric",}): "";
    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-lg my-4 max-h-[90vh] overflow-y-auto">
                <PopUpCard title="Certificado">
                    <div className={styles.content}>
                        <div className={styles.imageWrapper}>
                            {certificate.coverImage ? (
                                <img src={certificate.coverImage} alt={certificate.title} className={styles.image} />
                            ) : (
                                <span className={styles.imageFallback}>Sin imagen</span>
                            )}
                        </div>
                        <div className={styles.field}>
                            <p className={styles.label}>Título</p>
                            <p className={styles.value}>{certificate.title}</p>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <p className={styles.label}>Área</p>
                                <p className={styles.value}>{certificate.area}</p>
                            </div>
                            <div className={styles.field}>
                                <p className={styles.label}>Fecha de Certificación</p>
                                <p className={styles.value}>{formattedDate}</p>
                            </div>
                        </div>
                        <div className={styles.field}>
                            <p className={styles.label}>Descripción</p>
                            <p className={styles.value}>{certificate.description}</p>
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <Button type="button" variant="secondary" onClick={onClose} fullWidth>
                            Atrás
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default ViewCertificatePopup;