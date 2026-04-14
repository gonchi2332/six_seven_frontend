
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestRecoveryCode, verifyRecoveryCode } from "../../../services/recoveryCodeService"

type Step = "request" | "verify";

interface UseForgotPasswordParams {
    username: string;
    email: string;
}

export const useRecoveryCode = ({ username, email }: UseForgotPasswordParams) => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>("request");
    const [code, setCode] = useState<string[]>(Array(8).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const joinedCode = code.join("");
    const isComplete = joinedCode.length === 8;

    const handleRequestCode = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await requestRecoveryCode({ username, email });
            if (data.result) {
                setStep("verify");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al solicitar el código");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!isComplete) return;

        setIsLoading(true);
        setError(null);

        try {
            const data = await verifyRecoveryCode({ username, code: joinedCode });
            if (data.success) {
                navigate("/reset-password");
            } else {
                setError(data.message);
                setCode(Array(8).fill(""));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al verificar el código");
            setCode(Array(8).fill(""));
        } finally {
            setIsLoading(false);
        }
    };

    const title = {
        request: "Recuperar contraseña",
        verify: error ? "Código inválido" : "Verificar código",
    }[step];

    const description = {
        request: error ?? "Ingresa tu usuario y correo para recibir un código de recuperación",
        verify: error ?? "Ingresa el código de recuperación enviado a tu correo",
    }[step];

    return {
        step,
        code,
        setCode,
        isLoading,
        isComplete,
        error,
        title,
        description,
        handleRequestCode,
        handleVerifyCode,
    };
};
