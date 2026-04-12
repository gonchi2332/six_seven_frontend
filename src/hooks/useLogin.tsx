import { useState } from "react";
import { login } from "../services/loginService";

const useLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setError(null);
        setIsLoading(true);

        try {
            const data = await login({ username, password });
            localStorage.setItem("auth_token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            // redirigir al usuario aquí
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
