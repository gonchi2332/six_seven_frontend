import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import type { WorkExperience, UpdateWorkExperienceDto } from '../../hooks/useWorkExperiences';

interface EditWorkExperienceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: (id: number, data: UpdateWorkExperienceDto) => Promise<void>;
    experience: WorkExperience | null;
}

const styles = {
    overlay: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto",
    container: "min-h-screen flex items-center justify-center p-4",
    modal: "bg-primary rounded-2xl p-6 w-full max-w-lg mx-auto",
    title: "text-2xl font-bold text-surface font-inter mb-4",
    form: "flex flex-col gap-4",
    row: "grid grid-cols-1 md:grid-cols-2 gap-4",
    checkboxContainer: "flex items-center gap-2 mt-2",
    checkbox: "w-4 h-4 text-primary rounded focus:ring-primary",
    checkboxLabel: "text-surface font-nunito",
    buttonContainer: "flex gap-3 mt-6",
};

const formatDateForInput = (dateStr: string | null): string => {
    if (!dateStr) return '';
    // Extraer solo YYYY-MM-DD de la fecha ISO
    if (dateStr.includes('T')) {
        return dateStr.split('T')[0] || '';
    }
    return dateStr;
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

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!position.trim()) newErrors.position = 'El puesto es obligatorio';
        if (!company.trim()) newErrors.company = 'La empresa es obligatoria';
        if (!description.trim()) newErrors.description = 'La descripción es obligatoria';
        if (!startDate) newErrors.startDate = 'La fecha de inicio es obligatoria';
        if (!isCurrent && !endDate) newErrors.endDate = 'La fecha de fin es obligatoria';
        
        // Validar formato de fecha YYYY-MM-DD
        if (startDate && !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
            newErrors.startDate = 'Formato de fecha inválido (YYYY-MM-DD)';
        }
        if (endDate && !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
            newErrors.endDate = 'Formato de fecha inválido (YYYY-MM-DD)';
        }
        
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
            handleClose();
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
                <div className={styles.modal}>
                    <h2 className={styles.title}>Modificar Experiencia Laboral</h2>
                    
                    {apiError && (
                        <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-200">
                            {apiError}
                        </div>
                    )}
                    
                    <div className={styles.form}>
                        <TextField
                            label="Puesto:*"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            disabled={true}
                            placeholder="Ej: Full Stack Developer"
                            error={errors.position}
                        />
                        
                        <TextField
                            label="Empresa:*"
                            value={company}
                            disabled={true}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Ej: WIMETRIX"
                            error={errors.company}
                        />
                        
                        <TextField
                            label="Descripción:*"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe tus responsabilidades y logros..."
                            error={errors.description}
                        />
                        
                        <div className={styles.row}>
                            <div>
                                <TextField
                                    label="Fecha Inicio:*"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    error={errors.startDate}
                                    inputProps={{ max: new Date().toISOString().split('T')[0] }}
                                />
                            </div>
                            
                            <div>
                                <TextField
                                    label="Fecha Fin:"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    disabled={isCurrent}
                                    error={errors.endDate}
                                    inputProps={{ max: new Date().toISOString().split('T')[0] }}
                                />
                            </div>
                        </div>
                        
                        <div className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                id="isCurrent"
                                checked={isCurrent}
                                onChange={(e) => setIsCurrent(e.target.checked)}
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
                                disabled={isSubmitting}
                                fullWidth
                            >
                                {isSubmitting ? 'Guardando...' : 'Modificar'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditWorkExperienceModal;