import loginImage from "./assets/login-image.jpg";

const LOGIN_IMAGE_STYLES = "w-full h-full object-cover";

/*
  Características:
  -Componente que renderiza la imagen decorativa de la pantalla de inicio de sesión
  -La imagen ocupa todo el ancho y alto de su contenedor manteniendo el aspect ratio
  -Útil para la sección visual izquierda/derecha del formulario de login

  @ Ejemplo:
  <div className="w-1/2">
    <LoginImage />
  </div>
*/
const LoginImage = () => {
    return (
        <img
            src={loginImage}
            alt="Login"
            className={LOGIN_IMAGE_STYLES}
        />
    );
};

export default LoginImage;