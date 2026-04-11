import LoginForm from "../features/auth/components/Login/LoginForm";
import LoginImage from "../features/auth/components/Login/LoginImage/LoginImage";
const CONTAINER = "h-screen bg-main flex overflow-hidden max-w-[1440px] mx-auto";
const IMAGE_SECTION = "hidden lg:flex lg:w-1/2 h-full";
const FORM_SECTION = "w-full lg:w-1/2 flex flex-col px-34 pt-32 pb-10";
const FORM_CARD = "w-full h-full flex flex-col";

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
