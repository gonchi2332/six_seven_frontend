import { useLocation } from "react-router-dom";
import EmailVerificationFlow from "../../features/auth/components/EmailPasswordVerification/EmailVerificationFlow";

/*
  Características:
  -Página de verificación de cuenta después del registro
  -Recibe estado de navegación con username, email y codeSent
  -Si codeSent es true (código ya enviado), inicia el flujo en paso "verification"
  -Si no, inicia en paso "email" para solicitar envío de código
  -Modo "verify" (registro, no recuperación)
  -Diseño centrado con flexbox

  @ Ejemplo:
  // Redirección desde RegisterForm
  navigate("/verification", {
    state: {
      email: "juan@mail.com",
      username: "juanperez",
      codeSent: true
    }
  });
*/
const VerificationPage = () => {
  const location = useLocation();
  const state = location.state as { username?: string, email?: string, codeSent?: boolean } | null;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-center items-center flex-1">
        <EmailVerificationFlow 
          initialMode="verify" 
          initialStep={state?.codeSent ? "verification" : "email"}
          initialUsername={state?.username}
          initialEmail={state?.email}
        />
      </div>
    </div>
  );
};

export default VerificationPage;