import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import PopUpCard from '../../components/PopUpCard';
import { useSoftSkills } from "../../hooks/userSoftSkills";

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
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50",
    serverError: "mx-6 sm:mx-8 mb-2 p-3 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-nunito text-center",
    formWrapper: "flex flex-col gap-4 px-6 sm:px-8 pb-2",
    buttonContainer: "flex gap-4 justify-center mt-2 px-6 sm:px-8 pb-6",
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
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm">
                <PopUpCard title={isEditing ? 'Editar Habilidad' : 'Añadir Habilidad'}>
                    {/* Error del servidor dentro del modal */}
                    {serverError && (
                        <div className={styles.serverError}>
                            {serverError}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formWrapper}>
                            <TextField
                                label="Nombre de la habilidad:*"
                                value={name}
                                onChange={handleNameChange}
                                placeholder="Ej: Comunicación asertiva"
                                type="text"
                                error={localError || undefined}
                                maxLength={50}
                                disabled={isSubmitting}
                            />
                        </div>
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
                                {isSubmitting ? 'Guardando...' : 'Aceptar'}
                            </Button>
                        </div>
                    </form>
                </PopUpCard>
            </div>
        </div>
    );
};

export default SoftSkillModal;