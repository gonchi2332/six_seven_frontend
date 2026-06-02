import { Award, Layers, Calendar, FileText } from 'lucide-react';
import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";
import type { Certificate } from "../services/certificateService";

interface Props {
    certificate: Certificate;
    onClose: () => void;
}

const styles = {
    overlay: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto",
    container: "w-full max-w-2xl min-h-screen flex items-center justify-center p-4",
    content: "px-6 py-4 flex flex-col gap-2",
    row: 'flex items-start gap-4 py-3',
    iconBox: 'w-10 h-10 rounded-xl bg-[#2C666E]/40 flex items-center justify-center shrink-0 mt-0.5',
    icon: 'text-[#90DDF0] w-5 h-5',
    textGroup: 'flex flex-col flex-1 min-w-0',
    label: 'text-[#90DDF0] text-xs uppercase tracking-wide font-bold mb-1',
    value: 'text-white font-nunito text-base sm:text-lg font-medium leading-snug break-words overflow-wrap-anywhere',
    descriptionValue: 'text-white font-nunito text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere',
    emptyValue: 'text-white/30 italic font-nunito text-base sm:text-lg break-words',
    metaGrid: "grid grid-cols-1 sm:grid-cols-2 gap-4",
    imageWrapper: "w-full max-h-56 overflow-hidden rounded-xl border border-white/10 bg-black/20 flex items-center justify-center mb-2",
    image: "w-full h-full object-contain transform hover:scale-[1.01] transition-transform duration-300",
    imageFallback: "text-white/30 italic font-nunito text-sm py-12",
    descriptionBox: "bg-black/20 rounded-xl p-4 mt-2 border border-white/5 overflow-hidden",
    buttonContainer: "flex gap-3 px-6 pb-6",
    closeButton: "absolute right-4 top-4 text-white/50 hover:text-[#90DDF0] transition-colors p-1 hover:bg-white/10 rounded-lg",
};

const InfoRow = ({
    icon: Icon,
    label,
    value,
    isDescription = false,
}: {
    icon: React.ElementType;
    label: string;
    value: string | null | undefined;
    isDescription?: boolean;
}) => (
    <div className={styles.row}>
        <div className={styles.iconBox}>
            <Icon className={styles.icon} />
        </div>
        <div className={styles.textGroup}>
            <p className={styles.label}>{label}</p>
            {value ? (
                <p className={isDescription ? styles.descriptionValue : styles.value}>{value}</p>
            ) : (
                <p className={styles.emptyValue}>No especificado</p>
            )}
        </div>
    </div>
);

const ViewCertificatePopup = ({ certificate, onClose }: Props) => {
    const formattedDate = certificate.issueDate
        ? new Date(certificate.issueDate + "T00:00:00").toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
        : null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <PopUpCard title="Certificado">
                    <button onClick={onClose} className={styles.closeButton}>✕</button>

                    <div className={styles.content}>
                        <div className={styles.imageWrapper}>
                            {certificate.coverImage ? (
                                <img src={certificate.coverImage} alt={certificate.title} className={styles.image} />
                            ) : (
                                <span className={styles.imageFallback}>Sin imagen de certificado adjunta</span>
                            )}
                        </div>
                        <InfoRow icon={Award} label="Título del Certificado" value={certificate.title} />
                        <div className={styles.metaGrid}>
                            <InfoRow icon={Layers} label="Área / Especialidad" value={certificate.area} />
                            <InfoRow icon={Calendar} label="Fecha de Certificación" value={formattedDate} />
                        </div>
                        <div className={styles.descriptionBox}>
                            <InfoRow icon={FileText} label="Descripción" value={certificate.description} isDescription />
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
