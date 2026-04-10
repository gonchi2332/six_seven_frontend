import TextField from "../../../../components/TextField";
import Button from "../../../../components/Button";
import { useRegisterForm } from "../../hooks/useRegisterForm";


const RegisterForm = () => {
    const {
        formData,
        errors,
        touched,
        isLoading,
        handleNameChange,
        handlePasswordChange,
        handleConfirmPasswordChange,
        handlePaternalLastNameChange,
        handleMaternalLastNameChange,
        handleUsernameChange,
        handleNameBlur,
        handlePasswordBlur,
        handleConfirmPasswordBlur,
        handlePaternalLastNameBlur,
        handleMaternalLastNameBlur,
        handleUsernameBlur,
        handleSubmit
    } = useRegisterForm();

    // Layout
 const FORM_SPACING = "flex flex-col gap-6";  
 const FIELD_WRAPPER = "w-full";
 const BUTTON_WRAPPER = "flex justify-center mt-6";  
 const TWO_COLUMNS = "grid grid-cols-1 md:grid-cols-2 gap-5"; 
 const TOP_SECTION = "w-full"; 
// Tipografía
 const TITLE = "text-3xl lg:text-5xl font-regular text-left text-surface font-inter mb-6";

 const LINK_TEXT = "text-center text-sm text-surface font-nunito mt-6";
 const LINK_ANCHOR = "text-accent hover:text-accent/80 font-medium transition-colors font-nunito"
  
    return (
        <form onSubmit={handleSubmit} className={TOP_SECTION}>
            <div className={FORM_SPACING}>
                <h1 className={TITLE}>
                    Empieza a construir tu Portafolio
                </h1>

                <div onBlur={handleNameBlur} className={FIELD_WRAPPER}>
                    <TextField
                        label="Nombre*"
                        type="text"
                        value={formData.name}
                        onChange={handleNameChange}
                        error={touched.name ? errors.name : ""}
                        disabled={isLoading}
                    />
                </div>
                <div className={TWO_COLUMNS}>
                    <div onBlur={handlePaternalLastNameBlur} className={FIELD_WRAPPER}>
                        <TextField
                            label="Apellido paterno*"
                            type="text"
                            value={formData.paternalLastName}
                            onChange={handlePaternalLastNameChange}
                            error={touched.paternalLastName ? errors.paternalLastName : ""}
                            disabled={isLoading}
                        />
                    </div>
                    <div onBlur={handleMaternalLastNameBlur} className={FIELD_WRAPPER}>
                        <TextField
                            label="Apellido materno"
                            type="text"
                            value={formData.maternalLastName}
                            onChange={handleMaternalLastNameChange}
                            error={touched.maternalLastName ? errors.maternalLastName : ""}
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <div onBlur={handleUsernameBlur} className={FIELD_WRAPPER}>
                    <TextField
                        label="Nombre de usuario*"
                        type="text"
                        value={formData.username}
                        onChange={handleUsernameChange}
                        error={touched.username ? errors.username : ""}
                        disabled={isLoading}
                    />
                </div>

                <div onBlur={handlePasswordBlur} className={FIELD_WRAPPER}>
                    <TextField
                        label="Contraseña*"
                        type="password"
                        value={formData.password}
                        onChange={handlePasswordChange}
                        error={touched.password ? errors.password : ""}
                        disabled={isLoading}
                    />
                </div>

                <div onBlur={handleConfirmPasswordBlur} className={FIELD_WRAPPER}>
                    <TextField
                        label="Confirmar contraseña*"
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
