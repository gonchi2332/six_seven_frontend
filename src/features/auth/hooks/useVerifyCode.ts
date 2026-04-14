
import { useState } from "react";
import { verify } from "../../../services/verificationCodeService";
import { useAuthContext } from "../../../context/AuthContext";

interface UseVerifyCodeParams {
    username: string;
    code: string;
    token: string | null;
}

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
                    login(data.token);
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

    const title = error ? "Código inválido" : "Verificación de cuenta";
    const description = error
        ? error
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
