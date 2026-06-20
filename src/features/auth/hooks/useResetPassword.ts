import { useState } from "react";
import { resetPassword } from "../services/recoveryCodeService";

// Hook para ejecutar el reseteo de contraseña en el backend
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

    return { isLoading, error, handleResetPassword };
};