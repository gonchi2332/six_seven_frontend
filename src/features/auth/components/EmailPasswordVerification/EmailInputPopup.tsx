import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/Button/Button";
import { useSendRecoveryCode } from "../../hooks/useRecoveryCode";

const CONTAINER = "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6";
const CARD = "bg-primary rounded-2xl w-full max-w-md shadow-2xl py-5 flex flex-col items-center px-8";
const ICON_WRAPPER = "w-20 h-20 flex items-center justify-center bg-black rounded-full shadow-lg border border-white/10 mb-3";
const TITLE = "text-[22px] md:text-2xl font-inter font-bold text-surface text-center max-w-[320px] mb-2";
const DESCRIPTION = "text-[16px] font-nunito font-normal text-surface text-center max-w-[300px] leading-relaxed mb-4";
const ERROR = "text-red-300 drop-shadow-sm text-xs mb-1 text-center";
const BUTTONS_WRAPPER = "flex flex-col items-center gap-2 w-[240px] mx-auto mt-4";
const ICON = "fa-regular fa-user text-white text-5xl";
const INPUT_WRAPPER = "w-[280px]";
const LABEL = "text-[16px] font-inter font-normal text-surface mb-1.5 block text-left";
const INPUT = "w-full bg-black rounded-lg px-3 py-2.5 text-[#FFFFFF] placeholder:text-white/40 outline-none mb-1 text-[15px]";
const EMAIL_HINT = "text-surface text-base font-nunito text-center mt-1 mb-2";

const censorEmail = (email: string): string => {
    const [local, domain] = email.split("@");
    if (!local || !domain) return email;
    const visible = local.slice(0, 4);
    const censored = "*".repeat(4);
    return `${visible}${censored}@${domain}`;
};

interface Props {
    onSubmit?: (username: string, email: string) => void;
    onCancel?: () => void;
}

const EmailInputPopup = ({ onSubmit, onCancel }: Props) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    const { handleSend, email, error, isLoading } = useSendRecoveryCode({ username });

    const handleSubmit = async () => {
        const success = await handleSend();
        if (success) {
            onSubmit?.(username, email ?? "");
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate("/login");
        }
    };

    return (
        <div className={CONTAINER}>
            <div className={CARD}>
                <div className={ICON_WRAPPER}>
                    <i className={ICON}></i>
                </div>

                <h2 className={TITLE}>
                    Recuperación de cuenta
                </h2>

                <p className={DESCRIPTION}>
                    Ingresa tu nombre de usuario para recuperar tu cuenta
                </p>

                <div className={INPUT_WRAPPER}>
                    <label className={LABEL}>
                        Nombre de usuario
                    </label>
                    <input
                        type="text"
                        placeholder="Tu nombre de usuario"
                        className={INPUT}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                {email && (
                    <p className={EMAIL_HINT}>
                        Se enviará un código a: {censorEmail(email)}
                    </p>
                )}

                {error && (
                    <p className={ERROR}>{error}</p>
                )}

                <div className={BUTTONS_WRAPPER}>
                    <Button
                        variant="secondary"
                        onClick={handleSubmit}
                        fullWidth
                        disabled={isLoading}
                    >
                        {isLoading ? "Enviando..." : "Enviar"}
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleCancel}
                        fullWidth
                    >
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EmailInputPopup;