import { useState, useCallback } from 'react';

export interface WorkExperienceFormData {
    position: string;
    company: string;
    description: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
}

export interface WorkExperienceFormErrors {
    position: string;
    company: string;
    description: string;
    startDate: string;
    endDate: string;
}

// Función auxiliar para obtener la fecha de hoy en formato YYYY-MM-DD
const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const useWorkExperienceForm = (initialData?: WorkExperienceFormData) => {
    const [formData, setFormData] = useState<WorkExperienceFormData>({
        position: initialData?.position || '',
        company: initialData?.company || '',
        description: initialData?.description || '',
        startDate: initialData?.startDate || '',
        endDate: initialData?.endDate || '',
        isCurrent: initialData?.isCurrent || false,
    });

    const [errors, setErrors] = useState<WorkExperienceFormErrors>({
        position: '',
        company: '',
        description: '',
        startDate: '',
        endDate: '',
    });

    // ============================================
    // VALIDACIONES
    // ============================================

    const validatePosition = useCallback((value: string): string => {
        if (!value.trim()) return 'El puesto es obligatorio';
        return '';
    }, []);

    const validateCompany = useCallback((value: string): string => {
        if (!value.trim()) return 'La empresa es obligatoria';
        return '';
    }, []);

    const validateDescription = useCallback((value: string): string => {
        if (!value.trim()) return 'La descripción es obligatoria';
        return '';
    }, []);

    const validateStartDate = useCallback((value: string): string => {
        if (!value) return 'La fecha de inicio es obligatoria';
        const today = getTodayDateString();
        if (value > today) return 'La fecha de inicio no puede ser futura';
        return '';
    }, []);

    const validateEndDate = useCallback((value: string, isCurrent: boolean): string => {
        if (!isCurrent && !value) return 'La fecha de fin es obligatoria';
        if (value) {
            const today = getTodayDateString();
            if (value > today) return 'La fecha de fin no puede ser futura';
        }
        return '';
    }, []);

    // ============================================
    // HANDLERS
    // ============================================

    const handlePositionChange = (value: string) => {
        setFormData(prev => ({ ...prev, position: value }));
        setErrors(prev => ({ ...prev, position: validatePosition(value) }));
    };

    const handleCompanyChange = (value: string) => {
        setFormData(prev => ({ ...prev, company: value }));
        setErrors(prev => ({ ...prev, company: validateCompany(value) }));
    };

    const handleDescriptionChange = (value: string) => {
        setFormData(prev => ({ ...prev, description: value }));
        setErrors(prev => ({ ...prev, description: validateDescription(value) }));
    };

    const handleStartDateChange = (value: string) => {
        setFormData(prev => ({ ...prev, startDate: value }));
        setErrors(prev => ({ ...prev, startDate: validateStartDate(value) }));
    };

    const handleEndDateChange = (value: string) => {
        setFormData(prev => ({ ...prev, endDate: value }));
        setErrors(prev => ({ ...prev, endDate: validateEndDate(value, formData.isCurrent) }));
    };

    const handleIsCurrentChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, isCurrent: checked }));
        
        // Si se marca "Trabajo actualmente", limpiar error de endDate
        if (checked) {
            setErrors(prev => ({ ...prev, endDate: '' }));
        } 
        // Si se desmarca, validar endDate si está vacío
        else if (!formData.endDate) {
            setErrors(prev => ({ ...prev, endDate: 'La fecha de fin es obligatoria' }));
        }
    };

    // ============================================
    // UTILIDADES
    // ============================================

    const validateForm = useCallback((): boolean => {
        const positionError = validatePosition(formData.position);
        const companyError = validateCompany(formData.company);
        const descriptionError = validateDescription(formData.description);
        const startDateError = validateStartDate(formData.startDate);
        const endDateError = validateEndDate(formData.endDate, formData.isCurrent);
        
        setErrors({
            position: positionError,
            company: companyError,
            description: descriptionError,
            startDate: startDateError,
            endDate: endDateError,
        });
        
        return !positionError && !companyError && !descriptionError && !startDateError && !endDateError;
    }, [formData, validatePosition, validateCompany, validateDescription, validateStartDate, validateEndDate]);

    const resetForm = useCallback(() => {
        setFormData({
            position: '',
            company: '',
            description: '',
            startDate: '',
            endDate: '',
            isCurrent: false,
        });
        setErrors({
            position: '',
            company: '',
            description: '',
            startDate: '',
            endDate: '',
        });
    }, []);

    const isFormValid = (): boolean => {
        return Object.values(errors).every(e => e === '') &&
               formData.position.trim() !== '' &&
               formData.company.trim() !== '' &&
               formData.description.trim() !== '' &&
               formData.startDate !== '' &&
               (formData.isCurrent || formData.endDate !== '');
    };

    return {
        // Datos
        formData,
        errors,
        // Handlers específicos
        handlePositionChange,
        handleCompanyChange,
        handleDescriptionChange,
        handleStartDateChange,
        handleEndDateChange,
        handleIsCurrentChange,
        // Utilidades
        validateForm,
        resetForm,
        isFormValid,
    };
};