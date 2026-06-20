import Button from "../../../../components/Button/Button";
import { useResetPasswordForm } from "../../hooks/useResetPasswordForm";

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

// Censura el email mostrando solo los primeros 4 caracteres de la parte local
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
    const {
        password,
        confirmPassword,
        showPassword,
        showConfirmPassword,
        validation,
        isLoading,
        error,
        updatePassword,
        updateConfirmPassword,
        toggleShowPassword,
        toggleShowConfirmPassword,
        handleSave,
    } = useResetPasswordForm({ username, code, onSuccess: onClose });

    return (
        <div className={VERIFICATION_CONTAINER}>
            <div className={VERIFICATION_CARD}>
                <div className={VERIFICATION_ICON_WRAPPER}>
                    <i className={SHIELD_ICON}></i>
                </div>
                <h2 className={VERIFICATION_TITLE}>
                    Recuperación de Contraseña
                </h2>
                <p className={VERIFICATION_DESCRIPTION}>
                    Ingrese y confirme su nueva contraseña
                </p>
                {/* Muestra el email censurado al que se envió el código */}
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
                    <label className={LABEL}>Nueva Contraseña</label>
                    <div className={INPUT_CONTAINER}>
                        <input
                            type={showPassword ? "text" : "password"}
                            className={INPUT}
                            value={password}
                            onChange={(e) => updatePassword(e.target.value)}
                            placeholder="Mínimo 8 caracteres"
                        />
                        {/* Toggle visibilidad de contraseña */}
                        <i
                            className={`${showPassword ? EYE_CLOSE_ICON : EYE_OPEN_ICON} ${EYE_ICON}`}
                            onClick={toggleShowPassword}
                        ></i>
                    </div>
                    {validation.passwordError && (
                        <p className={ERROR_TEXT}>{validation.passwordError}</p>
                    )}
                </div>
                <div className={INPUT_WRAPPER}>
                    <label className={LABEL}>Confirmar Contraseña</label>
                    <div className={INPUT_CONTAINER}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className={INPUT}
                            value={confirmPassword}
                            onChange={(e) => updateConfirmPassword(e.target.value)}
                            placeholder="Repite la contraseña"
                        />
                        <i
                            className={`${showConfirmPassword ? EYE_CLOSE_ICON : EYE_OPEN_ICON} ${EYE_ICON}`}
                            onClick={toggleShowConfirmPassword}
                        ></i>
                    </div>
                    {validation.confirmError && (
                        <p className={ERROR_TEXT}>{validation.confirmError}</p>
                    )}
                </div>
                <div className={BUTTONS_WRAPPER}>
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={handleSave}
                        disabled={!validation.isValid || isLoading}
                    >
                        {isLoading ? "Guardando..." : "Guardar"}
                    </Button>
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPopup;