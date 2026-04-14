
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verify } from "../../../services/verificationCodeService";

interface UseVerifyRecoveryCodeParams {
    username: string;
    token?: string | null;
    onSuccess?: () => void;
}

export const useVerifyRecoveryCode = ({ username, token, onSuccess }: UseVerifyRecoveryCodeParams) => {
    const navigate = useNavigate();
    const [code, setCode] = useState<string[]>(Array(8).fill(""));
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const joinedCode = code.join("");
    const isComplete = joinedCode.length === 8;

    const handleSubmit = async () => {
        if (!isComplete) return;

        if (error) {
            setError(false);
            setCode(Array(8).fill(""));
            return;
        }

        setIsLoading(true);

        try {
            const data = await verify({ username, code: joinedCode, token });
            if (data.success) {
                onSuccess?.();
                navigate("/reset-password");
            } else {
                setError(true);
                setCode(Array(8).fill(""));
            }
        } catch {
            setError(true);
            setCode(Array(8).fill(""));
        } finally {
            setIsLoading(false);
        }
    };

    const title = error ? "Código inválido" : "Recuperación de contraseña";
    const description = error
        ? "El código ingresado no es válido o ha expirado."
        : "Ingresa el código de recuperación enviado a tu correo";

    return {
        code,
        setCode,
        error,
        isLoading,
        isComplete,
        title,
        description,
        handleSubmit,
    };
};
