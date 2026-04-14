
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendVerificationCode } from "../../../services/verificationCodeService";

interface UseSendVerificationCodeParams {
    username: string;
    mail: string;
    token?: string | null;
}

export const useSendVerificationCode = ({ username, mail, token }: UseSendVerificationCodeParams) => {
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        setError(false);
        setIsLoading(true);

        try {
            const data = await sendVerificationCode({ username, targetMail: mail, token });
            if (data.success) {
                navigate("/verification");
            } else {
                setError(true);
            }
        } catch {
            setError(true);
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
