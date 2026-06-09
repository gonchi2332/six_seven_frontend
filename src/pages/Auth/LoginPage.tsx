import LoginForm from "../../features/auth/components/Login/LoginForm";
import LoginImage from "../../features/auth/components/Login/LoginImage/LoginImage";

// Layout - mobile first, desktop con dos columnas
const PAGE_CONTAINER = "h-screen bg-main flex flex-col";
// Contenido scrolleable, en desktop sin padding lateral
const MAIN_CONTENT = "flex-1 overflow-y-auto px-6 lg:px-0 lg:overflow-hidden lg:flex-1";
// Barra superior solo visible en móvil
const TOP_BAR = "lg:hidden bg-secondary px-6 py-3";
const TOP_BAR_TITLE = "text-surface font-nunito font-bold text-lg";
// Desktop: fila, móvil: columna
const FLEX_LAYOUT = "flex flex-col lg:flex-row lg:h-full min-h-full";
// Imagen centrada en móvil, ocupa mitad en desktop
const IMAGE_SECTION = "lg:w-1/2 lg:h-full flex justify-center lg:block mt-8 lg:mt-0";
const IMAGE_WRAPPER = "w-[150px] h-[150px] lg:w-full lg:h-full mx-auto lg:mx-0";
// Formulario centrado, ocupa la otra mitad en desktop
const FORM_SECTION = "lg:w-1/2 flex items-center justify-center py-6 lg:p-6";
const FORM_CARD = "w-full max-w-md";
// Barra inferior solo móvil (para balance visual)
const BOTTOM_BAR = "lg:hidden h-16 bg-secondary";

const LoginPage = () => {
    return (
        <div className={PAGE_CONTAINER}>
            {/* Barra superior móvil */}
            <div className={TOP_BAR}>
                <h1 className={TOP_BAR_TITLE}>Iniciar Sesión</h1>
            </div>
            <div className={MAIN_CONTENT}>
                <div className={FLEX_LAYOUT}>
                    {/* Columna izquierda: imagen decorativa */}
                    <div className={IMAGE_SECTION}>
                        <div className={IMAGE_WRAPPER}>
                            <LoginImage />
                        </div>
                    </div>
                    {/* Columna derecha: formulario */}
                    <div className={FORM_SECTION}>
                        <div className={FORM_CARD}>
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </div>
            {/* Barra inferior móvil */}
            <div className={BOTTOM_BAR}></div>
        </div>
    );
};

export default LoginPage;