
import { useState } from "react";
import { sendVerificationCode } from "../../../services/verificationCodeService";

interface UseSendVerificationCodeParams {
    username: string;
    mail: string;
    token?: string | null;
}

export const useSendVerificationCode = ({ username, mail, token }: UseSendVerificationCodeParams) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async (): Promise<boolean> => {
        setError(null);
        setIsLoading(true);

        try {
            const data = await sendVerificationCode({ username, targetMail: mail, token });
            if (data.success) {
                return true;
            } else {
                setError(data.message ?? "Error al enviar el código");
                return false;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al enviar el código");
            return false;
        } finally {
            setIsLoading(false);
        }
    };


    return {
        error,
        isLoading,
        handleSend,
    };
};
