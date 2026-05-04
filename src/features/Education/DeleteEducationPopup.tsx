import Button from "../../components/Button/Button";
import PopUpCard from "../../components/PopUpCard/PopUpCard";

interface Props {
    institution: string;
    onConfirm: () => void;
    onClose: () => void;
    isSubmitting?: boolean;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50",
    message: "text-[18px] font-nunito text-surface text-center px-6 sm:px-8 pb-4",
    buttonsWrapper: "flex gap-4 justify-center mt-2 px-6 sm:px-8 pb-6",
};

const DeleteEducationPopup = ({ institution, onConfirm, onClose, isSubmitting = false }: Props) => {
    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm">
                <PopUpCard title={`Eliminar: ${institution}`}>
                    <p className={styles.message}>
                        ¿Estás seguro que quieres eliminar este registro?
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

export default DeleteEducationPopup;