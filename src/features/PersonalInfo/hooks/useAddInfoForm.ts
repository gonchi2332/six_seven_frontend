import { useState } from 'react';

/*
  Tipos de campos que se pueden agregar:
  -secondSurname: Segundo apellido
  -city: Ciudad
  -email: Correo de contacto
  -phone: Teléfono
  -country: País
*/
type AvailableField = 'secondSurname' | 'city' | 'email' | 'phone' | 'country';

/*
  Props del hook useAddInfoForm:
  -onAdd: Función para agregar el campo, recibe el campo y el valor
  -onClose: Función ejecutada al cerrar el modal
*/
interface UseAddInfoFormProps {
    onAdd: (field: AvailableField, value: string) => Promise<void>;
    onClose: () => void;
}

// ============================================
// VALIDACIONES POR CAMPO
// ============================================

/*
  Validación para segundo apellido:
  -No puede estar vacío
  -Solo letras y espacios
  -Máximo 50 caracteres
*/
const validateSecondSurname = (value: string): string | null => {
    if (!value.trim()) return 'El segundo apellido no puede estar vacio';
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
    if (!regex.test(value)) return 'Solo se permiten letras y espacios';
    if (value.length > 50) return 'Máximo 50 caracteres';
    return null;
};

/*
  Validación para ciudad:
  -No puede estar vacía
  -Solo letras y espacios
  -Máximo 50 caracteres
*/
const validateCity = (value: string): string | null => {
    if (!value.trim()) return 'La ciudad no puede estar vacia';
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
    if (!regex.test(value)) return 'Solo se permiten letras y espacios';
    if (value.length > 50) return 'Máximo 50 caracteres';
    return null;
};

/*
  Validación para correo de contacto:
  -No puede estar vacío
  -Formato de email válido (nombre@dominio.com)
  -Máximo 50 caracteres
*/
const validateEmail = (value: string): string | null => {
    if (!value.trim()) return 'El correo de contacto no puede estar vacio';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) return 'Formato de correo de contacto inválido';
    if (value.length > 50) return 'Máximo 50 caracteres';
    return null;
};

/*
  Validación para teléfono:
  -No puede estar vacío
  -Permite números, espacios y signo +
  -Máximo 20 caracteres
*/
const validatePhone = (value: string): string | null => {
    if (!value.trim()) return 'El teléfono no puede estar vacio';
    const regex = /^[\+\d\s]+$/;
    if (!regex.test(value)) return 'Solo se permiten números, espacios y el signo +';
    if (value.length > 20) return 'Máximo 20 caracteres';
    return null;
};

/*
  Validación para país:
  -No puede estar vacío
  -Máximo 50 caracteres
*/
const validateCountry = (value: string): string | null => {
    if (!value.trim()) return 'El país no puede estar vacio';
    if (value.length > 50) return 'Máximo 50 caracteres';
    return null;
};

/*
  Características:
  -Hook personalizado que gestiona la lógica del formulario para agregar información personal
  -Maneja selección de campo, valor, validaciones y envío
  -Validaciones específicas por tipo de campo (secondSurname, city, email, phone, country)
  -Campos obligatorios: no pueden estar vacíos
  -Validación en tiempo real al escribir
  -Maneja estado de carga (isSubmitting) y errores (error general, fieldError específico)
  -Botón submit deshabilitado mientras se valida o se envía

  @ Ejemplo:
  const {
    selectedField, value, isSubmitting, error, fieldError,
    handleFieldChange, handleValueChange, handleSubmit, handleClose, isSubmitDisabled
  } = useAddInfoForm({ onAdd, onClose });
*/
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
