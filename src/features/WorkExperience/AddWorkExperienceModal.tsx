import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import PopUpCard from '../../components/PopUpCard';
import { useWorkExperienceForm } from '../../hooks/useWorkExperienceForm';

interface AddWorkExperienceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: any) => Promise<void>;
}

const styles = {
    overlay: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto",
    container: "min-h-screen flex items-center justify-center p-4",
    form: "flex flex-col gap-4 px-6 py-4",
    row: "grid grid-cols-1 md:grid-cols-2 gap-4",
    checkboxContainer: "flex items-center gap-2",
    checkbox: "w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer",
    checkboxLabel: "text-surface font-nunito text-sm cursor-pointer",
    buttonContainer: "flex gap-3 px-6 pb-6",
    apiError: "mx-6 mt-2 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/50 rounded-xl font-nunito",
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

    useEffect(() => {
        if (isOpen) {
            resetForm();
            setApiError(null);
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
            setApiError(err.message || 'Error al registrar la experiencia');
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
                <PopUpCard title="Registrar Experiencia Laboral">
                    {apiError && (
                    <div className={styles.apiError}>
                        {apiError}
                        </div>
                    )}
                    
                    <div className={styles.form}>
                        {/* Fila: Puesto y Empresa */}
                        <div className={styles.row}>
                            <TextField
                                label="Puesto:*"
                                value={formData.position}
                                onChange={(e) => handlePositionChange(e.target.value)}
                                placeholder="Ej: Full Stack Developer"
                                error={errors.position}
                                maxLength={50}
                            />

                            <TextField
                                label="Empresa:*"
                                value={formData.company}
                                onChange={(e) => handleCompanyChange(e.target.value)}
                                placeholder="Ej: WIMETRIX"
                                error={errors.company}
                                maxLength={50}
                            />
                        </div>

                        {/* Descripción - ancho completo */}
                        <TextField
                            label="Descripción:*"
                            value={formData.description}
                            onChange={(e) => handleDescriptionChange(e.target.value)}
                            placeholder="Describe tus responsabilidades..."
                            error={errors.description}
                            maxLength={200}
                        />

                        {/* Fila: Fechas */}
                        <div className={styles.row}>
                            <TextField
                                label="Fecha de inicio:*"
                                type="date"
                                placeholder={"dd/mm/aaaa"}
                                value={formData.startDate}
                                onChange={(e) => handleStartDateChange(e.target.value)}
                                error={errors.startDate}
                            />

                            <TextField
                                label="Fecha de finalizacion:*"
                                type="date"
                                placeholder={"dd/mm/aaaa"}
                                value={formData.isCurrent ? '' : formData.endDate}
                                onChange={(e) => handleEndDateChange(e.target.value)}
                                error={errors.endDate}
                                disabled={formData.isCurrent}
                            />
                        </div>
                        
                        {/* Checkbox */}
                        <div className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                id="isCurrentAdd"
                                checked={formData.isCurrent}
                                onChange={(e) => {
                                    handleIsCurrentChange(e.target.checked);
                                }}
                                className={styles.checkbox}
                            />
                            <label htmlFor="isCurrentAdd" className={styles.checkboxLabel}>
                                Trabajo actualmente aquí
                            </label>
                        </div>
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
                            {isSubmitting ? 'Registrando...' : 'Registrar'}
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default AddWorkExperienceModal;