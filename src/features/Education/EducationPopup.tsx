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
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50 overflow-y-auto",
    container: "min-h-screen flex items-center justify-center p-4",
    content: "px-6 py-4 flex flex-col gap-5",
    field: "flex flex-col gap-1",
    label: "text-accent text-xs uppercase tracking-wide font-bold",
    value: "text-surface font-nunito text-base",
    buttonContainer: "flex gap-3 px-6 pb-6",
    closeIcon: "absolute right-4 top-4 text-gray-400 hover:text-white transition-colors text-2xl cursor-pointer bg-transparent border-none",
};

const EducationPopup = ({ isOpen, entry, onClose, onEdit, onDelete, onView }: Props) => {
    if (!isOpen || !entry) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className="w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
                <PopUpCard title={entry.degree}>
                    <div className={styles.buttonContainer}>
                        <Button variant="primary" onClick={() => onClose()} fullWidth>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={() => onView()} fullWidth>
                            Ver
                        </Button>
                        <Button variant="secondary" onClick={() => onEdit(entry)} fullWidth>
                            Modificar
                        </Button>
                        <Button variant="primary" onClick={() => onDelete(entry)} fullWidth>
                            Eliminar
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default EducationPopup;