import { useState } from "react";
import Button from "../../../../components/Button/Button";
import { useResetPassword } from "../../hooks/useResetPassword";

const VERIFICATION_CONTAINER = "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6";
const VERIFICATION_CARD = "bg-primary rounded-2xl w-full max-w-sm shadow-2xl py-8 min-h-[540px] flex flex-col items-center px-10";
const VERIFICATION_ICON_WRAPPER = "w-20 h-20 flex items-center justify-center bg-black rounded-full shadow-lg border border-white/10 mb-4";
const VERIFICATION_TITLE = "text-[26px] font-inter font-bold text-surface text-center leading-tight mb-2";
const VERIFICATION_DESCRIPTION = "text-[16px] font-nunito text-surface text-center mb-6";
const INPUT_WRAPPER = "w-full mb-4";
const LABEL = "text-[14px] text-surface font-nunito mb-2 block";
const INPUT_CONTAINER = "relative w-full";
const INPUT = "w-full bg-black rounded-lg px-4 py-3 pr-12 text-white placeholder:text-white/40 outline-none";
const EYE_ICON = "absolute right-3 top-1/2 -translate-y-1/2 text-white/60 cursor-pointer";
const ERROR_TEXT = "text-red-300 drop-shadow-sm text-sm mb-2";
const BUTTONS_WRAPPER = "flex flex-col items-center gap-3 w-[260px] mt-6";
const SHIELD_ICON = "fa-solid fa-shield text-[#90DDF0] text-6xl";
const EYE_OPEN_ICON = "fa-solid fa-eye";
const EYE_CLOSE_ICON = "fa-solid fa-eye-slash";
const EMAIL_HINT = "text-surface text-sm font-nunito text-center mb-2";

const censorEmail = (email: string): string => {
    const [local, domain] = email.split("@");
    if (!local || !domain) return email;
    const visible = local.slice(0, 4);
    const censored = "*".repeat(4);
    return `${visible}${censored}@${domain}`;
};

interface Props {
    username?: string;
    code?: string;
    email?: string;
    onClose?: () => void;
}

const ResetPasswordPopup = ({ username, code, email, onClose }: Props) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { isLoading, error, handleResetPassword } = useResetPassword();

    const isPasswordValid = password.length >= 8;
    const isMatch = password === confirmPassword;

    const handleSave = async () => {
        if (isPasswordValid && isMatch) {
            if (username && code) {
                const success = await handleResetPassword(username, password, code);
                if (success) {
                    onClose?.();
                }
            } else {
                onClose?.();
            }
        }
    };

    return (
        <div className={VERIFICATION_CONTAINER}>
            <div className={VERIFICATION_CARD}>
                <div className={VERIFICATION_ICON_WRAPPER}>
                    <i className={SHIELD_ICON}></i>
                </div>

                <h2 className={VERIFICATION_TITLE}>
                    Recuperacion de Contraseña
                </h2>

                <p className={VERIFICATION_DESCRIPTION}>
                    Ingrese y confirme su nueva contraseña
                </p>

                {email && (
                    <p className={EMAIL_HINT}>
                        Código enviado a: {censorEmail(email)}
                    </p>
                )}

                {error && (
                    <p className={ERROR_TEXT} style={{ textAlign: "center", marginBottom: "1rem" }}>
                        {error}
                    </p>
                )}

                <div className={INPUT_WRAPPER}>
                    <label className={LABEL}>
                        Nueva Contraseña
                    </label>
                    <div className={INPUT_CONTAINER}>
                        <input
                            type={showPassword ? "text" : "password"}
                            className={INPUT}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <i
                            className={`${showPassword ? EYE_CLOSE_ICON : EYE_OPEN_ICON} ${EYE_ICON}`}
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                    </div>
                    {!isPasswordValid && password.length > 0 && (
                        <p className={ERROR_TEXT}>
                            La contraseña debe tener mínimo 8 caracteres
                        </p>
                    )}
                </div>

                <div className={INPUT_WRAPPER}>
                    <label className={LABEL}>
                        Confirmar Contraseña
                    </label>
                    <div className={INPUT_CONTAINER}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className={INPUT}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <i
                            className={`${showConfirmPassword ? EYE_CLOSE_ICON : EYE_OPEN_ICON} ${EYE_ICON}`}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        ></i>
                    </div>
                    {confirmPassword.length > 0 && !isMatch && (
                        <p className={ERROR_TEXT}>
                            Las contraseñas deben ser iguales
                        </p>
                    )}
                </div>

                <div className={BUTTONS_WRAPPER}>
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={handleSave}
                        disabled={!isPasswordValid || !isMatch || password.length === 0 || isLoading}
                    >
                        {isLoading ? "Guardando..." : "Guardar"}
                    </Button>
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPopup;
