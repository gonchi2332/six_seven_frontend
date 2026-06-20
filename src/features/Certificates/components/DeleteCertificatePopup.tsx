import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";

interface Props {
    title: string; // Título del certificado a eliminar
    onConfirm: () => void;
    onClose: () => void;
    isSubmitting?: boolean;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 py-4 z-50",
    message: "text-[15px] sm:text-[16px] font-nunito text-surface text-center px-4 sm:px-8 pb-4",
    highlight: "text-white font-semibold",
    buttonsWrapper: "flex gap-3 justify-center mt-2 px-4 sm:px-8 pb-6",
};

// Popup de confirmación antes de eliminar un certificado
const DeleteCertificatePopup = ({ title, onConfirm, onClose, isSubmitting = false }: Props) => {
    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm max-h-[90vh] overflow-y-auto">
                <PopUpCard title="Eliminar Certificado">
                    <p className={styles.message}>
                        ¿Estás seguro que quieres eliminar
                        <span className={styles.highlight}> {title}</span>?
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

export default DeleteCertificatePopup;