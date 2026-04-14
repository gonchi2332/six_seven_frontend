import { useNavigate } from "react-router-dom";

const CONTAINER = "h-screen bg-main flex flex-col items-center justify-center gap-4";
const TITLE = "text-4xl font-bold text-surface font-inter mb-8";
const BUTTON_GROUP = "flex gap-4";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className={CONTAINER}>
            <h1 className={TITLE}>Home</h1>
            <div className={BUTTON_GROUP}>
                <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2 rounded-xl bg-primary text-surface font-nunito font-bold"
                >
                    Iniciar Sesión
                </button>
                <button
                    onClick={() => navigate("/register")}
                    className="px-6 py-2 rounded-xl bg-secondary text-surface font-nunito font-bold"
                >
                    Registrarse
                </button>
            </div>
        </div>
    );
};

export default HomePage;
