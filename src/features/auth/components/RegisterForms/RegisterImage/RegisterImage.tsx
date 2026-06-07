import Logo from "./assets/pictureTis1.jpeg";

const IMAGE = "w-full h-full object-cover lg:rounded-none"

/*
  Características:
  -Componente que renderiza la imagen decorativa de la pantalla de registro
  -La imagen ocupa todo el ancho y alto de su contenedor manteniendo el aspect ratio
  -En pantallas grandes (lg), elimina los bordes redondeados

  @ Ejemplo:
  <div className="w-1/2">
    <RegisterImage />
  </div>
*/
const RegisterImage = () => {
    return (
        <img
            src={Logo}
            alt="Imagen de fondo"
            className={IMAGE}
        />
    );
};

export default RegisterImage;