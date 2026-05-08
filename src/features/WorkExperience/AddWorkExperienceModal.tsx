import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import { useWorkExperienceForm } from '../../hooks/useWorkExperienceForm';

interface AddWorkExperienceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: any) => Promise<void>;
}

const styles = {
    overlay: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto",
    container: "min-h-screen flex items-center justify-center p-4",
    modal: "bg-primary rounded-2xl p-6 w-full max-w-lg mx-auto",
    title: "text-2xl font-bold text-surface font-inter mb-4",
    form: "flex flex-col gap-4",
    row: "grid grid-cols-1 md:grid-cols-2 gap-4",
    dateLabel: "block text-surface font-nunito mb-1 text-sm",
    dateInput: "w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none font-nunito bg-white",
    dateInputError: "border-red-500 focus:border-red-500",
    checkboxContainer: "flex items-center gap-2 mt-2",
    checkbox: "w-4 h-4 text-primary rounded focus:ring-primary",
    checkboxLabel: "text-surface font-nunito",
    buttonContainer: "flex gap-3 mt-6",
    errorText: "text-red-500 text-sm mt-1",
};

const AddWorkExperienceModal = ({ isOpen, onClose, onAdd }: AddWorkExperienceModalProps) => {
    const {
        formData,
        errors,
        handlePositionChange,
        handleCompanyChange,
        handleDescriptionChange,
        handleStartDateChange,
        handleEndDateChange,
        handleIsCurrentChange,
        validateForm,
        resetForm,
        isFormValid,
    } = useWorkExperienceForm();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    // Resetear cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen, resetForm]);

    const handleSubmit = async () => {
        setApiError(null);
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        try {
            await onAdd({
                position: formData.position,
                companyName: formData.company,
                description: formData.description,
                startDate: formData.startDate,
                endDate: formData.isCurrent ? undefined : formData.endDate,
            });
            onClose();
        } catch (err: any) {
            setApiError(err.message || 'Error al agregar la experiencia');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setApiError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modal}>
                    <h2 className={styles.title}>Agregar Experiencia Laboral</h2>
                    
                    {apiError && (
                        <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-200">
                            {apiError}
                        </div>
                    )}
                    
                    <div className={styles.form}>
                        <TextField
                            label="Puesto:*"
                            value={formData.position}
                            onChange={(e) => handlePositionChange(e.target.value)}
                            placeholder="Ej: Full Stack Developer"
                            error={errors.position}
                        />
                        
                        <TextField
                            label="Empresa:*"
                            value={formData.company}
                            onChange={(e) => handleCompanyChange(e.target.value)}
                            placeholder="Ej: WIMETRIX"
                            error={errors.company}
                        />
                        
                        <TextField
                            label="Descripción:*"
                            value={formData.description}
                            onChange={(e) => handleDescriptionChange(e.target.value)}
                            placeholder="Describe tus responsabilidades..."
                            error={errors.description}
                        />
                        
                        <div className={styles.row}>
                            <div>
                                <TextField
                                    label="Fecha Inicio:*"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => handleStartDateChange(e.target.value)}
                                    error={errors.startDate}
                                />
                            </div>
                            
                            <div>
                                <TextField
                                    label="Fecha Fin:"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => handleEndDateChange(e.target.value)}
                                    error={errors.endDate}
                                    disabled={formData.isCurrent}
                                />
                            </div>
                        </div>
                        
                        <div className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                id="isCurrent"
                                checked={formData.isCurrent}
                                onChange={(e) => handleIsCurrentChange(e.target.checked)}
                                className={styles.checkbox}
                            />
                            <label htmlFor="isCurrent" className={styles.checkboxLabel}>
                                Trabajo actualmente aquí
                            </label>
                        </div>
                        
                        <div className={styles.buttonContainer}>
                            <Button variant="secondary" onClick={handleClose} fullWidth>
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !isFormValid()}
                                fullWidth
                            >
                                {isSubmitting ? 'Agregando...' : 'Agregar'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddWorkExperienceModal;