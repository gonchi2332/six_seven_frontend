import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/loginService";
import { useAuthContext } from "../../../context/AuthContext";

const useLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login: authLogin } = useAuthContext();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const data = await login({ username, password });
            authLogin(data.token, data.user);
            navigate("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error inesperado");
        } finally {
            setIsLoading(false);
        }

    };

    return {
        username,
        password,
        error,
        isLoading,
        setUsername,
        setPassword,
        handleSubmit,
    };
};

export default useLogin;





