import { useState, useRef } from "react";

/*
  Estructura del formulario de información personal:
  -is_new: Indica si es un usuario nuevo (para el backend)
  -firstName: Nombre(s) del usuario (obligatorio)
  -firstSurname: Primer apellido (obligatorio)
  -secondSurname: Segundo apellido (opcional)
  -city: Ciudad de residencia (opcional)
  -email: Correo de contacto (opcional)
  -phone: Número de teléfono (opcional)
  -country: País de residencia (opcional)
  -profileImage: Archivo de imagen de perfil
  -profileImageUrl: URL de la imagen de perfil (para previsualización)
*/
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

/*
  Características:
  -Hook personalizado que gestiona el formulario de información personal
  -Maneja estado del formulario (formData), errores de validación (errors)
  -Registra qué campos existían originalmente (fieldsThatExisted) para validar que no queden vacíos
  -Validaciones:
    - Campos existentes no pueden quedar vacíos
    - Nombres/apellidos: solo letras y espacios
    - Email: formato válido (usuario@dominio.com)
    - Teléfono: números, espacios y signo +
  -setInitialData: Carga datos iniciales y registra qué campos existían
  -restoreOriginalData: Restaura los datos originales (para cancelar)
  -shouldShowField: Determina si un campo debe mostrarse (siempre firstName/firstSurname, otros solo si existían)

  @ Ejemplo:
  const {
    formData, errors, handleChange, validateForm,
    setInitialData, restoreOriginalData, isFormComplete, shouldShowField
  } = useProfileForm();
*/
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
    const [fieldsThatExisted, setFieldsThatExisted] = useState<Set<keyof FormData>>(new Set());

    /*
      Carga los datos iniciales del usuario
      -Registra qué campos tenían valor al cargar (fieldsThatExisted)
      -Guarda copia de los datos originales para poder restaurarlos
    */
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

    // Restaura los datos originales (para cancelar edición)
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

    /*
      Maneja cambios en cualquier campo del formulario
      -Actualiza el valor en formData
      -Ejecuta validaciones según el tipo de campo:
        * Campos existentes: validación de no vacío
        * Nombres/apellidos: solo letras y espacios
        * Email: formato válido
        * Teléfono: números, espacios y signo +
    */
    const handleChange = (field: keyof FormData, value: string | File | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        
        const newErrors = { ...errors };
        
        // Validación de campo vacío (solo para campos existentes y string)
        if (typeof value === "string") {
            const emptyError = validateNotEmpty(field, value);
            if (emptyError) {
                newErrors[field] = emptyError;
            } else {
                delete newErrors[field];
            }
        }
        
        // Validaciones de formato existentes
        if (typeof value === "string") {
            if (["firstName", "firstSurname", "secondSurname"].includes(field)) {
                const spanishLettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/;
                if (!spanishLettersRegex.test(value) && !newErrors[field]) {
                    newErrors[field] = "Solo se permiten letras y espacios";
                } else if (spanishLettersRegex.test(value) && newErrors[field] === "Solo se permiten letras y espacios") {
                    delete newErrors[field];
                }
            }
            if (field === "email") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value.length > 0 && !emailRegex.test(value) && !newErrors[field]) {
                    newErrors[field] = "Formato de correo inválido (ej: usuario@correo.com)";
                } else if (emailRegex.test(value) && newErrors[field] === "Formato de correo inválido (ej: usuario@correo.com)") {
                    delete newErrors[field];
                }
            }
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

    // Valida todos los campos existentes del formulario
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

    // Verifica si el formulario está completo y sin errores
    const isFormComplete = (): boolean => {
        if (!formData.firstName?.trim() || !formData.firstSurname?.trim()) {
            return false;
        }
        
        if (Object.keys(errors).length > 0) {
            return false;
        }
        
        let hasEmptyField = false;
        fieldsThatExisted.forEach((field) => {
            const value = formData[field];
            if (typeof value === 'string' && (!value || value.trim() === '')) {
                hasEmptyField = true;
            }
        });
        
        return !hasEmptyField;
    };

    // Determina si un campo debe mostrarse (firstName y firstSurname siempre, otros solo si existían)
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