import { useState, useEffect } from "react";
import Button from "../../../../components/Button/Button";
import VerificationCodeInput from "../../../../components/VerificationCodeInput/VerificationCodeInput";
import {
    VERIFICATION_CONTAINER,
    VERIFICATION_CARD,
    VERIFICATION_CONTENT,
    VERIFICATION_ICON_WRAPPER,
    VERIFICATION_TITLE,
    VERIFICATION_DESCRIPTION,
    VERIFICATION_LABEL,
    VERIFICATION_TIMER,
    VERIFICATION_CODE_WRAPPER,
    VERIFICATION_ERROR_BOX,
    VERIFICATION_BUTTONS_WRAPPER
} from "./Verification.constats";

type Mode = "verify" | "reset";

interface Props {
  mode: Mode;
  onCodeExpired?: () => void;
}

const MOCK_CODE = "1234567";

const VerificationPopup = ({ mode, onCodeExpired }: Props) => {
  const [code, setCode] = useState<string[]>(Array(5).fill(""));
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft === 0) {
      onCodeExpired?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onCodeExpired]);

  const handleSubmit = () => {
    const joinedCode = code.join("");
    if (joinedCode !== MOCK_CODE) {
      setError(true);
      return;
    }
    setError(false);
    alert("Codigo ingresado correctamente");
  };

  const handleResend = () => {
    setCode(Array(7).fill(""));
    setError(false);
    setTimeLeft(60);
  };

  const title = error 
    ? "Error de Recuperacion"
    : mode === "verify"
    ? "Confirmación de Correo Electronico"
    : "Reestablecer Contraseña";

  const description = error 
    ? "Los datos registrados no coinciden con los criterios de seguridad"
     : mode === "verify"
    ? "Hemos enviado un código de verificación a tu correo."
    : "Hemos enviado un código para restablecer tu contraseña a tu correo.";

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={VERIFICATION_CONTAINER}>
      <div className={VERIFICATION_CARD}>
        <div className={VERIFICATION_CONTENT}>
          <div className={VERIFICATION_ICON_WRAPPER}>
            {error ? (
              <i className="fa-solid fa-circle-exclamation text-white text-5xl"></i>) : 
              (<i className="fa-solid fa-shield text-[#90DDF0] text-5xl"></i>)}
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

              <div className={VERIFICATION_TIMER}>
                Tiempo restante: {formatTime(timeLeft)}
              </div>

              <div className={VERIFICATION_CODE_WRAPPER}> 
                <VerificationCodeInput
                    value={code}
                    onChange={setCode}
                    error={error}
                />
                </div>
            </>
          ) : (
            <div className={VERIFICATION_ERROR_BOX}>
              <i className="fa-solid fa-circle-info"></i>
              <span>Por favor revisa que el codigo sea válido.</span>
            </div>
          )}
        </div>

        <div className={VERIFICATION_BUTTONS_WRAPPER}>
          <Button variant="secondary" onClick={handleSubmit}>
            Verificar
          </Button>
          <Button variant="primary" onClick={handleResend}>
            Reenviar Codigo
          </Button>
        </div>

      </div>
    </div>
  );
};

export default VerificationPopup;