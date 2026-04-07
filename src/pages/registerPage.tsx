import RegisterForm from "../features/auth/components/RegisterForms";
import RegisterImage from "../features/auth/components/RegisterImage";

// Constantes de estilos específicas de la página
const CONTAINER = "min-h-screen bg-main flex items-center stretch";
const IMAGE_SECTION = "hidden lg:flex lg:w-1/2 bg-cover bg-center items-center justify-center";
const FORM_SECTION = "w-full lg:w-1/2 flex items-center justify-center p-8";
const FORM_CARD = "w-full max-w-md";

const RegisterPage = () => {
    return (
        <div className={CONTAINER}>
            <div className={IMAGE_SECTION}>
                <RegisterImage />
            </div>
            <div className={FORM_SECTION}>
                <div className={FORM_CARD}>
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;