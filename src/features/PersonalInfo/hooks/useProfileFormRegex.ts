import { useState, useRef } from "react";


export interface FormData {
    is_new: boolean;
    firstName: string;
    firstSurname: string;
    secondSurname?: string;
    city?: string;
    email?: string;
    phone?: string;
    country?: string;
    profileImage: File | null;
    profileImageUrl: string | null;
}

// Hook para manejar el formulario de información personal con validaciones
export const useProfileForm = () => {
    const [formData, setFormData] = useState<FormData>({
        is_new: true,
        firstName: "",
        firstSurname: "",
        secondSurname: "",
        city: "",
        email: "",
        phone: "",
        country: "",
        profileImage: null,
        profileImageUrl: null,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const originalDataRef = useRef<FormData | null>(null);
    // Conjunto de campos que existían originalmente (para saber cuáles mostrar)
    const [fieldsThatExisted, setFieldsThatExisted] = useState<Set<keyof FormData>>(new Set());

    // Cargar datos iniciales y registrar qué campos existían
    const setInitialData = (data: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
        
        const merged = { ...formData, ...data };
        if (!originalDataRef.current) {
            originalDataRef.current = merged;
        }
        
        const existed = new Set<keyof FormData>();
        Object.keys(merged).forEach((key) => {
            const fieldKey = key as keyof FormData;
            const value = merged[fieldKey];
            if (value && typeof value === 'string' && value.trim() !== '') {
                existed.add(fieldKey);
            } else if (value && typeof value !== 'string') {
                existed.add(fieldKey);
            }
        });
        setFieldsThatExisted(existed);
    };

    // Restaurar datos originales (para cancelar edición)
    const restoreOriginalData = () => {
        if (originalDataRef.current) {
            setFormData(originalDataRef.current);
            setErrors({});
        }
    };

    // Validar que un campo existente no esté vacío
    const validateNotEmpty = (field: keyof FormData, value: string | undefined | null): string => {
        if (fieldsThatExisted.has(field)) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                return "Este campo no puede estar vacío";
            }
        }
        return "";
    };

    // Manejar cambios en los campos con validación en tiempo real
    const handleChange = (field: keyof FormData, value: string | File | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        
        const newErrors = { ...errors };
        
        // Validación de campo vacío (solo para campos existentes)
        if (typeof value === "string") {
            const emptyError = validateNotEmpty(field, value);
            if (emptyError) {
                newErrors[field] = emptyError;
            } else {
                delete newErrors[field];
            }
        }
        
        // Validaciones de formato
        if (typeof value === "string") {
            // Nombres: solo letras y espacios
            if (["firstName", "firstSurname", "secondSurname"].includes(field)) {
                const spanishLettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/;
                if (!spanishLettersRegex.test(value) && !newErrors[field]) {
                    newErrors[field] = "Solo se permiten letras y espacios";
                } else if (spanishLettersRegex.test(value) && newErrors[field] === "Solo se permiten letras y espacios") {
                    delete newErrors[field];
                }
            }
            // Email: formato válido
            if (field === "email") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value.length > 0 && !emailRegex.test(value) && !newErrors[field]) {
                    newErrors[field] = "Formato de correo inválido (ej: usuario@correo.com)";
                } else if (emailRegex.test(value) && newErrors[field] === "Formato de correo inválido (ej: usuario@correo.com)") {
                    delete newErrors[field];
                }
            }
            // Teléfono: números, espacios y +
            if (field === "phone") {
                const phoneRegex = /^[\+]?[0-9\s]*$/;
                if (!phoneRegex.test(value) && !newErrors[field]) {
                    newErrors[field] = "Solo se permiten números, espacios y el signo +";
                } else if (phoneRegex.test(value) && newErrors[field] === "Solo se permiten números, espacios y el signo +") {
                    delete newErrors[field];
                }
            }
        }
        
        setErrors(newErrors);
    };

    // Validar todo el formulario antes de enviar
    const validateForm = () => {
        const newErrors = { ...errors };
        
        fieldsThatExisted.forEach((field) => {
            const value = formData[field];
            if (typeof value === 'string') {
                const emptyError = validateNotEmpty(field, value);
                if (emptyError) {
                    newErrors[field] = emptyError;
                }
            }
        });
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Verificar si el formulario está completo y sin errores
    const isFormComplete = (): boolean => {
        // Campos obligatorios siempre
        if (!formData.firstName?.trim() || !formData.firstSurname?.trim()) {
            return false;
        }
        
        // No debe haber errores
        if (Object.keys(errors).length > 0) {
            return false;
        }
        
        // Campos existentes no deben estar vacíos
        let hasEmptyField = false;
        fieldsThatExisted.forEach((field) => {
            const value = formData[field];
            if (typeof value === 'string' && (!value || value.trim() === '')) {
                hasEmptyField = true;
            }
        });
        
        return !hasEmptyField;
    };

    // Determinar si un campo debe mostrarse (firstName y firstSurname siempre, otros solo si existían)
    const shouldShowField = (field: keyof FormData): boolean => {
        if (field === 'firstName' || field === 'firstSurname') return true;
        return fieldsThatExisted.has(field);
    };

    return { 
        formData, 
        errors, 
        handleChange, 
        validateForm, 
        setInitialData,
        restoreOriginalData,
        isFormComplete,
        shouldShowField,
    };
};