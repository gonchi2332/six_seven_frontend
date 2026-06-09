import Button from '../../../../components/Button';


interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    fieldLabel: string;
    isDeleting?: boolean;
}

const styles = {
    overlay: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto",
    container: "min-h-screen flex items-center justify-center p-4",
    modal: "bg-surface rounded-2xl p-6 w-full max-w-md mx-auto",
    title: "text-2xl font-bold text-surface font-inter mb-4",
    message: "text-surface font-nunito mb-6",
    buttonContainer: "flex gap-3",
};

// Modal de confirmación para eliminar un campo de información personal
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, fieldLabel, isDeleting }: ConfirmDeleteModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modal}>
                    <h2 className={styles.title}>Eliminar Información Personal</h2>
                    <p className={styles.message}>
                        ¿Estás seguro que deseas eliminar {fieldLabel}?
                    </p>
                    <div className={styles.buttonContainer}>
                        <Button variant="secondary" onClick={onClose} fullWidth>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={onConfirm} disabled={isDeleting} fullWidth>
                            {isDeleting ? 'Eliminando...' : 'Confirmar'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;

