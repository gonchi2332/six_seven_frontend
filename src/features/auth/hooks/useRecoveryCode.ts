import { useState } from "react";
import { requestRecoveryCode, verifyRecoveryCode } from "../services/recoveryCodeService";
import { useNavigate } from "react-router-dom";


interface UseSendRecoveryCodeParams {
    username: string;
    onSubmit?: (username: string, email: string) => void;
    onCancel?: () => void;
}

export const useSendRecoveryCode = ({ username, onSubmit, onCancel }: UseSendRecoveryCodeParams) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const navigate = useNavigate();



    const handleSend = async (): Promise<{ success: boolean; email: string | null }> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await requestRecoveryCode({ username });
            const recoveryEmail = data.verificationMails[0];
            setEmail(recoveryEmail);
            return { success: true, email: recoveryEmail };
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al enviar el código");
            return { success: false, email: null };
        } finally {
            setIsLoading(false);
        }
    };


    const handleSubmit = async () => {
        const { success, email: mail } = await handleSend();
        if (success) {
            onSubmit?.(username, mail ?? "");

        }
    };
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate("/login");
        }
    };



    return { isLoading, email, error, handleSend, handleSubmit, handleCancel };
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

    const title = error ? "Código inválido" : "Recuperación de Contraseña";
    const description = error
        ? error
        : "Ingresa el código de recuperación enviado a tu correo";

    return { isLoading, error, title, description, handleSubmit, resetError };
};

