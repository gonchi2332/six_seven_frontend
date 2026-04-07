import { useState } from 'react';
import type { RegisterFormData, RegisterFormErrors, RegisterFormTouched } from '../types/auth.types';

export const useRegisterForm = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        mail: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState<RegisterFormErrors>({
        mail: "",
        password: "",
        confirmPassword: ""
    });

    const [touched, setTouched] = useState<RegisterFormTouched>({
        mail: false,
        password: false,
        confirmPassword: false
    });

    const [isLoading, setIsLoading] = useState(false);

    // Validaciones
    const validateMail = (mail: string): string => {
        if (!mail) return "El correo es requerido";
        const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!mailRegex.test(mail)) return "El correo no es válido";
        return "";
    };

    const validatePassword = (password: string): string => {
        if (!password) return "La contraseña es requerida";
        if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres";
        return "";
    };

    const validateConfirmPassword = (password: string, confirm: string): string => {
        if (!confirm) return "La confirmación de contraseña es requerida";
        if (password !== confirm) return "Las contraseñas no coinciden";
        return "";
    };

    // Handlers
    const handleMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, mail: value }));
        if (touched.mail) {
            const error = validateMail(value);
            setErrors(prev => ({ ...prev, mail: error }));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, password: value }));
        if (touched.password) {
            const error = validatePassword(value);
            setErrors(prev => ({ ...prev, password: error }));
        }
        if (touched.confirmPassword && formData.confirmPassword) {
            const confirmError = validateConfirmPassword(value, formData.confirmPassword);
            setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, confirmPassword: value }));
        if (touched.confirmPassword) {
            const error = validateConfirmPassword(formData.password, value);
            setErrors(prev => ({ ...prev, confirmPassword: error }));
        }
    };

    const handleMailBlur = () => {
        if (!touched.mail) {
            setTouched(prev => ({ ...prev, mail: true }));
            const error = validateMail(formData.mail);
            setErrors(prev => ({ ...prev, mail: error }));
        }
    };

    const handlePasswordBlur = () => {
        if (!touched.password) {
            setTouched(prev => ({ ...prev, password: true }));
            const error = validatePassword(formData.password);
            setErrors(prev => ({ ...prev, password: error }));
        }
    };

    const handleConfirmPasswordBlur = () => {
        if (!touched.confirmPassword) {
            setTouched(prev => ({ ...prev, confirmPassword: true }));
            const error = validateConfirmPassword(formData.password, formData.confirmPassword);
            setErrors(prev => ({ ...prev, confirmPassword: error }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ mail: true, password: true, confirmPassword: true });
        
        const mailError = validateMail(formData.mail);
        const passwordError = validatePassword(formData.password);
        const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);

        setErrors({
            mail: mailError,
            password: passwordError,
            confirmPassword: confirmPasswordError
        });

        if (mailError || passwordError || confirmPasswordError) return;
        
        setIsLoading(true);
        // Aquí va la llamada al backend cuando esté lista
        console.log("Formulario válido", { email: formData.mail, password: formData.password });
    };

    return {
        formData,
        errors,
        touched,
        isLoading,
        handleMailChange,
        handlePasswordChange,
        handleConfirmPasswordChange,
        handleMailBlur,
        handlePasswordBlur,
        handleConfirmPasswordBlur,
        handleSubmit
    };
};