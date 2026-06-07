import EmailVerificationFlow from "../../features/auth/components/EmailPasswordVerification/EmailVerificationFlow";

/*
  Características:
  -Página para recuperación de contraseña (reset password)
  -Renderiza el componente EmailVerificationFlow en modo "recovery"
  -Flujo de recuperación: ingreso de email -> verificación de código -> cambio de contraseña
  -No requiere autenticación previa (acceso público)

  @ Ejemplo:
  // Ruta: /reset-password
  <PasswordResetPage />
*/
const PasswordResetPage = () => {
  return (
    <div>
      <EmailVerificationFlow initialMode="recovery" />
    </div>
  );
};


export default PasswordResetPage;
