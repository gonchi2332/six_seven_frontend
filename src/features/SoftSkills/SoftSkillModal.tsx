import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import {useSoftSkills} from "../../hooks/userSoftSkills";



interface SoftSkillModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (skillName: string, oldName?: string) => Promise<void>;
    initialName?: string;
    isEditing?: boolean;
    error?: string | null;
    isSubmitting?: boolean;
}

const styles = {
    overlay: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
    modal: "bg-primary rounded-2xl p-6 w-full max-w-md mx-4",
    title: "text-2xl font-bold text-surface font-inter mb-4",
    serverError: "mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-nunito text-center",
    buttonContainer: "flex gap-3 mt-6",
};

const SoftSkillModal = ({ 
    isOpen, 
    onClose, 
    onSave, 
    initialName = '', 
    isEditing = false,
    error: serverError,
    isSubmitting = false
}: SoftSkillModalProps) => {
    const [name, setName] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);
    const { validateSkillName } = useSoftSkills();
    useEffect(() => {
        if (isOpen) {
            setName(initialName);
            setLocalError(null);
        }
    }, [isOpen, initialName]);

    if (!isOpen) return null;

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
        
        // Validación en tiempo real
        if (value.trim()) {
            const error = validateSkillName(value);
            setLocalError(error);
        } else {
            setLocalError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        
        // Validación final
        const validationError = validateSkillName(trimmed);
        if (validationError) {
            setLocalError(validationError);
            return;
        }

        await onSave(trimmed, isEditing ? initialName : undefined);
    };

    const isDisabled = isSubmitting || !name.trim() || !!localError;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.title}>
                    {isEditing ? 'Editar Habilidad Blanda' : 'Agregar Habilidad Blanda'}
                </h2>
                
                {/* Error del servidor dentro del modal */}
                {serverError && (
                    <div className={styles.serverError}>
                        {serverError}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nombre de la habilidad"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Ej: Comunicación asertiva"
                        type="text"
                        error={localError || undefined}
                        maxLength={50}
                        disabled={isSubmitting}
                        className="w-full"
                    />
                    <div className={styles.buttonContainer}>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            fullWidth
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isDisabled}
                            fullWidth
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SoftSkillModal;