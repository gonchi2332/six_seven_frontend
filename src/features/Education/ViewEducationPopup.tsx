import Button from "../../components/Button/Button";
import PopUpCard from "../../components/PopUpCard/PopUpCard";
import type { EducationEntry } from "../../services/educationService";

interface Props {
    isOpen: boolean;
    entry: EducationEntry | null;
    onClose: () => void;
    onBack: () => void;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50 overflow-y-auto",
    content: "px-4 sm:px-6 pb-5 pt-0 flex flex-col gap-4 sm:gap-5",
    field: "flex flex-col gap-1",
    label: "text-secondary   text-xs uppercase tracking-wide font-bold mb-1",
    value: "text-surface font-nunito text-sm sm:text-base",
    datesRow: "flex flex-col sm:flex-row gap-4 sm:gap-6",
    buttonContainer: "flex gap-3 px-4 sm:px-6 pb-6",
    closeIcon: "absolute right-4 top-4 text-gray-400 hover:text-white transition-colors text-2xl cursor-pointer bg-transparent border-none",
};

const ViewEducationPopup = ({ isOpen, entry, onClose, onBack }: Props) => {
    if (!isOpen || !entry) return null;

    const dateRange = entry.endDate ? entry.endDate : "Presente";

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className="w-full max-w-lg my-4" onClick={(e) => e.stopPropagation()}>
                <PopUpCard title="Detalle de Formación Académica">
                    <div className={styles.content}>
                        <div className={styles.field}>
                            <p className={styles.label}>Título / Carrera</p>
                            <p className={styles.value}>{entry.degree}</p>
                        </div>
                        <div className={styles.datesRow}>
                            <div className="flex-1">
                                <p className={styles.label}>Grado Académico</p>
                                <p className={styles.value}>{entry.academicLevel}</p>
                            </div>
                            <div className="flex-1">
                                <p className={styles.label}>Institución</p>
                                <p className={styles.value}>{entry.institution}</p>
                            </div>
                        </div>
                        <div className={styles.datesRow}>
                            <div className="flex-1">
                                <p className={styles.label}>Año de Inicio</p>
                                <p className={styles.value}>{entry.startDate}</p>
                            </div>
                            <div className="flex-1">
                                <p className={styles.label}>Año de Finalización</p>
                                <p className={styles.value}>{dateRange}</p>
                            </div>
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