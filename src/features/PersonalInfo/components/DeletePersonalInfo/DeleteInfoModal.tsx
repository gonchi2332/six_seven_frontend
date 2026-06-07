import { useState } from 'react';
import Button from '../../../../components/Button';

/*
  Campos que se pueden eliminar:
  -secondSurname: Segundo apellido
  -city: Ciudad
  -email: Correo de contacto
  -phone: Teléfono
  -country: País
  (Nota: username, firstName, firstSurname e imagen no se pueden eliminar)
*/
export type DeletableField = 'secondSurname' | 'city' | 'email' | 'phone' | 'country';

/*
  Estructura de un campo con valor:
  -field: Identificador del campo
  -label: Etiqueta mostrada al usuario
  -value: Valor actual del campo
*/
export interface FieldValue {
    field: DeletableField;
    label: string;
    value: string;
}

/*
  Props del componente DeleteInfoModal:
  -isOpen: Controla si el modal es visible
  -onClose: Función ejecutada al cerrar el modal
  -onDelete: Función para eliminar el campo, recibe el campo a eliminar
  -fieldsWithValues: Lista de campos que tienen valor y pueden ser eliminados
*/
interface DeleteInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (field: DeletableField) => Promise<void>;
    fieldsWithValues: FieldValue[];
}

const styles = {
    overlay: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto",
    container: "min-h-screen flex items-center justify-center p-4",
    modal: "bg-primary rounded-2xl p-6 w-full max-w-md mx-auto",
    title: "text-2xl font-bold text-surface font-inter mb-4",
    label: "block text-surface font-nunito mb-1",
    select: "w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-nunito bg-white mb-4",
    selectedInfo: "bg-accent/10 rounded-xl p-3 mb-4",
    selectedLabel: "text-accent text-xs uppercase tracking-wide font-bold",
    selectedValue: "text-surface font-nunito text-base mt-1",
    buttonContainer: "flex gap-3 mt-6",
};

/*
  Características:
  -Modal para eliminar información personal del usuario
  -Dos pasos: selección de campo y confirmación
  -Muestra selector con los campos que tienen valor
  -Al seleccionar un campo, muestra el valor actual para confirmación
  -Al hacer clic en "Eliminar", muestra segundo modal de confirmación
  -Maneja estado de carga durante la eliminación
  -Soporta diferentes tipos de campos (secondSurname, city, email, phone, country)

  Flujo:
  1. Usuario selecciona campo del selector
  2. Se muestra el valor actual del campo
  3. Click en "Eliminar" muestra modal de confirmación
  4. Confirmación ejecuta onDelete y cierra el modal

  @ Ejemplo:
  <DeleteInfoModal
    isOpen={showModal}
    onClose={() => setShowModal(false)}
    onDelete={handleDeleteField}
    fieldsWithValues={[
      { field: 'city', label: 'Ciudad', value: 'La Paz' },
      { field: 'phone', label: 'Teléfono', value: '+591 77123456' }
    ]}
  />
*/
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

    // Modal de confirmación (segundo paso)
    if (showConfirm && selectedOption) {
        return (
            <div className={styles.overlay} onClick={handleClose}>
                <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modal}>
                        <h2 className={styles.title}>Eliminar Información Personal</h2>
                        <p className="text-main font-nunito mb-6">
                            ¿Estás seguro que deseas eliminar {selectedOption.label}?
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

    // Modal de selección (primer paso)
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

