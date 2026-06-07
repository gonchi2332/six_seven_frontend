import EmailVerificationFlow from "../../features/auth/components/EmailPasswordVerification/EmailVerificationFlow";

// Página pública para recuperar contraseña
// initialMode="recovery" inicia el flujo de recuperación (email -> código -> nueva contraseña)
const PasswordResetPage = () => {
  return (
    <div>
      <EmailVerificationFlow initialMode="recovery" />
    </div>
  );
};

export default PasswordResetPage;