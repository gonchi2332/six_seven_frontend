import Button from "../Button";
import PopUpCard from "../PopUpCard";

interface ConfirmDeletePopupProps {
    isOpen: boolean;
    skillName: string;
    onConfirm: () => void;
    onClose: () => void;
    isLoading?: boolean;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50",
    message: "text-[16px] font-nunito text-surface text-center px-6 sm:px-8 pb-4",
    highlight: "text-white font-semibold",
    buttonsWrapper: "flex gap-4 justify-center mt-2 px-6 sm:px-8 pb-6",
};

const ConfirmDeletePopup = ({ isOpen, skillName, onConfirm, onClose, isLoading = false }: ConfirmDeletePopupProps) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm">
                <PopUpCard title="Eliminar Habilidad">
                    <p className={styles.message}>
                        ¿Estás seguro que quieres eliminar{" "}
                        <span className={styles.highlight}>{skillName}</span>?
                    </p>
                    <div className={styles.buttonsWrapper}>
                        <Button type="button" variant="secondary" onClick={onClose} fullWidth disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button type="button" variant="primary" onClick={onConfirm} fullWidth disabled={isLoading}>
                            {isLoading ? "Eliminando..." : "Eliminar"}
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default ConfirmDeletePopup;