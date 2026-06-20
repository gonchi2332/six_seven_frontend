import { useState } from "react";
import { useResetPassword } from "./useResetPassword";

interface ValidationResult {
    isValid: boolean;
    passwordError?: string;
    confirmError?: string;
}

interface UseResetPasswordFormProps {
    username?: string;
    code?: string;
    onSuccess?: () => void;
}

// Hook para gestionar el formulario de nueva contraseña con validaciones
export const useResetPasswordForm = ({ username, code, onSuccess }: UseResetPasswordFormProps) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { isLoading, error, handleResetPassword } = useResetPassword();

    const validateForm = (): ValidationResult => {
        if (!password) return { isValid: false, passwordError: "La contraseña es requerida" };
        if (password.length < 8) return { isValid: false, passwordError: "La contraseña debe tener mínimo 8 caracteres" };
        if (!confirmPassword) return { isValid: false, confirmError: "Debes confirmar tu contraseña" };
        if (password !== confirmPassword) return { isValid: false, confirmError: "Las contraseñas no coinciden" };
        return { isValid: true };
    };

    // Se recalcula en cada render para mantener validación reactiva
    const validation = validateForm();

    const handleSave = async () => {
        if (!validation.isValid) return;
        if (!username || !code) {
            console.error("Faltan username o code para resetear la contraseña");
            return;
        }
        const success = await handleResetPassword(username, password, code);
        if (success) {
            onSuccess?.();
        }
    };

    const updatePassword = (value: string) => setPassword(value);
    const updateConfirmPassword = (value: string) => setConfirmPassword(value);
    const toggleShowPassword = () => setShowPassword(prev => !prev);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(prev => !prev);

    const resetForm = () => {
        setPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    return {
        password, confirmPassword, showPassword, showConfirmPassword,
        validation, isLoading, error,
        updatePassword, updateConfirmPassword,
        toggleShowPassword, toggleShowConfirmPassword,
        handleSave, resetForm,
    };
};