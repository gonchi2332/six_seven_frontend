import { useState } from "react";
import { resetPassword } from "../services/recoveryCodeService";

/*
  Características:
  -Hook personalizado que maneja el reseteo de contraseña
  -Llama al servicio resetPassword para cambiar la contraseña usando username, nueva contraseña y código de verificación
  -Maneja estado de carga (isLoading) y errores (error)
  -Retorna true si el reseteo fue exitoso, false si hubo error

  @ Ejemplo:
  const { isLoading, error, handleResetPassword } = useResetPassword();
  const success = await handleResetPassword("juanperez", "nuevaPass123", "12345678");
  if (success) {
    navigate("/login");
  }
*/
export const useResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleResetPassword = async (username: string, newPassword: string, code: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await resetPassword({ username, newPassword, code });
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cambiar la contraseña");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        handleResetPassword,
    };
};