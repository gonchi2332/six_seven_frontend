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
    const FORM_SPACING = "flex flex-col flex-1";
    const FOOTER_WRAPPER = "text-center mt-8";
    const USERNAME_WRAPPER = "mt-20";
    const PASSWORD_WRAPPER = "mt-16";
    const BUTTON_WRAPPER = "flex justify-center mt-28";
    const TITLE = "text-4xl font-regular text-center text-surface font-inter";
    const LINK_TEXT = "text-center text-sm text-surface font-nunito";
    const LINK_ANCHOR = "text-accent hover:text-accent/80 font-medium transition-colors font-nunito";
    const FORGOT_PASSWORD = "block text-right text-sm text-accent hover:text-accent/80 transition-colors font-nunito cursor-pointer mt-8";

    return (
        <form onSubmit={handleSubmit} className={FORM}>
            <div className={FORM_SPACING}>
                <div className={TITLE}>
                    <h1>Bienvenido de</h1>
                    <h1>vuelta</h1>
                </div>
                <div className={USERNAME_WRAPPER}>
                    <TextField
                        label="Nombre de Usuario"
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
                    <a href="/changePassword" className={FORGOT_PASSWORD}>
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
