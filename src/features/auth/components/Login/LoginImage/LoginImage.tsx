import loginImage from "./assets/login-image.jpg";

const LOGIN_IMAGE_STYLES = "w-full h-full object-cover";

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
