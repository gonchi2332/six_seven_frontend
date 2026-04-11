import Logo from "./assets/pictureTis1.jpeg";
const IMAGE = "w-full h-full object-cover lg:rounded-none"
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
