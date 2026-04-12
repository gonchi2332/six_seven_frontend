import { useState } from "react";
import Button from "../../../../components/Button/Button";

const EMAIL_CONTAINER = "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6";
const EMAIL_CARD = "bg-primary rounded-2xl w-full max-w-md shadow-2xl py-6 min-h-[520px] flex flex-col items-center px-10";
const EMAIL_ICON_WRAPPER = "w-24 h-24 flex items-center justify-center bg-black rounded-full shadow-lg border border-white/10 mb-4";
const EMAIL_TITLE = "text-[24px] md:text-3xl font-inter font-bold text-surface text-center max-w-[320px] mb-3";
const EMAIL_DESCRIPTION = "text-[18px] font-nunito font-normal text-surface text-center max-w-[260px] leading-relaxed mb-6";
const EMAIL_INPUT_WRAPPER = "w-[320px]";
const EMAIL_LABEL = "text-[18px] font-inter font-normal text-surface mb-2 block text-left";
const EMAIL_INPUT = "w-full bg-black rounded-lg px-4 py-3 text-[#FFFFFF] placeholder:text-white/40 outline-none mb-1";
const EMAIL_ERROR = "text-red-300 drop-shadow-sm text-sm mb-2";
const EMAIL_BUTTONS_WRAPPER = "flex flex-col items-center gap-3 w-[260px] mx-auto mt-6";
const EMAIL_ICON = "fa-regular fa-envelope text-white text-6xl";

interface Props {
  onSubmit?: () => void;
  onCancel?: () => void;
  mode?: "verify" | "recovery";
}

const EmailInputPopup = ({ onSubmit, onCancel, mode = "verify" }: Props) => {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const title =
    mode === "recovery"
      ? "Recuperación de cuenta"
      : "Verificación de Correo Electrónico";

  const description =
    "Por favor, ingresa una dirección de correo válida para recibir un código de recuperación.";

  const handleSubmit = () => {
    setTouched(true);
    if (!isValidEmail) return;
    onSubmit?.();
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
              El correo debe ser válido
            </p>
          )}
        </div>

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
            onClick={onCancel}
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