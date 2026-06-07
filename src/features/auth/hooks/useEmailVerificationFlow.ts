import { useState } from "react";
import { useNavigate } from "react-router-dom";

/*
  Tipos internos del hook:
  -Step: Define el paso actual del flujo (email, verification, reset)
  -Mode: Define el propósito (verify para registro, recovery para recuperación)
*/
type Step = "email" | "verification" | "reset";
type Mode = "verify" | "recovery";

/*
  Props del hook useEmailVerificationFlow:
  -initialMode: Modo inicial (verify o recovery). Por defecto "verify"
  -initialStep: Paso inicial del flujo. Por defecto "email"
  -initialUsername: Nombre de usuario precargado (opcional)
  -initialEmail: Email precargado (opcional)
  -onClose: Función ejecutada al cerrar el flujo (si no se provee, navega a /login)
*/
interface UseVerificationFlowProps {
    initialMode?: Mode;
    initialStep?: Step;
    initialUsername?: string;
    initialEmail?: string;
    onClose?: () => void;
}

/*
  Valor retornado por el hook:
  -step: Paso actual del flujo (email, verification, reset)
  -mode: Modo actual (verify o recovery)
  -username: Nombre de usuario ingresado o precargado
  -email: Email del usuario obtenido en el paso email
  -verifiedCode: Código verificado para usar en el reseteo
  -handleEmailSubmit: Función que avanza de email a verification, guarda username y email
  -handleCodeSuccess: Función que maneja éxito de verificación (avanza a reset si es recovery, o cierra si es verify)
  -handleClose: Función que cierra el flujo (ejecuta onClose o navega a /login)
*/
interface UseVerificationFlowReturn {
    step: Step;
    mode: Mode;
    username: string;
    email: string;
    verifiedCode: string;
    handleEmailSubmit: (submittedUsername: string, recoveryEmail: string) => void;
    handleCodeSuccess: (codeString?: string) => void;
    handleClose: () => void;
}

/*
  Características:
  -Hook orquestador del flujo completo de verificación por email (registro o recuperación)
  -Mantiene el estado de los tres pasos: email -> verification -> reset
  -Almacena username, email y código verificado a medida que avanza el flujo
  -En modo "verify": al verificar código exitosamente, cierra el flujo
  -En modo "recovery": al verificar código exitosamente, avanza al paso "reset" para cambiar contraseña
  -handleClose: si hay onClose lo ejecuta, si no navega a /login

  @ Ejemplo modo recovery:
  const flow = useEmailVerificationFlow({ initialMode: "recovery", onClose: () => setShowFlow(false) });
  // Paso 1: flow.handleEmailSubmit("juanperez", "juan@mail.com")
  // Paso 2: flow.handleCodeSuccess("12345678")
  // Paso 3: flow.step === "reset" -> mostrar ChangePassword

  @ Ejemplo modo verify:
  const flow = useEmailVerificationFlow({ initialMode: "verify" });
  // flow.handleCodeSuccess() cierra el flujo y navega a /info-personal
*/
export const useEmailVerificationFlow = ({
    initialMode = "verify",
    initialStep = "email",
    initialUsername = "",
    initialEmail = "",
    onClose,
}: UseVerificationFlowProps): UseVerificationFlowReturn => {
    const [step, setStep] = useState<Step>(initialStep);
    const [mode] = useState<Mode>(initialMode);
    const [username, setUsername] = useState(initialUsername);
    const [verifiedCode, setVerifiedCode] = useState("");
    const [email, setEmail] = useState(initialEmail);
    const navigate = useNavigate();

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            navigate("/login");
        }
    };

    const handleEmailSubmit = (submittedUsername: string, recoveryEmail: string) => {
        setUsername(submittedUsername);
        setEmail(recoveryEmail);
        setStep("verification");
    };

    const handleCodeSuccess = (codeString?: string) => {
        if (codeString) {
            setVerifiedCode(codeString);
        }

        if (mode === "recovery") {
            setStep("reset");
        } else if (mode === "verify") {
            handleClose();
        }
    };

    return {
        step,
        mode,
        username,
        email,
        verifiedCode,
        handleEmailSubmit,
        handleCodeSuccess,
        handleClose,
    };
};