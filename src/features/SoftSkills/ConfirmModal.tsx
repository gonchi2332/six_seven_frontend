import Button from '../../components/Button';
import PopUpCard from '../../components/PopUpCard';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isLoading?: boolean;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50",
    message: "text-[18px] font-nunito text-surface text-center px-6 sm:px-8 pb-4",
    buttonContainer: "flex gap-4 justify-center mt-2 px-6 sm:px-8 pb-6",
};

const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    isLoading = false 
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm">
                <PopUpCard title={title}>
                    <p className={styles.message}>{message}</p>
                    <div className={styles.buttonContainer}>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            fullWidth
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={onConfirm}
                            fullWidth
                            disabled={isLoading}
                        >
                            {isLoading ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default ConfirmModal;