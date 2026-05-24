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
    overlay: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 overflow-y-auto",
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

// ============================================
// VALIDACIONES EN TIEMPO REAL
// ============================================

const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const validatePosition = (value: string): string => {
    if (!value.trim()) return 'El puesto es obligatorio';
    return '';
};

const validateDescription = (value: string): string => {
    if (!value.trim()) return 'La descripción es obligatoria';
    return '';
};

const validateStartDate = (value: string): string => {
    if (!value) return 'La fecha de inicio es obligatoria';
    const today = getTodayDateString();
    if (value > today) return 'La fecha de inicio no puede ser futura';
    return '';
};

const validateEndDate = (value: string, isCurrent: boolean): string => {
    if (!isCurrent && !value) return 'La fecha de finalización es obligatoria';
    if (value) {
        const today = getTodayDateString();
        if (value > today) return 'La fecha de finalización no puede ser futura';
    }
    return '';
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const EditWorkExperienceModal = ({ isOpen, onClose, onEdit, experience }: EditWorkExperienceModalProps) => {
    const [position, setPosition] = useState('');
    const [company, setCompany] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isCurrent, setIsCurrent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    
    // Errores en tiempo real
    const [positionError, setPositionError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [startDateError, setStartDateError] = useState('');
    const [endDateError, setEndDateError] = useState('');

    useEffect(() => {
        if (experience && isOpen) {
            setPosition(experience.position);
            setCompany(experience.company_name);
            setDescription(experience.description);
            setStartDate(formatDateForInput(experience.start_date));
            setEndDate(formatDateForInput(experience.end_date));
            setIsCurrent(!experience.end_date);
            
            // Limpiar errores al cargar
            setPositionError('');
            setDescriptionError('');
            setStartDateError('');
            setEndDateError('');
        }
    }, [experience, isOpen]);

    // Handlers con validación en tiempo real
    const handlePositionChange = (value: string) => {
        setPosition(value);
        setPositionError(validatePosition(value));
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        setDescriptionError(validateDescription(value));
    };

    const handleStartDateChange = (value: string) => {
        setStartDate(value);
        setStartDateError(validateStartDate(value));
    };

    const handleEndDateChange = (value: string) => {
        setEndDate(value);
        setEndDateError(validateEndDate(value, isCurrent));
    };

    const handleIsCurrentChange = (checked: boolean) => {
        setIsCurrent(checked);
        if (checked) {
            setEndDateError('');
        } else if (!endDate) {
            setEndDateError('La fecha de finalización es obligatoria');
        }
    };

    const hasChanges = () => {
        if (!experience) return false;

        const originalStartDate = formatDateForInput(experience.start_date);
        const originalEndDate = formatDateForInput(experience.end_date);

        const currentIsCurrent = !experience.end_date;
        const endDateChanged = isCurrent !== currentIsCurrent || (!isCurrent && endDate !== originalEndDate);

        return (
            position.trim() !== experience.position ||
            description.trim() !== experience.description ||
            startDate !== originalStartDate ||
            endDateChanged
        );
    };

    const isFormValid = (): boolean => {
        return (
            position.trim() !== '' &&
            description.trim() !== '' &&
            startDate !== '' &&
            (isCurrent || endDate !== '') &&
            positionError === '' &&
            descriptionError === '' &&
            startDateError === '' &&
            endDateError === ''
        );
    };

    const handleSubmit = async () => {
        setApiError(null);
        if (!experience || !isFormValid()) return;
        
        setIsSubmitting(true);
        try {
            await onEdit(experience.id, {
                //position: position.trim(),
                //companyName: company.trim(),
                description: description.trim(),
                startDate,
                endDate: isCurrent ? null : endDate,
            });
        } catch (err: any) {
            setApiError(err.message || 'Error al modificar la experiencia');
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
                <PopUpCard title={`Modificar: ${experience?.position}`}>
                    {apiError && <div className={styles.apiError}>{apiError}</div>}
                    
                    <div className={styles.form}>
                        {/* Fila: Puesto y Empresa */}
                        <div className={styles.row}>
                            <TextField
                                label="Puesto:*"
                                value={position}
                                onChange={(e) => handlePositionChange(e.target.value)}
                                placeholder="Ej: Full Stack Developer"
                                error={positionError}
                                disabled = {true}
                            />
                            
                            <TextField
                                label="Empresa:*"
                                value={company}
                                onChange={() => {}}
                                disabled={true}
                                placeholder="Ej: WIMETRIX"
                            />
                        </div>
                  
                        {/* Descripción - ancho completo */}
                        <TextField
                            label="Descripción:*"
                            value={description}
                            onChange={(e) => handleDescriptionChange(e.target.value)}
                            placeholder="Describe tus responsabilidades y logros..."
                            error={descriptionError}
                            maxLength={200}
                        />

                        {/* Fila: Fechas */}
                        <div className={styles.row}>
                            <TextField
                                label="Fecha de inicio:*"
                                type="date"
                                value={startDate}
                                onChange={(e) => handleStartDateChange(e.target.value)}
                                error={startDateError}
                            />

                            <TextField
                                label="Fecha de finalización:"
                                type="date"
                                value={isCurrent ? '' : endDate}
                                onChange={(e) => handleEndDateChange(e.target.value)}
                                disabled={isCurrent}
                                error={endDateError}
                            />
                        </div>

                        {/* Checkbox */}
                        <div className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                id="isCurrentEdit"
                                checked={isCurrent}
                                onChange={(e) => handleIsCurrentChange(e.target.checked)}
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
                            disabled={isSubmitting || !hasChanges() || !isFormValid()} 
                            fullWidth
                        >
                            {isSubmitting ? 'Guardando...' : 'Modificar'}
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default EditWorkExperienceModal;