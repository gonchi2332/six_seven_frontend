import { useState, useEffect } from "react";
import { useVerifyCode } from "./useVerifyCode";
import { useSendVerificationCode } from "./useSendVerificationCode";
import { useSendRecoveryCode, useVerifyRecoveryCode } from "./useRecoveryCode";

/*
  Props del hook useVerification:
  -username: Nombre del usuario que se está verificando
  -email: Correo electrónico del usuario (para enviar código)
  -mode: Modo de uso - "verify" (registro) o "recovery" (recuperación)
  -token: Token JWT opcional (necesario para modo verify)
  -onSuccess: Función ejecutada cuando la verificación es exitosa, recibe el código
*/
interface UseVerificationProps {
    username: string;
    email?: string;
    mode: "verify" | "recovery";
    token?: string;
    onSuccess?: (code: string) => void;
}

/*
  Valor retornado por el hook:
  -code: Código de verificación ingresado (8 dígitos)
  -isComplete: Indica si el código tiene exactamente 8 dígitos
  -isLoading: Estado de carga durante verificación o reenvío
  -error: Mensaje de error si la verificación falla
  -resent: Indica si se acaba de reenviar el código (feedback visual)
  -title: Título dinámico del popup (normal o "Código inválido")
  -description: Descripción dinámica según estado
  -updateCode: Función para actualizar el código
  -handleSubmit: Función para verificar el código
  -handleResend: Función para reenviar el código
  -resetError: Función para limpiar el error
*/
interface UseVerificationReturn {
    code: string;
    isComplete: boolean;
    isLoading: boolean;
    error: string | null;
    resent: boolean;
    title: string;
    description: string;

    updateCode: (code: string) => void;
    handleSubmit: () => Promise<void>;
    handleResend: () => Promise<void>;
    resetError: () => void;
}

/*
  Características:
  -Hook orquestador que unifica la verificación para modo verify y modo recovery
  -En modo "verify": usa useVerifyCode y useSendVerificationCode
  -En modo "recovery": usa useVerifyRecoveryCode y useSendRecoveryCode
  -Maneja código de 8 dígitos (isComplete cuando length === 8)
  -Al hacer submit: si hay error, limpia y permite reintentar
  -Al hacer resend: limpia error y código, o reenvía nuevo código
  -Cuando se reenvía código, muestra feedback "resent" por 4 segundos
  -Si hay error y el usuario escribe, se limpia automáticamente el error

  @ Ejemplo modo recovery:
  const verification = useVerification({
    username: "juanperez",
    email: "juan@mail.com",
    mode: "recovery",
    onSuccess: (code) => handleCodeVerified(code)
  });

  @ Ejemplo modo verify:
  const verification = useVerification({
    username: "juanperez",
    email: "juan@mail.com",
    mode: "verify",
    token: "jwt_token",
    onSuccess: (code) => navigate("/info-personal")
  });
*/
export const useVerification = ({
    username,
    email,
    mode,
    token,
    onSuccess
}: UseVerificationProps): UseVerificationReturn => {
    const [code, setCode] = useState("");
    const [resent, setResent] = useState(false);
    const isComplete = code.length === 8;

    const verifyHook = useVerifyCode({ username, code, token: token ?? "" });
    const recoveryHook = useVerifyRecoveryCode({ username, code });
    const activeVerifyHook = mode === "recovery" ? recoveryHook : verifyHook;

    const sendVerifyHook = useSendVerificationCode({ username, mail: email ?? "", token: token ?? "" });
    const sendRecoveryHook = useSendRecoveryCode({ username });
    const activeSendHook = mode === "recovery" ? sendRecoveryHook : sendVerifyHook;

    const { error, isLoading, title, description, handleSubmit: originalSubmit, resetError } = activeVerifyHook;
    const { handleSend } = activeSendHook;

    const handleResend = async () => {
        if (error) {
            resetError();
            setCode("");
        } else {
            await handleSend();
            setResent(true);
            setTimeout(() => setResent(false), 4000);
        }
    };

    const handleSubmit = async () => {
        if (!isComplete && !error) return;

        if (error) {
            resetError();
            setCode("");
            return;
        }

        const success = await originalSubmit();
        if (success) {
            onSuccess?.(code);
        } else {
            setCode("");
        }
    };

    useEffect(() => {
        if (error && code.length > 0) {
            resetError();
        }
    }, [code, error, resetError]);

    return {
        code,
        isComplete,
        isLoading,
        error: error || null,
        resent,
        title,
        description,
        updateCode: setCode,
        handleSubmit,
        handleResend,
        resetError,
    };
};