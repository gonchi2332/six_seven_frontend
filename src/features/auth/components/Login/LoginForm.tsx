import TextField from "../../../../components/TextField";
import Button from "../../../../components/Button";
import useLogin from "../../hooks/useLogin";
import {
    FORM,
    FORM_SPACING,
    EMAIL_WRAPPER,
    PASSWORD_WRAPPER,
    BUTTON_WRAPPER,
    FOOTER_WRAPPER,
    TITLE,
    LINK_TEXT,
    LINK_ANCHOR,
    FORGOT_PASSWORD
} from "./LoginForm.constants";
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
