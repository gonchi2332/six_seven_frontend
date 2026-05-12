import Button from "../../components/Button/Button";
import PopUpCard from "../../components/PopUpCard/PopUpCard";
import type { EducationEntry } from "../../services/educationService";

interface Props {
    isOpen: boolean;
    entry: EducationEntry | null;
    onClose: () => void;
    onEdit: (entry: EducationEntry) => void;
    onDelete: (entry: EducationEntry) => void;
    onView: () => void;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50",
    buttonContainer: "flex flex-col sm:flex-row flex-wrap gap-2 px-4 sm:px-6 pb-6 justify-center w-full",
    btnWide: "w-full sm:flex-1 sm:min-w-6",
};

const EducationPopup = ({ isOpen, entry, onClose, onEdit, onDelete, onView }: Props) => {
    if (!isOpen || !entry) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className="flex-col w-full max-w-sm sm:max-w-160" onClick={(e) => e.stopPropagation()}>
                <PopUpCard title={entry.degree}>
                    <div className={styles.buttonContainer}>
                        <div className={styles.btnWide}>
                            <Button variant="secondary" onClick={onClose} fullWidth>
                                Cancelar
                            </Button>
                        </div>
                        <div className={styles.btnWide}>
                            <Button variant="secondary" onClick={() => onDelete(entry)} fullWidth>
                                Eliminar
                            </Button>
                        </div>
                        <div className={styles.btnWide}>
                            <Button variant="primary" onClick={onView} fullWidth>
                                Ver
                            </Button>
                        </div>
                        <div className={styles.btnWide}>
                            <Button variant="primary" onClick={() => onEdit(entry)} fullWidth>
                                Modificar
                            </Button>
                        </div>
                        
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default EducationPopup;