import { useState, useEffect } from "react";
import Button from "../../../components/Button/Button";
import VerificationCodeInput from "../../../components/VerificationCodeInput/VerificationCodeInput";

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

  //Comprobacion de estado , si es de error, de verificacion o recuperacion
  //titulo,descripcion, icono y colores cambian segun el estado
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-primary rounded-2xl w-full max-w-sm shadow-2xl py-6 min-h-[540px] flex flex-col">
        <div className="flex flex-col items-center px-10 gap-3">
          <div className="w-20 h-20 flex items-center justify-center bg-black rounded-full shadow-lg border border-white/10">
            {error ? (
              <i className="fa-solid fa-circle-exclamation text-white text-5xl"></i>) : 
              (<i className="fa-solid fa-shield text-[#90DDF0] text-5xl"></i>)}
          </div>

          <h2 className="text-3xl font-inter font-bold text-surface text-center">
            {title}
          </h2>

          <p className="text-surface text-center text-sm max-w-[210px] leading-relaxed font-inter">
            {description}
          </p>

          {!error ? (
            <>
              <span className="text-surface text-[24px] font-nunito">
                Ingresar Código
              </span>

              <div className="text-surface text-sm font-mono bg-black/20 px-3 py-1 rounded-full">
                Tiempo restante: {formatTime(timeLeft)}
              </div>

              <div className="-mt-4 mb-4"> 
                <VerificationCodeInput
                    value={code}
                    onChange={setCode}
                    error={error}
                />
                </div>
            </>
          ) : (
            <div className="bg-white/10 border-l-4 border-red-400 rounded-lg p-5 flex items-center gap-2 text-surface text-sm">
              <i className="fa-solid fa-circle-info"></i>
              <span>Por favor revisa que el codigo sea válido.</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-3 px-10 w-full mt-auto">
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