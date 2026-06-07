import { useLocation } from "react-router-dom";
import EmailVerificationFlow from "../../features/auth/components/EmailPasswordVerification/EmailVerificationFlow";

// Página de verificación después del registro
const VerificationPage = () => {
  const location = useLocation();
  // Recibir datos desde navigate con state (viene desde RegisterForm)
  const state = location.state as { username?: string, email?: string, codeSent?: boolean } | null;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-center items-center flex-1">
        <EmailVerificationFlow 
          initialMode="verify" 
          // Si ya se envió el código, empezar directamente en el paso de verificación
          initialStep={state?.codeSent ? "verification" : "email"}
          initialUsername={state?.username}
          initialEmail={state?.email}
        />
      </div>
    </div>
  );
};

export default VerificationPage;