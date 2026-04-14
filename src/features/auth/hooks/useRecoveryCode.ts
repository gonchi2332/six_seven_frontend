import { useState } from "react";
import { requestRecoveryCode, verifyRecoveryCode } from "../../../services/recoveryCodeService";

interface UseSendRecoveryCodeParams {
    username: string;
    email: string;
}

export const useSendRecoveryCode = ({ username, email }: UseSendRecoveryCodeParams) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSend = async (): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            await requestRecoveryCode({ username, email });
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al enviar el código");
            return false;
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
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const data = await verifyRecoveryCode({ username, code });
            if (data.success) {
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

    const title = error ? "Código inválido" : "Recuperación de contraseña";
    const description = error
        ? error
        : "Ingresa el código de recuperación enviado a tu correo";

    return { isLoading, error, title, description, handleSubmit, resetError };
};
