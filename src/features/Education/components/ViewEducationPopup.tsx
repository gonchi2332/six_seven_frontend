import { GraduationCap, Award, Landmark, ToggleLeft, Calendar } from 'lucide-react';
import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";
import type { EducationEntry } from "../services/educationService";

interface Props {
    isOpen: boolean;
    entry: EducationEntry | null;
    onClose: () => void;
    onBack: () => void;
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
    emptyValue: 'text-white/30 italic font-nunito text-base sm:text-lg break-words',
    metaGrid: "grid grid-cols-1 sm:grid-cols-2 gap-4",
    buttonContainer: "flex gap-3 px-6 pb-6",
    closeButton: "absolute right-4 top-4 text-white/50 hover:text-[#90DDF0] transition-colors p-1 hover:bg-white/10 rounded-lg",
};

const InfoRow = ({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string | null | undefined;
}) => (
    <div className={styles.row}>
        <div className={styles.iconBox}>
            <Icon className={styles.icon} />
        </div>
        <div className={styles.textGroup}>
            <p className={styles.label}>{label}</p>
            {value ? (
                <p className={styles.value}>{value}</p>
            ) : (
                <p className={styles.emptyValue}>No especificado</p>
            )}
        </div>
    </div>
);

const ViewEducationPopup = ({ isOpen, entry, onClose, onBack }: Props) => {
    if (!isOpen || !entry) return null;

    const dateDisplay = entry.educationState === "cursando"
        ? `${entry.startDate} - Presente`
        : entry.startDate;

    const stateLabel = entry.educationState === "cursando" ? "En curso" : "Egresado";

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <PopUpCard title="Detalle de Formación Académica">
                    <button onClick={onClose} className={styles.closeButton}>✕</button>

                    <div className={styles.content}>
                        <InfoRow icon={GraduationCap} label="Título / Carrera" value={entry.degree} />
                        <div className={styles.metaGrid}>
                            <InfoRow icon={Award} label="Grado Académico" value={entry.academicLevel} />
                            <InfoRow icon={Landmark} label="Institución" value={entry.institution} />
                        </div>
                        <div className={styles.metaGrid}>
                            <InfoRow icon={ToggleLeft} label="Estado" value={stateLabel} />
                            <InfoRow icon={Calendar} label="Periodo / Año" value={dateDisplay} />
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <Button variant="secondary" onClick={onBack} fullWidth>
                            Atrás
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default ViewEducationPopup;
