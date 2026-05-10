import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import PopUpCard from '../../components/PopUpCard';
import type { WorkExperience, UpdateWorkExperienceDto } from '../../hooks/useWorkExperiences';

interface EditWorkExperienceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: (id: number, data: UpdateWorkExperienceDto) => Promise<void>;
    experience: WorkExperience | null;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4",
    container: "w-full max-w-2xl flex items-center justify-center p-4",
    form: "flex flex-col gap-4 px-6 py-4",
    row: "grid grid-cols-1 md:grid-cols-2 gap-4",
    checkboxContainer: "flex items-center gap-2 mt-2",
    checkbox: "w-4 h-4 accent-[#90DDF0] rounded cursor-pointer",
    checkboxLabel: "text-white/80 font-nunito text-sm cursor-pointer hover:text-white transition-colors",
    buttonContainer: "flex gap-3 px-6 pb-6",
    apiError: "mx-6 mt-2 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/50 rounded-xl font-nunito",
};

const formatDateForInput = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '';
    return dateStr.split('T')[0] ?? '';
};

const EditWorkExperienceModal = ({ isOpen, onClose, onEdit, experience }: EditWorkExperienceModalProps) => {
    const [position, setPosition] = useState('');
    const [company, setCompany] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isCurrent, setIsCurrent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        if (experience) {
            setPosition(experience.position);
            setCompany(experience.company_name);
            setDescription(experience.description);
            setStartDate(formatDateForInput(experience.start_date));
            setEndDate(formatDateForInput(experience.end_date));
            setIsCurrent(!experience.end_date);
        }
    }, [experience]);

    /**
     * Lógica para deshabilitar el botón si no hay cambios reales
     */
    const hasChanges = () => {
        if (!experience) return false;

        const originalStartDate = formatDateForInput(experience.start_date);
        const originalEndDate = formatDateForInput(experience.end_date);

        // Validar si la fecha de fin cambió (considerando el checkbox de "actualidad")
        const currentIsCurrent = !experience.end_date;
        const endDateChanged = isCurrent !== currentIsCurrent || (!isCurrent && endDate !== originalEndDate);

        return (
            position.trim() !== experience.position ||
            company.trim() !== experience.company_name ||
            description.trim() !== experience.description ||
            startDate !== originalStartDate ||
            endDateChanged
        );
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!position.trim()) newErrors.position = 'El puesto es obligatorio';
        if (!company.trim()) newErrors.company = 'La empresa es obligatoria';
        if (!description.trim()) newErrors.description = 'La descripción es obligatoria';
        if (!startDate) newErrors.startDate = 'La fecha de inicio es obligatoria';
        if (!isCurrent && !endDate) newErrors.endDate = 'La fecha de fin es obligatoria';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        setApiError(null);
        if (!experience || !validateForm()) return;
        
        setIsSubmitting(true);
        try {
            await onEdit(experience.id, {
                position: position.trim(),
                companyName: company.trim(),
                description: description.trim(),
                startDate,
                endDate: isCurrent ? undefined : endDate,
            });
            onClose();
        } catch (err: any) {
            setApiError(err.message || 'Error al modificar la experiencia');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setErrors({});
        setApiError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <PopUpCard title="Modificar Experiencia Laboral">
                    {apiError && <div className={styles.apiError}>{apiError}</div>}
                    
                    <div className={styles.form}>
                        <div className={styles.row}>
                            <TextField
                                label="Puesto:*"
                                value={position}
                                onChange={() =>({})}
                                disabled={true}
                                error={errors.position}
                            />
                            <TextField
                                label="Empresa:*"
                                value={company}
                                onChange={() =>({})}
                                disabled={true}
                                error={errors.company}
                            />
                        </div>
                  
                        {/* Descripción - ancho completo */}
                        <TextField
                            label="Descripción:*"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe tus responsabilidades y logros..."
                            error={errors.description}
                            maxLength={200}
                        />

                        {/* Fila: Fechas */}
                        <div className={styles.row}>
                            <TextField
                                label="Fecha Inicio:*"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                placeholder={"dd/mm/aaaa"}
                                error={errors.startDate}
                            />

                            <TextField
                                label="Fecha Fin:"
                                type="date"
                                placeholder={"dd/mm/aaaa"}
                                value={isCurrent ? '' : endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                disabled={isCurrent}
                                error={errors.endDate}
                            />
                        </div>
                        {/* Checkbox */}
                        <div className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                id="isCurrentEdit"
                                checked={isCurrent}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setIsCurrent(checked);
                                    if (checked) {
                                        setEndDate('');
                                        setErrors(prev => {
                                            const newErrors = { ...prev };
                                            delete newErrors.endDate;
                                            return newErrors;
                                        });
                                    }
                                }}
                                className={styles.checkbox}
                            />
                            <label htmlFor="isCurrentEdit" className={styles.checkboxLabel}>
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
                            disabled={isSubmitting || !hasChanges()} 
                            fullWidth
                        >
                            {isSubmitting ? 'Guardando...' : 'Aceptar'}
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default EditWorkExperienceModal;