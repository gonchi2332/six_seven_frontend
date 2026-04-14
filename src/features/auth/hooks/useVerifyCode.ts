
import { useState } from "react";
import { verify } from "../../../services/verificationCodeService";
import { useAuthContext } from "../../../context/AuthContext";

interface UseVerifyCodeParams {
    username: string;
    code: string;
    token: string | null;
}

export const useVerifyCode = ({ username, code, token }: UseVerifyCodeParams) => {
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthContext();

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const data = await verify({ username, code, token });
            // Let's assume it succeeds if it didn't throw and there's a token or success is true
            if (data.success !== false) {
                if (data.token) {
                    login(data.token);
                }
                return true;
            } else {
                setError(true);
                return false;
            }
        } catch {
            setError(true);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const resetError = () => setError(false);

    const title = error ? "Código inválido" : "Verificación de cuenta";
    const description = error
        ? "El código ingresado no es válido o ha expirado."
        : "Ingresa el código de verificación enviado a tu correo";

    return {
        error,
        isLoading,
        title,
        description,
        handleSubmit,
        resetError
    };
};
