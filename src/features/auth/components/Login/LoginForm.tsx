import TextField from "../../../../components/TextField";
import Button from "../../../../components/Button";
import useLogin from "../../hooks/useLogin";
import { useState } from "react";
import EmailVerificationFlow from "../../components/EmailPasswordVerification/EmailVerificationFlow";

const LoginForm = () => {
    const {
        username,
        password,
        error,
        isLoading,
        setUsername,
        setPassword,
        handleSubmit
    } = useLogin();
    const [showRecovery, setShowRecovery] = useState(false);

    // Estilos Tailwind
    const FORM = "h-full flex flex-col";
    const FORM_SPACING = "flex flex-col flex-1 gap-6";
    const FIELD_WRAPPER = "w-full";
    const BUTTON_WRAPPER = "flex justify-center mt-6";
    const FOOTER_WRAPPER = "text-center mt-6";

    const TITLE = "text-3xl lg:text-5xl font-regular text-center text-surface font-inter mb-6";
    const LINK_TEXT = "text-center text-sm text-surface font-nunito";
    const LINK_ANCHOR = "text-accent hover:text-accent/80 font-medium transition-colors font-nunito";
    const FORGOT_PASSWORD = "block text-right text-sm text-accent hover:text-accent/80 transition-colors font-nunito cursor-pointer";

    return (
        <>
        <form onSubmit={handleSubmit} className={FORM}>
            <div className={FORM_SPACING}>
                <h1 className={TITLE}>
                    Bienvenido de vuelta
                </h1>

                <div className={FIELD_WRAPPER}>
                    <TextField
                        label="Nombre de Usuario"
                        type="text"
                        value={username} // Vinculado a username
                        onChange={(e) => setUsername(e.target.value)} // Vinculado a setUsername
                        error={error ?? ""}
                        disabled={isLoading}
                    />
                </div>

                <div className={FIELD_WRAPPER}>
                    <TextField
                        label="Contraseña"
                        type="password" // Cambiado a 'password' para ocultar los caracteres
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowRecovery(true)}
                        className={FORGOT_PASSWORD}
                    >
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>

                <div className={BUTTON_WRAPPER}>
                    <Button type="submit" variant="primary">
                        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                </div>
            </div>

            <p className={FOOTER_WRAPPER + " " + LINK_TEXT}>
                ¿No tienes una cuenta?{" "}
                <a href="/register" className={LINK_ANCHOR}>
                    Regístrate aquí
                </a>
            </p>
        </form>
          {showRecovery && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={() => setShowRecovery(false)}
      >
        <div
          className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
            <EmailVerificationFlow
                initialMode="recovery"
                onClose={() => setShowRecovery(false)}
            />
        </div>
      </div>
    )}
  </>
        
    );
};

export default LoginForm;
