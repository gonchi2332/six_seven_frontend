import Button from '../../components/Button';

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
    modal: "bg-primary rounded-2xl p-6 w-full max-w-md mx-auto",
    title: "text-2xl font-bold text-surface font-inter mb-2",
    message: "text-surface font-nunito mb-6",
    buttonContainer: "flex gap-3",
};

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, message }: ConfirmDeleteModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modal}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.message}>{message}</p>
                    <div className={styles.buttonContainer}>
                        <Button variant="secondary" onClick={onClose} fullWidth>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={onConfirm} fullWidth>
                            Eliminar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;