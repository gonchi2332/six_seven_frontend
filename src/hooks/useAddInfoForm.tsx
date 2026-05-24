import { useState } from 'react';

type AvailableField = 'secondSurname' | 'city' | 'email' | 'phone' | 'country';

interface UseAddInfoFormProps {
    onAdd: (field: AvailableField, value: string) => Promise<void>;
    onClose: () => void;
}

// Validaciones
const validateSecondSurname = (value: string): string | null => {
    if (!value.trim()) return 'El segundo apellido no puede estar vacio';
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
    if (!regex.test(value)) return 'Solo se permiten letras y espacios';
    if (value.length > 50) return 'Máximo 50 caracteres';
    return null;
};

const validateCity = (value: string): string | null => {
    if (!value.trim()) return 'La ciudad no puede estar vacia';
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
    if (!regex.test(value)) return 'Solo se permiten letras y espacios';
    if (value.length > 50) return 'Máximo 50 caracteres';
    return null;
};

const validateEmail = (value: string): string | null => {
    if (!value.trim()) return 'El correo de contacto no puede estar vacio';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) return 'Formato de correo de contacto inválido';
    if (value.length > 50) return 'Máximo 50 caracteres';
    return null;
};

const validatePhone = (value: string): string | null => {
    if (!value.trim()) return 'El teléfono no puede estar vacio';
    const regex = /^[\+\d\s]+$/;
    if (!regex.test(value)) return 'Solo se permiten números, espacios y el signo +';
    if (value.length > 20) return 'Máximo 20 caracteres';
    return null;
};

const validateCountry = (value: string): string | null => {
    if (!value.trim()) return 'El país no puede estar vacio';
    if (value.length > 50) return 'Máximo 50 caracteres';
    return null;
};

export const useAddInfoForm = ({ onAdd, onClose }: UseAddInfoFormProps) => {
    const [selectedField, setSelectedField] = useState<AvailableField | ''>('');
    const [value, setValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldError, setFieldError] = useState<string | null>(null);

    const validateField = (field: AvailableField, val: string): string | null => {
        switch (field) {
            case 'secondSurname':
                return validateSecondSurname(val);
            case 'city':
                return validateCity(val);
            case 'email':
                return validateEmail(val);
            case 'phone':
                return validatePhone(val);
            case 'country':
                return validateCountry(val);
            default:
                return null;
        }
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedField(e.target.value as AvailableField | '');
        setValue('');
        setError(null);
        setFieldError(null);
    };

    const handleValueChange = (newValue: string) => {
        setValue(newValue);
        setFieldError(null);
        setError(null);

        if (selectedField) {
            const validationError = validateField(selectedField as AvailableField, newValue);
            setFieldError(validationError);
        }
    };

    const handleSubmit = async () => {
        if (!selectedField) {
            setError('Selecciona un campo');
            return;
        }

        if (!value.trim()) {
            setError('Completa el valor del campo');
            return;
        }

        // Validar antes de enviar
        const validationError = validateField(selectedField, value);
        if (validationError) {
            setFieldError(validationError);
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            await onAdd(selectedField, value.trim());
            handleReset();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Error al registrar');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setSelectedField('');
        setValue('');
        setError(null);
        setFieldError(null);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const isSubmitDisabled = () => {
        return isSubmitting || !selectedField || !value.trim() || !!fieldError;
    };

    return {
        selectedField,
        value,
        isSubmitting,
        error,
        fieldError,
        handleFieldChange,
        handleValueChange,
        handleSubmit,
        handleClose,
        isSubmitDisabled,
    };
};
