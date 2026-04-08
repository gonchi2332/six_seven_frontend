import TextField from "../../../../components/TextField";
import Button from "../../../../components/Button";
import useLogin from "../../hooks/useLogin";


const LoginForm = () => {
    const {
        email,
        password,
        error,
        isLoading,
        setEmail,
        setPassword,
        handleSubmit
    } = useLogin();

    const FORM = "h-full flex flex-col";
    const FORM_SPACING = "flex flex-col flex-1 justify-center";
    const FOOTER_WRAPPER = "text-center mt-auto pb-8";
    const EMAIL_WRAPPER = "mt-8";
    const PASSWORD_WRAPPER = "mt-4";
    const BUTTON_WRAPPER = "flex justify-center mt-10";
    const TITLE = "text-4xl font-regular text-center text-surface font-inter";
    const LINK_TEXT = "text-center text-sm text-surface font-nunito";
    const LINK_ANCHOR = "text-accent hover:text-accent/80 font-medium transition-colors font-nunito";
    const FORGOT_PASSWORD = "block text-right text-sm text-accent hover:text-accent/80 transition-colors font-nunito cursor-pointer mt-1";

    return (
        <form onSubmit={handleSubmit} className={FORM}>
            <div className={FORM_SPACING}>
                <h1 className={TITLE}>
                    Bienvenido de vuelta
                </h1>
                <div className={EMAIL_WRAPPER}>
                    <TextField
                        label="Correo electrónico"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={error ?? ""}
                        disabled={isLoading}
                    />
                </div>
                <div className={PASSWORD_WRAPPER}>
                    <TextField
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                    <a href="/forgot-password" className={FORGOT_PASSWORD}>
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>
                <div className={BUTTON_WRAPPER}>
                    <Button type="submit" variant="primary">
                        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                </div>
            </div>

            {/* Footer fuera del FORM_SPACING */}
            <p className={FOOTER_WRAPPER + " " + LINK_TEXT}>
                ¿No tienes una cuenta?{" "}
                <a href="/register" className={LINK_ANCHOR}>
                    Regístrate aquí
                </a>
            </p>
        </form>
    );
};

export default LoginForm;
