import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/Button/Button";


import { useSendVerificationCode } from "../../hooks/useSendVerificationCode";
import { useSendRecoveryCode } from "../../hooks/useRecoveryCode";
import { useAuthContext } from "../../../../context/AuthContext";





const EMAIL_CONTAINER = "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6";
const EMAIL_CARD = "bg-primary rounded-2xl w-full max-w-md shadow-2xl py-5 flex flex-col items-center px-8";
const EMAIL_ICON_WRAPPER = "w-20 h-20 flex items-center justify-center bg-black rounded-full shadow-lg border border-white/10 mb-3";
const EMAIL_TITLE = "text-[22px] md:text-2xl font-inter font-bold text-surface text-center max-w-[320px] mb-2";
const EMAIL_DESCRIPTION = "text-[16px] font-nunito font-normal text-surface text-center max-w-[300px] leading-relaxed mb-4";
const EMAIL_INPUT_WRAPPER = "w-[280px]";
const EMAIL_LABEL = "text-[16px] font-inter font-normal text-surface mb-1.5 block text-left";
const EMAIL_INPUT = "w-full bg-black rounded-lg px-3 py-2.5 text-[#FFFFFF] placeholder:text-white/40 outline-none mb-1 text-[15px]";
const EMAIL_ERROR = "text-red-300 drop-shadow-sm text-xs mb-1";
const EMAIL_BUTTONS_WRAPPER = "flex flex-col items-center gap-2 w-[240px] mx-auto mt-4";
const EMAIL_ICON = "fa-regular fa-envelope text-white text-5xl";
const USERNAME_INPUT_WRAPPER = "w-[280px]";
const USERNAME_LABEL = "text-[16px] font-inter font-normal text-surface mb-1.5 block text-left";
const USERNAME_INPUT = "w-full bg-black rounded-lg px-3 py-2.5 text-[#FFFFFF] placeholder:text-white/40 outline-none mb-1 text-[15px]";

interface Props {
    onSubmit?: (username: string, email: string) => void;
    onCancel?: () => void;
    mode?: "verify" | "recovery";
}

const EmailInputPopup = ({ onSubmit, onCancel, mode = "verify" }: Props) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [touched, setTouched] = useState(false);
    const [username, setUsername] = useState("");

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const title =
        mode === "recovery"
            ? "Recuperación de cuenta"
            : "Verificación de Identidad";

    const description =
        "Ingrese una dirección de correo válida.";

    const { token } = useAuthContext();

    const sendVerifyHooks = useSendVerificationCode({ username, mail: email, token });
    const sendRecoveryHooks = useSendRecoveryCode({ username, email });

    const activeSendHook = mode === "recovery" ? sendRecoveryHooks : sendVerifyHooks;

    const { handleSend } = activeSendHook;



    const handleSubmit = () => {
        setTouched(true);
        if (!isValidEmail) return;
        onSubmit?.(username, email);
        handleSend();
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate("/login");
        }
    };

    return (
        <div className={EMAIL_CONTAINER}>
            <div className={EMAIL_CARD}>
                <div className={EMAIL_ICON_WRAPPER}>
                    <i className={EMAIL_ICON}></i>
                </div>

                <h2 className={EMAIL_TITLE}>
                    {title}
                </h2>

                <p className={EMAIL_DESCRIPTION}>
                    {description}
                </p>

                <div className={EMAIL_INPUT_WRAPPER}>
                    <label className={EMAIL_LABEL}>
                        Dirección Email
                    </label>

                    <input
                        type="email"
                        placeholder="ejemplo@correo.com"
                        className={EMAIL_INPUT}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setTouched(true)}
                    />

                    {!isValidEmail && touched && (
                        <p className={EMAIL_ERROR}>
                            El correo electronico debe ser válido
                        </p>
                    )}
                </div>
                {mode === "recovery" && (
                    <div className={USERNAME_INPUT_WRAPPER}>
                        <label className={USERNAME_LABEL}>
                            Nombre de Usuario
                        </label>
                        <input
                            type="text"
                            placeholder="Tu nombre de usuario"
                            className={USERNAME_INPUT}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onBlur={() => setTouched(true)}
                        />
                    </div>
                )}
                <div className={EMAIL_BUTTONS_WRAPPER}>
                    <Button
                        variant="secondary"
                        onClick={handleSubmit}
                        fullWidth
                    >
                        Añadir
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
