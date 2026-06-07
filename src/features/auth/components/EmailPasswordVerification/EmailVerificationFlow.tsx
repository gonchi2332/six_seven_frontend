import { useEmailVerificationFlow } from "../../hooks/useEmailVerificationFlow";
import EmailInputPopup from "./EmailInputPopup";
import VerificationPopup from "./CodeEmailPopup";
import ResetPasswordPopup from "./ChangePassword";

/*
  Tipos internos del componente VerificationFlow:
  -Step: Define en qué paso del flujo se encuentra (email -> verification -> reset)
  -Mode: Define el propósito del flujo (verify para registro, recovery para recuperación)
*/
type Step = "email" | "verification" | "reset";
type Mode = "verify" | "recovery";

/*
  Props del componente VerificationFlow:
  -initialMode: Modo inicial (verify o recovery). Por defecto "recovery"
  -initialStep: Paso inicial del flujo (email, verification, reset). Por defecto "email"
  -initialUsername: Nombre de usuario precargado (opcional)
  -initialEmail: Email precargado (opcional)
  -onClose: Función ejecutada al cerrar el flujo completo
*/
type Props = {
    initialMode?: Mode;
    initialStep?: Step;
    initialUsername?: string;
    initialEmail?: string;
    onClose?: () => void;
};

/*
  Características:
  -Componente orquestador del flujo completo de verificación por email
  -Maneja tres pasos secuenciales: ingreso de email, verificación de código, reseteo de contraseña
  -Cada paso renderiza un popup diferente según el estado actual
  -El hook useEmailVerificationFlow gestiona el estado y las transiciones entre pasos
  -Puede inicializarse en cualquier paso con datos precargados (útil para reanudar flujos)

  Flujo típico en modo recovery:
  1. EmailInputPopup: usuario ingresa username -> se obtiene email
  2. VerificationPopup: usuario ingresa código de 8 dígitos
  3. ResetPasswordPopup: usuario establece nueva contraseña

  @ Ejemplo flujo completo:
  <VerificationFlow 
    initialMode="recovery"
    onClose={() => setShowFlow(false)}
  />

  @ Ejemplo iniciando desde verificación (reanudar flujo):
  <VerificationFlow 
    initialMode="verify"
    initialStep="verification"
    initialUsername="juanperez"
    initialEmail="juanperez@gmail.com"
    onClose={() => setShowFlow(false)}
  />
*/
const VerificationFlow = (props: Props) => {

    const {
        step,
        mode,
        username,
        email,
        verifiedCode,
        handleEmailSubmit,
        handleCodeSuccess,
        handleClose,
    } = useEmailVerificationFlow(props);

    return (
        <>
            {step === "email" && (
                <EmailInputPopup
                    onSubmit={handleEmailSubmit}
                    onCancel={handleClose}
                />
            )}
            {step === "verification" && (
                <VerificationPopup
                    username={username}
                    email={email}
                    mode={mode}
                    onSuccess={handleCodeSuccess}
                    onClose={handleClose}
                />
            )}
            {step === "reset" && (
                <ResetPasswordPopup
                    username={username}
                    code={verifiedCode}
                    email={email}
                    onClose={handleClose}
                />
            )}
        </>
    );
};

export default VerificationFlow;