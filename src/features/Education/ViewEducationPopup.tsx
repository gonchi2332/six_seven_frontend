import Button from "../../components/Button/Button";
import PopUpCard from "../../components/PopUpCard/PopUpCard";
import type { EducationEntry } from "../../services/educationService";

interface Props {
    isOpen: boolean;
    entry: EducationEntry | null;
    onClose: () => void;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50 overflow-y-auto",
    container: "min-h-screen flex items-center justify-center p-4",
    content: "px-6 py-4 flex flex-col gap-5",
    field: "flex flex-col gap-1",
    label: "text-accent text-xs uppercase tracking-wide font-bold",
    value: "text-surface font-nunito text-base",
    datesRow: "flex gap-6",
    buttonContainer: "flex gap-3 px-6 pb-6",
    closeIcon: "absolute right-4 top-4 text-gray-400 hover:text-white transition-colors text-2xl cursor-pointer bg-transparent border-none",
};

const ViewEducationPopup = ({ isOpen, entry, onClose}: Props) => {
    if (!isOpen || !entry) return null;

    const dateRange = entry.endDate ? entry.endDate : "Presente";

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <PopUpCard title="Detalle de Educación">
                    <button onClick={onClose} className={styles.closeIcon}>✕</button>
                    
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
                                <p className={styles.label}>Fecha Inicio</p>
                                <p className={styles.value}>{entry.startDate}</p>
                            </div>
                            <div className="flex-1">
                                <p className={styles.label}>Fecha Fin</p>
                                <p className={styles.value}>{dateRange}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.buttonContainer}>
                        <Button variant="secondary" onClick={() => onClose()} fullWidth>
                            Atras
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default ViewEducationPopup;