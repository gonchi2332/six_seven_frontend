import Button from '../../components/Button';
import PopUpCard from '../../components/PopUpCard';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const styles = {
    overlay: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto",
    container: "min-h-screen flex items-center justify-center p-4",
    content: "px-6 py-4",
    message: "text-surface font-nunito text-center mb-6",
    buttonContainer: "flex gap-3 px-6 pb-6",
};

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, message }: ConfirmDeleteModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <PopUpCard title={title}>
                    <div className={styles.content}>
                        <p className={styles.message}>{message}</p>
                    </div>
                    <div className={styles.buttonContainer}>
                        <Button variant="secondary" onClick={onClose} fullWidth>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={onConfirm} fullWidth>
                            Eliminar
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;