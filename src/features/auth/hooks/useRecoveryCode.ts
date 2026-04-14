import { useState } from "react";
import { requestRecoveryCode, verifyRecoveryCode } from "../../../services/recoveryCodeService";

interface UseSendRecoveryCodeParams {
    username: string;
    email: string;
}

export const useSendRecoveryCode = ({ username, email }: UseSendRecoveryCodeParams) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleSend = async () => {
        setIsLoading(true);
        setError(false);
        try {
            await requestRecoveryCode({ username, email });
        } catch {
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, handleSend };
};

interface UseVerifyRecoveryParams {
    username: string;
    code: string;
}

export const useVerifyRecoveryCode = ({ username, code }: UseVerifyRecoveryParams) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const data = await verifyRecoveryCode({ username, code });
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

    const title = error ? "Código inválido" : "Recuperación de contraseña";
    const description = error
        ? "El código ingresado no es válido o ha expirado."
        : "Ingresa el código de recuperación enviado a tu correo";

    return { isLoading, error, title, description, handleSubmit, resetError };
};
