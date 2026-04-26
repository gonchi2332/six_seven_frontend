import { useState, useEffect } from "react";
import Button from "../../components/Button";

interface SoftSkillModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (skillName: string, oldName?: string) => Promise<void>;
    initialName?: string;      // para edición: nombre actual
    isEditing?: boolean;
}

const styles = {
    overlay: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
    modal: "bg-surface rounded-2xl p-6 w-full max-w-md mx-4",
    title: "text-2xl font-bold text-main font-inter mb-4",
    label: "block text-main font-nunito mb-1",
    input: "w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-nunito",
    buttonContainer: "flex gap-3 mt-6",
};

const SoftSkillModal = ({ 
    isOpen, 
    onClose, 
    onSave, 
    initialName = '', 
    isEditing = false 
}: SoftSkillModalProps) => {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName(initialName);
        }
    }, [isOpen, initialName]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;

        setIsLoading(true);
        try {
            if (isEditing) {
                await onSave(trimmed, initialName);
            } else {
                await onSave(trimmed);
            }
            onClose();
        } catch (error) {
            console.error('Error al guardar:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.title}>
                    {isEditing ? 'Editar Habilidad Blanda' : 'Agregar Habilidad Blanda'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <label className={styles.label}>
                        Nombre de la habilidad
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.input}
                        placeholder="Ej: Comunicación asertiva"
                        autoFocus
                        maxLength={50}
                    />
                    <div className={styles.buttonContainer}>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            fullWidth
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading || !name.trim()}
                            fullWidth
                        >
                            {isLoading ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SoftSkillModal;