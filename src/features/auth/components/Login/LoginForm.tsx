import TextField from "../../../../components/TextField";
import Button from "../../../../components/Button";
import useLogin from "../../hooks/useLogin";

const LoginForm = () => {
    const {
        username,
        password,
        errors,
        touched,
        serverError,
        isLoading,
        handleUsernameChange,
        handlePasswordChange,
        handleUsernameBlur,
        handlePasswordBlur,
        handleSubmit
    } = useLogin();

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
        <form onSubmit={handleSubmit} className={FORM}>
            <div className={FORM_SPACING}>
                <h1 className={TITLE}>
                    Bienvenido de vuelta
                </h1>

                <div onBlur={handleUsernameBlur} className={FIELD_WRAPPER}>
                    <TextField
                        label="Nombre de Usuario"
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        error={touched.username ? errors.username : ""}
                        disabled={isLoading}
                    />
                </div>

                <div onBlur={handlePasswordBlur} className={FIELD_WRAPPER}>
                    <TextField
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        error={touched.password ? errors.password : ""}
                        disabled={isLoading}
                    />
                    <a href="/changePassword" className={FORGOT_PASSWORD}>
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>

                {serverError && (
                    <p className="text-red-300 drop-shadow-sm text-sm text-center">
                        {serverError}
                    </p>
                )}

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
    );
};

export default LoginForm;
