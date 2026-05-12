import { useState, useEffect } from 'react';
import { 
    getWorkExperiences,
    createWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
    type WorkExperienceBackend
} from '../services/workExperienceService';

// ============================================
// TIPOS
// ============================================

export type WorkExperience = WorkExperienceBackend;

export interface CreateWorkExperienceDto {
    position: string;
    companyName: string;
    description: string;
    startDate: string;
    endDate?: string | null;  
}

export interface UpdateWorkExperienceDto {
    position?: string;
    companyName?: string;
    description?: string;
    startDate?: string;
    endDate?: string | null;  
}

// ============================================
// VALIDACIONES
// ============================================

const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export interface ValidationErrors {
    position?: string;
    company?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

export const validatePosition = (value: string): string => {
    if (!value.trim()) return 'El puesto es obligatorio';
    return '';
};

export const validateCompany = (value: string): string => {
    if (!value.trim()) return 'La empresa es obligatoria';
    return '';
};

export const validateDescription = (value: string): string => {
    if (!value.trim()) return 'La descripción es obligatoria';
    return '';
};

export const validateStartDate = (value: string): string => {
    if (!value) return 'La fecha de inicio es obligatoria';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Formato: YYYY-MM-DD';
    const today = getTodayDateString();
    if (value > today) return 'La fecha de inicio no puede ser futura';
    return '';
};

export const validateEndDate = (value: string | null | undefined, isCurrent: boolean): string => {
    if (isCurrent) return '';
    if (!value) return 'La fecha de finalizacion es obligatoria';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Formato: YYYY-MM-DD';
    const today = getTodayDateString();
    if (value > today) return 'La fecha de finalizacion no puede ser futura';
    return '';
};

export const validateForm = (data: {
    position: string;
    company: string;
    description: string;
    startDate: string;
    endDate: string | null | undefined;
    isCurrent: boolean;
}): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    const positionError = validatePosition(data.position);
    if (positionError) errors.position = positionError;
    
    const companyError = validateCompany(data.company);
    if (companyError) errors.company = companyError;
    
    const descriptionError = validateDescription(data.description);
    if (descriptionError) errors.description = descriptionError;
    
    const startDateError = validateStartDate(data.startDate);
    if (startDateError) errors.startDate = startDateError;
    
    const endDateError = validateEndDate(data.endDate, data.isCurrent);
    if (endDateError) errors.endDate = endDateError;
    
    return errors;
};

export const isFormValid = (errors: ValidationErrors): boolean => {
    return Object.keys(errors).length === 0;
};

// ============================================
// HOOK
// ============================================

export const useWorkExperiences = () => {
    const [experiences, setExperiences] = useState<WorkExperience[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const getUsername = (): string | null => {
        return localStorage.getItem('username');
    };

    const loadExperiences = async () => {
        setIsLoading(true);
        setError(null);
        
        const username = getUsername();
        if (!username) {
            setError('Usuario no identificado');
            setIsLoading(false);
            return;
        }

        try {
            const data = await getWorkExperiences(username);
            if (data.success && Array.isArray(data.laboralExperiences)) {
                setExperiences(data.laboralExperiences);
            } else {
                setExperiences([]);
            }
        } catch (err: any) {
            setError(err.message || 'Error al cargar experiencias laborales');
            setExperiences([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadExperiences();
    }, []);

    const addExperience = async (data: CreateWorkExperienceDto): Promise<void> => {
        try {
            await createWorkExperience(data);
            await loadExperiences();
            showSuccess('Experiencia laboral registrada correctamente');
        } catch (err: any) {
            throw err;
        }
    };

    const updateExperience = async (id: number, data: UpdateWorkExperienceDto): Promise<void> => {
        try {
            await updateWorkExperience(id, data);
            await loadExperiences();
            showSuccess('Experiencia laboral modificada correctamente');
        } catch (err: any) {
            throw err;
        }
    };

    const deleteExperience = async (id: number): Promise<void> => {
        try {
            await deleteWorkExperience(id);
            await loadExperiences();
            showSuccess('Experiencia laboral eliminada correctamente');
        } catch (err: any) {
            throw err;
        }
    };

    return {
        experiences,
        isLoading,
        error,
        successMessage,
        addExperience,
        updateExperience,
        deleteExperience,
        reloadExperiences: loadExperiences,
        validatePosition,
        validateCompany,
        validateDescription,
        validateStartDate,
        validateEndDate,
        validateForm,
        isFormValid,
    };
};