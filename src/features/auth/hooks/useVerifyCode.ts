
import { useState } from "react";
import { verify } from "../../../services/verificationCodeService";

interface UseVerifyCodeParams {
    username: string;
    code: string;
    token: string | null;
}

export const useVerifyCode = ({ username, code, token }: UseVerifyCodeParams) => {
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const data = await verify({ username, code, token });
            if (data.success) {
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
