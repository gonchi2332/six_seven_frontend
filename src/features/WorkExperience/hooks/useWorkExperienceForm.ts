// hooks/useWorkExperienceForm.ts
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

// Obtener la fecha de hoy en formato YYYY-MM-DD
const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Hook para manejar el formulario de experiencia laboral
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

    // Validar campo de puesto
    const validatePosition = useCallback((value: string): string => {
        if (!value.trim()) return 'El puesto es obligatorio';
        return '';
    }, []);

    // Validar campo de empresa
    const validateCompany = useCallback((value: string): string => {
        if (!value.trim()) return 'La empresa es obligatoria';
        return '';
    }, []);

    // Validar campo de descripcion
    const validateDescription = useCallback((value: string): string => {
        if (!value.trim()) return 'La descripción es obligatoria';
        return '';
    }, []);

    // Validar fecha de inicio
    const validateStartDate = useCallback((value: string): string => {
        if (!value) return 'La fecha de inicio es obligatoria';
        const today = getTodayDateString();
        if (value > today) return 'La fecha de inicio no puede ser futura';
        return '';
    }, []);

    // Validar fecha de fin
    const validateEndDate = useCallback((value: string, isCurrent: boolean): string => {
        if (!isCurrent && !value) return 'La fecha de finalización es obligatoria';
        if (value) {
            const today = getTodayDateString();
            if (value > today) return 'La fecha de fin no puede ser futura';
        }
        return '';
    }, []);

    // Manejar cambio de puesto
    const handlePositionChange = (value: string) => {
        setFormData(prev => ({ ...prev, position: value }));
        setErrors(prev => ({ ...prev, position: validatePosition(value) }));
    };

    // Manejar cambio de empresa
    const handleCompanyChange = (value: string) => {
        setFormData(prev => ({ ...prev, company: value }));
        setErrors(prev => ({ ...prev, company: validateCompany(value) }));
    };

    // Manejar cambio de descripcion
    const handleDescriptionChange = (value: string) => {
        setFormData(prev => ({ ...prev, description: value }));
        setErrors(prev => ({ ...prev, description: validateDescription(value) }));
    };

    // Manejar cambio de fecha de inicio
    const handleStartDateChange = (value: string) => {
        setFormData(prev => ({ ...prev, startDate: value }));
        setErrors(prev => ({ ...prev, startDate: validateStartDate(value) }));
    };

    // Manejar cambio de fecha de fin
    const handleEndDateChange = (value: string) => {
        setFormData(prev => ({ ...prev, endDate: value }));
        setErrors(prev => ({ ...prev, endDate: validateEndDate(value, formData.isCurrent) }));
    };

    // Manejar cambio de checkbox "trabajo actualmente"
    const handleIsCurrentChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, isCurrent: checked }));

        // Si se marca "Trabajo actualmente", limpiar error de endDate
        if (checked) {
            setErrors(prev => ({ ...prev, endDate: '' }));
        }
        // Si se desmarca, validar endDate si está vacío
        else if (!formData.endDate) {
            setErrors(prev => ({ ...prev, endDate: 'La fecha de finalizacion es obligatoria' }));
        }
    };

    // Validar todo el formulario
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

    // Resetear formulario a valores iniciales
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

    // Verificar si el formulario es valido para enviar
    const isFormValid = (): boolean => {
        return Object.values(errors).every(e => e === '') &&
            formData.position.trim() !== '' &&
            formData.company.trim() !== '' &&
            formData.description.trim() !== '' &&
            formData.startDate !== '' &&
            (formData.isCurrent || formData.endDate !== '');
    };

    return {
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
    };
};