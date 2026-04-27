import { useState } from "react";
import { login } from "../../../services/loginService";
import { useAuthContext } from "../../../context/AuthContext";
import { useSendVerificationCode } from "./useSendVerificationCode";
import useEmail from "../../../hooks/useGetEmail";
import { useNavigate } from "react-router-dom";



const useLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({ username: "", password: "" });
    const [touched, setTouched] = useState({ username: false, password: false });
    const [serverError, setServerError] = useState<string>("");

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [showVerified, setShowVerified] = useState(false);


    const { login: authLogin, token } = useAuthContext();
    const { email } = useEmail();


    const validateUsername = (value: string) => {
        if (!value) return "El nombre de usuario es obligatorio";
        return "";
    };

    const validatePassword = (value: string) => {
        if (!value) return "La contraseña es obligatoria";
        return "";
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setUsername(val);
        if (touched.username) {
            setErrors(prev => ({ ...prev, username: validateUsername(val) }));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPassword(val);
        if (touched.password) {
            setErrors(prev => ({ ...prev, password: validatePassword(val) }));
        }
    };

    const handleUsernameBlur = () => {
        setTouched(prev => ({ ...prev, username: true }));
        setErrors(prev => ({ ...prev, username: validateUsername(username) }));
    };

    const handlePasswordBlur = () => {
        setTouched(prev => ({ ...prev, password: true }));
        setErrors(prev => ({ ...prev, password: validatePassword(password) }));
    };

    const { handleSend } = useSendVerificationCode({ username, mail: email, token });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setTouched({ username: true, password: true });
        const userErr = validateUsername(username);
        const passErr = validatePassword(password);

        setErrors({ username: userErr, password: passErr });
        setServerError("");

        if (userErr || passErr) return;

        setIsLoading(true);
        try {
            const data = await login({ username, password });
            authLogin(data.token);

            if (data.user.state.toUpperCase() === "UNVERIFIED") {
                setShowVerified(true);
                handleSend();
            } else {
                navigate("/dashboard");
            }


        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error inesperado";
            const lowerMsg = msg.toLowerCase();

            if (
                lowerMsg.includes("cannot read properties of undefined") ||
                lowerMsg.includes("reading 'profile_picture'") ||
                lowerMsg.includes("usuario") ||
                lowerMsg.includes("contraseña") ||
                lowerMsg.includes("password") ||
                lowerMsg.includes("credenciales") ||
                lowerMsg.includes("incorrecto") ||
                lowerMsg.includes("iniciar sesi")
            ) {
                setErrors(prev => ({ ...prev, username: "Usuario o contraseña inválida", password: "" }));
            } else {
                setServerError(msg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        username,
        password,
        errors,
        touched,
        showVerified,
        setShowVerified,
        serverError,
        isLoading,
        handleUsernameChange,
        handlePasswordChange,
        handleUsernameBlur,
        handlePasswordBlur,
        handleSubmit,
    };
};

export default useLogin;
