import { useNavigate } from "react-router-dom";
import RegisterForm from "../../features/auth/components/RegisterForms";
import RegisterImage from "../../features/auth/components/RegisterForms/RegisterImage";
import Button from "../../components/Button"; // ← Tu componente personalizado Button

// Contenedor principal
const PAGE_CONTAINER = "h-screen bg-main flex flex-col overflow-hidden";

// Barra superior (solo visible en mobile)
const TOP_BAR = "lg:hidden bg-tertiary px-6 py-3 shrink-0";
const TOP_BAR_TITLE = "text-surface font-nunito font-bold text-lg";

// Contenido principal con scroll
const MAIN_CONTENT = "flex-1 overflow-y-auto px-6 lg:px-0";  

// Layout flex (desktop: fila, mobile: columna)
const FLEX_LAYOUT = "flex flex-col lg:flex-row h-full";

// Sección de imagen - MOBILE: centrada con márgenes, DESKTOP: sin márgenes
const IMAGE_SECTION = "lg:w-1/2 flex justify-center lg:block mt-8 lg:mt-0";  
const IMAGE_WRAPPER = "w-[250px] h-[250px] lg:w-full lg:h-full mx-auto lg:mx-0";

// Sección de formulario
const FORM_SECTION = "lg:w-1/2 flex items-center justify-center py-6 lg:p-6";  
const FORM_CARD = "w-full max-w-md flex flex-col"; // ← flex flex-col para apilar verticalmente

const RegisterPage = () => {
    const navigate = useNavigate();
    return (
        <div className={PAGE_CONTAINER}>
            <div className={TOP_BAR}>
                <h1 className={TOP_BAR_TITLE}>Registro</h1>
            </div>
            <div className={MAIN_CONTENT}>
                <div className={FLEX_LAYOUT}>
                    <div className={IMAGE_SECTION}>
                        <div className={IMAGE_WRAPPER}>
                            <RegisterImage />
                        </div>
                    </div>
                    
                    <div className={FORM_SECTION}>
                        <div className={FORM_CARD}>
                            <RegisterForm />
                            <Button 
                                onClick={() => navigate("/")} 
                                className="mt-4 w-full"
                            >
                                Volver a Página Principal
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:hidden h-16 bg-secondary"></div>
        </div>
    );
};

export default RegisterPage;