import { useState, useEffect } from "react";
import { useVerifyCode } from "./useVerifyCode";
import { useSendVerificationCode } from "./useSendVerificationCode";
import { useSendRecoveryCode, useVerifyRecoveryCode } from "./useRecoveryCode";

interface UseVerificationProps {
    username: string;
    email?: string;
    mode: "verify" | "recovery";
    token?: string;
    onSuccess?: (code: string) => void;
}

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
