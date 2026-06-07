import RegisterForm from "../../features/auth/components/RegisterForms";
import RegisterImage from "../../features/auth/components/RegisterForms/RegisterImage";

// Contenedor principal
const PAGE_CONTAINER = "min-h-screen bg-main flex flex-col";

// Barra superior (solo visible en mobile)
const TOP_BAR = "lg:hidden bg-tertiary px-6 py-3";
const TOP_BAR_TITLE = "text-surface font-nunito font-bold text-lg";

// Contenido principal con scroll
const MAIN_CONTENT = "flex-1 overflow-y-auto px-6 lg:px-0";

// Layout flex (desktop: fila, mobile: columna)
const FLEX_LAYOUT = "flex flex-col lg:flex-row min-h-full";

// Sección de imagen - MOBILE: centrada con márgenes, DESKTOP: sin márgenes
const IMAGE_SECTION = "lg:w-1/2 flex justify-center lg:block mt-8 lg:mt-0";
const IMAGE_WRAPPER = "w-[250px] h-[250px] lg:w-full lg:h-full mx-auto lg:mx-0";

// Sección de formulario
const FORM_SECTION = "lg:w-1/2 flex items-center justify-center py-6 lg:p-6";
const FORM_CARD = "w-full max-w-md";

// Barra inferior (solo visible en mobile)
const BOTTOM_BAR = "lg:hidden h-16 bg-secondary";

/*
  Características:
  -Página de registro de nuevos usuarios
  -Diseño responsivo: en móvil muestra top bar con título, en desktop layout de dos columnas
  -Columna izquierda: imagen decorativa (RegisterImage)
  -Columna derecha: formulario de registro (RegisterForm)
  -En móvil, la imagen se muestra más pequeña arriba del formulario
  -Barra superior e inferior solo visibles en móvil (lg:hidden)
  -Diseño consistente con LoginPage (misma estructura)

  @ Ejemplo:
  // Ruta: /register
  <RegisterPage />
*/
const RegisterPage = () => {
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
                        </div>
                    </div>
                </div>
            </div>

            <div className={BOTTOM_BAR}></div>
        </div>
    );
};

export default RegisterPage;