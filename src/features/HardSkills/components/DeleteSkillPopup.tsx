import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";

interface DeleteSkillPopupProps {
    skillName: string;
    onConfirm: () => void;
    onClose: () => void;
    isSubmitting?: boolean;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 py-4 z-50",
    message: "text-[16px] font-nunito text-surface text-center px-6 sm:px-8 pb-4",
    highlight: "text-white font-semibold",
    buttonsWrapper: "flex gap-4 justify-center mt-2 px-6 sm:px-8 pb-6",
};

// Popup de confirmación para eliminar habilidad
const DeleteSkillPopup = ({ skillName, onConfirm, onClose, isSubmitting = false }: DeleteSkillPopupProps) => {
    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm max-h-[90vh] overflow-y-auto">
                <PopUpCard title="Eliminar Habilidad">
                    <p className={styles.message}>
                        ¿Estás seguro que deseas eliminar{" "}
                        <span className={styles.highlight}>{skillName}</span>?
                    </p>
                    <div className={styles.buttonsWrapper}>
                        <Button type="button" variant="secondary" onClick={onClose} fullWidth disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="button" variant="primary" onClick={onConfirm} fullWidth disabled={isSubmitting}>
                            {isSubmitting ? "Eliminando..." : "Eliminar"}
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default DeleteSkillPopup;