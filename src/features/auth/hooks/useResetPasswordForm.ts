import { useState } from "react";
import { useResetPassword } from "./useResetPassword";

/*
  Tipo que define el resultado de la validación del formulario:
  -isValid: Indica si todos los campos son válidos
  -passwordError: Mensaje de error para el campo contraseña (opcional)
  -confirmError: Mensaje de error para el campo confirmar contraseña (opcional)
*/
interface ValidationResult {
    isValid: boolean;
    passwordError?: string;
    confirmError?: string;
}

/*
  Props del hook useResetPasswordForm:
  -username: Nombre de usuario que está reseteando la contraseña
  -code: Código de verificación obtenido del paso anterior
  -onSuccess: Función ejecutada cuando el reseteo es exitoso
*/
interface UseResetPasswordFormProps {
    username?: string;
    code?: string;
    onSuccess?: () => void;
}

/*
  Características:
  -Hook personalizado que gestiona el formulario de reseteo de contraseña
  -Maneja dos campos: nueva contraseña y confirmar contraseña
  -Validaciones: contraseña requerida, mínimo 8 caracteres, confirmación requerida, coincidencia de contraseñas
  -Muestra/oculta contraseña con toggle (showPassword/showConfirmPassword)
  -Integra useResetPassword para la llamada a la API
  -Si el reseteo es exitoso, ejecuta onSuccess

  @ Ejemplo:
  const {
    password, confirmPassword,
    validation, isLoading, error,
    updatePassword, updateConfirmPassword,
    handleSave
  } = useResetPasswordForm({
    username: "juanperez",
    code: "12345678",
    onSuccess: () => navigate("/login")
  });
*/
export const useResetPasswordForm = ({ username, code, onSuccess }: UseResetPasswordFormProps) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { isLoading, error, handleResetPassword } = useResetPassword();

    const validateForm = (): ValidationResult => {
        if (!password) {
            return { isValid: false, passwordError: "La contraseña es requerida" };
        }

        if (password.length < 8) {
            return { isValid: false, passwordError: "La contraseña debe tener mínimo 8 caracteres" };
        }

        if (!confirmPassword) {
            return { isValid: false, confirmError: "Debes confirmar tu contraseña" };
        }

        if (password !== confirmPassword) {
            return { isValid: false, confirmError: "Las contraseñas no coinciden" };
        }

        return { isValid: true };
    };

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

    const updatePassword = (value: string) => {
        setPassword(value);
    };

    const updateConfirmPassword = (value: string) => {
        setConfirmPassword(value);
    };

    const toggleShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(prev => !prev);
    };

    const resetForm = () => {
        setPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    return {
        password,
        confirmPassword,
        showPassword,
        showConfirmPassword,
        validation,
        isLoading,
        error,
        updatePassword,
        updateConfirmPassword,
        toggleShowPassword,
        toggleShowConfirmPassword,
        handleSave,
        resetForm,
    };
};