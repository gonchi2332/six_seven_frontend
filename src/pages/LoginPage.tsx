import LoginForm from "../features/auth/components/Login/LoginForm";
import LoginImage from "../features/auth/components/LoginImage/LoginImage";

const CONTAINER = "h-screen bg-main flex overflow-hidden";
const IMAGE_SECTION = "hidden lg:flex lg:w-1/2 h-full";
const FORM_SECTION = "w-full lg:w-1/2 flex flex-col items-center p-8";
const FORM_CARD = "w-full max-w-md h-full flex flex-col";

const LoginPage = () => {
    return (
        <div className={CONTAINER}>
            <div className={IMAGE_SECTION}>
                <LoginImage />
            </div>
            <div className={FORM_SECTION}>
                <div className={FORM_CARD}>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
