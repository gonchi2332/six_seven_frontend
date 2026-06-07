import { useState } from "react";
import { verify } from "../services/verificationCodeService";
import { useAuthContext } from "../../../context/AuthContext";

interface UseVerifyCodeParams {
    username: string;
    code: string;
    token: string | null;
}

// Hook para verificar el código de activación de cuenta
export const useVerifyCode = ({ username, code, token }: UseVerifyCodeParams) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthContext();

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const data = await verify({ username, code, token });
            if (data.success !== false) {
                if (data.token) {
                    login(data.token); // Actualiza el token si el backend devuelve uno nuevo
                }
                return true;
            } else {
                setError(data.message ?? "Código inválido");
                return false;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Código inválido");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const resetError = () => setError(null);

    // Título y descripción dinámicos según estado de error
    const title = error ? "Código inválido" : "Verificación de cuenta";
    const description = error
        ? error
        : "Ingresa el código de verificación enviado a tu correo";

    return { error, isLoading, title, description, handleSubmit, resetError };
};