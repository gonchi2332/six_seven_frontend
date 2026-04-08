import { useState } from "react";

const mockLogin = (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            if (email === "admin@test.com" && password === "123456") {
                resolve();
            } else {
                reject(new Error("Credenciales incorrectas"));
            }
        }, 1500);
    });
};


const useLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await mockLogin(email, password);
            alert("Login exitoso");

        } catch (err) {
            setError("Correo contrasena incorrectas");
        } finally {
            setIsLoading(false);
        }

    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        rememberMe,
        setRememberMe,
        isLoading,
        error,
        handleSubmit
    };

};

export default useLogin;
