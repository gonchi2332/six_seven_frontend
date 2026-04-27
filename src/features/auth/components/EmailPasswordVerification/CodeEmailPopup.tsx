import { useState } from "react";
import Button from "../../../../components/Button/Button";
import VerificationCodeInput from "../../../../components/VerificationCodeInput/VerificationCodeInput";
import { useVerifyCode } from "../../hooks/useVerifyCode";
import { useSendVerificationCode } from "../../hooks/useSendVerificationCode";
import { useSendRecoveryCode, useVerifyRecoveryCode } from "../../hooks/useRecoveryCode";

import { useAuthContext } from "../../../../context/AuthContext";

const VERIFICATION_CONTAINER = "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6";
const VERIFICATION_CARD = "bg-primary rounded-2xl w-full max-w-sm shadow-2xl py-6 min-h-[540px] flex flex-col";
const VERIFICATION_CONTENT = "flex flex-col items-center px-10 gap-3";
const VERIFICATION_ICON_WRAPPER = "w-20 h-20 flex items-center justify-center bg-black rounded-full shadow-lg border border-white/10";
const VERIFICATION_TITLE = "text-[24px] md:text-3xl font-inter font-bold text-surface text-center max-w-[240px]";
const VERIFICATION_DESCRIPTION = "text-[18px] font-nunito font-normal text-surface text-center max-w-[260px] leading-relaxed";
const VERIFICATION_LABEL = "text-[18px] md:text-[24px] text-surface font-nunito";
const VERIFICATION_CODE_WRAPPER = "mb-1 flex flex-col items-center w-full";
const VERIFICATION_ERROR_BOX = "bg-white/10 border-l-4 border-red-400 rounded-lg p-5 flex items-center gap-2 text-surface text-sm";
const VERIFICATION_BUTTONS_WRAPPER = "flex flex-col items-center gap-3 w-[260px] mx-auto mt-auto pt-4";
const CODE_HINT = "text-red-300 text-sm mt-1 mb-4 text-center w-full";
const ICON_ERROR = "fa-solid fa-circle-exclamation text-white text-5xl";
const ICON_SUCCESS = "fa-solid fa-shield text-[#90DDF0] text-5xl";
const ICON_INFO = "fa-solid fa-circle-info";

interface Props {
    username: string;
    email: string;
    mode: "verify" | "recovery";
    onSuccess?: (code: string) => void;
}

const VerificationPopup = ({ username, email, mode, onSuccess }: Props) => {

    const {
        token
    } = useAuthContext();

    const [code, setCode] = useState("");
    const isComplete = code.length === 8;

    const verifyHooks = useVerifyCode({ username, code, token });
    const recoveryHooks = useVerifyRecoveryCode({ username, code });
    const activeVerifyHook = mode === "recovery" ? recoveryHooks : verifyHooks;

    const sendVerifyHooks = useSendVerificationCode({ username, mail: email, token });
    const sendRecoveryHooks = useSendRecoveryCode({ username, email });
    const activeSendHook = mode === "recovery" ? sendRecoveryHooks : sendVerifyHooks;

    const { handleSend } = activeSendHook;

    const {
        error,
        isLoading,
        title,
        description,
        handleSubmit,
        resetError
    } = activeVerifyHook;

    const handleAction = async () => {
        if (!isComplete && !error) return;

        if (error) {
            resetError();
            setCode("");
            return;
        }

        const success = await handleSubmit();
        if (success) {
            onSuccess?.(code);
        } else {
            setCode("");
        }
    };

    const handleResend = () => {
        handleSend();
    };


    return (
        <div className={VERIFICATION_CONTAINER}>
            <div className={VERIFICATION_CARD}>
                <div className={VERIFICATION_CONTENT}>
                    <div className={VERIFICATION_ICON_WRAPPER}>
                        {error ? (
                            <i className={ICON_ERROR}></i>
                        ) : (
                            <i className={ICON_SUCCESS}></i>
                        )}
                    </div>

                    <h2 className={VERIFICATION_TITLE}>
                        {title}
                    </h2>

                    <p className={VERIFICATION_DESCRIPTION}>
                        {description}
                    </p>

                    {!error ? (
                        <>
                            <span className={VERIFICATION_LABEL}>
                                Ingresar Código
                            </span>

                            <div className={VERIFICATION_CODE_WRAPPER}>
                                <VerificationCodeInput
                                    value={code}
                                    onChange={setCode}
                                    error={!!error}
                                />

                                {!isComplete && (
                                    <p className={CODE_HINT}>
                                        El código debe tener 8 dígitos
                                    </p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className={VERIFICATION_ERROR_BOX}>
                            <i className={ICON_INFO}></i>
                            <span>
                                Por favor revisa que el código sea válido.
                            </span>
                        </div>
                    )}
                </div>

                <div className={VERIFICATION_BUTTONS_WRAPPER}>
                    <Button
                        variant="secondary"
                        onClick={handleAction}
                        fullWidth
                        disabled={isLoading || (!isComplete && !error)}
                    >
                        {isLoading ? "Verificando..." : error ? "Reintentar" : "Verificar"}
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleResend}
                        fullWidth
                        disabled={isLoading}
                    >
                        {error ? "Contactar Soporte" : "Reenviar Código"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VerificationPopup;
