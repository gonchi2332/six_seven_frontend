import TextField from "../../../../components/TextField";
import Button from "../../../../components/Button";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import {
    FIELD_WRAPPER,
    BUTTON_WRAPPER,
    FORM_SPACING,
    TITLE,
    LINK_TEXT,
    LINK_ANCHOR
} from "./RegisterForm.constats";

const RegisterForm = () => {
    const {
        formData,
        errors,
        touched,
        isLoading,
        handleMailChange,
        handlePasswordChange,
        handleConfirmPasswordChange,
        handleMailBlur,
        handlePasswordBlur,
        handleConfirmPasswordBlur,
        handleSubmit
    } = useRegisterForm();

    return (
        <form onSubmit={handleSubmit}>
            <div className={FORM_SPACING}>
                <h1 className={TITLE}>
                    Empieza a construir tu Portafolio
                </h1>

                <div onBlur={handleMailBlur} className={FIELD_WRAPPER}>
                    <TextField
                        label="Correo electrónico"
                        type="email"
                        value={formData.mail}
                        onChange={handleMailChange}
                        error={touched.mail ? errors.mail : ""}
                        disabled={isLoading}
                    />
                </div>

                <div onBlur={handlePasswordBlur} className={FIELD_WRAPPER}>
                    <TextField
                        label="Contraseña"
                        type="password"
                        value={formData.password}
                        onChange={handlePasswordChange}
                        error={touched.password ? errors.password : ""}
                        disabled={isLoading}
                    />
                </div>

                <div onBlur={handleConfirmPasswordBlur} className={FIELD_WRAPPER}>
                    <TextField
                        label="Confirmar contraseña"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        error={touched.confirmPassword ? errors.confirmPassword : ""}
                        disabled={isLoading}
                    />
                </div>

                <div className={BUTTON_WRAPPER}>
                    <Button type="submit" variant="primary">
                        {isLoading ? "Registrando..." : "Registrate"}
                    </Button>
                </div>

                <p className={LINK_TEXT}>
                    ¿Ya tienes una cuenta?{" "}
                    <a href="/login" className={LINK_ANCHOR}>
                        Inicia sesión
                    </a>
                </p>
            </div>
        </form>
    );
};

export default RegisterForm;