import { useState } from 'react';
import Button from '../../../components/Button';

// Campos que se pueden eliminar (todos excepto username, firstName, firstSurname, imagen)
export type DeletableField = 'secondSurname' | 'city' | 'email' | 'phone' | 'country';

export interface FieldValue {
    field: DeletableField;
    label: string;
    value: string;
}

interface DeleteInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (field: DeletableField) => Promise<void>;
    fieldsWithValues: FieldValue[];
}

const styles = {
    overlay: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto",
    container: "min-h-screen flex items-center justify-center p-4",
    modal: "bg-surface rounded-2xl p-6 w-full max-w-md mx-auto",
    title: "text-2xl font-bold text-main font-inter mb-4",
    label: "block text-main font-nunito mb-1",
    select: "w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-nunito bg-white mb-4",
    selectedInfo: "bg-accent/10 rounded-xl p-3 mb-4",
    selectedLabel: "text-accent text-xs uppercase tracking-wide font-bold",
    selectedValue: "text-main font-nunito text-base mt-1",
    buttonContainer: "flex gap-3 mt-6",
};

const DeleteInfoModal = ({ isOpen, onClose, onDelete, fieldsWithValues }: DeleteInfoModalProps) => {
    const [selectedField, setSelectedField] = useState<DeletableField | ''>('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const selectedOption = fieldsWithValues.find(f => f.field === selectedField);
    const hasSelection = selectedField !== '';

    const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedField(e.target.value as DeletableField | '');
        setShowConfirm(false);
    };

    const handleDeleteClick = () => {
        if (hasSelection) {
            setShowConfirm(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedField) return;
        setIsDeleting(true);
        try {
            await onDelete(selectedField);
            setSelectedField('');
            setShowConfirm(false);
            onClose();
        } finally {
            setIsDeleting(false);
        }
    };

    const handleClose = () => {
        setSelectedField('');
        setShowConfirm(false);
        onClose();
    };

    if (!isOpen) return null;

    // Modal de confirmación
    if (showConfirm && selectedOption) {
        return (
            <div className={styles.overlay} onClick={handleClose}>
                <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modal}>
                        <h2 className={styles.title}>Eliminar Información Personal</h2>
                        <p className="text-main font-nunito mb-6">
                            ¿Estás seguro que quieres eliminar {selectedOption.label}?
                        </p>
                        <div className={styles.buttonContainer}>
                            <Button variant="secondary" onClick={() => setShowConfirm(false)} fullWidth>
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                fullWidth
                            >
                                {isDeleting ? 'Eliminando...' : 'Confirmar'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modal}>
                    <h2 className={styles.title}>Eliminar Información Personal</h2>

                    <label className={styles.label}>Selecciona un campo para eliminar</label>
                    <select
                        value={selectedField}
                        onChange={handleFieldChange}
                        className={styles.select}
                    >
                        <option value="" disabled>Selecciona un campo</option>
                        {fieldsWithValues.map((item) => (
                            <option key={item.field} value={item.field}>
                                {item.label}
                            </option>
                        ))}
                    </select>

                    {selectedOption && (
                        <div className={styles.selectedInfo}>
                            <p className={styles.selectedLabel}>{selectedOption.label}</p>
                            <p className={styles.selectedValue}>{selectedOption.value}</p>
                        </div>
                    )}

                    <div className={styles.buttonContainer}>
                        <Button variant="secondary" onClick={handleClose} fullWidth>
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleDeleteClick}
                            disabled={!hasSelection || isDeleting}
                            fullWidth
                        >
                            Eliminar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteInfoModal;