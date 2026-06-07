import { useState } from "react";
import { login } from "../services/loginService";
import { useAuthContext } from "../../../context/AuthContext";
import { sendVerificationCode } from "../services/verificationCodeService";
import { getEmail } from "../../../services/getemail";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ username: "", password: "" });
    const [touched, setTouched] = useState({ username: false, password: false });
    const [serverError, setServerError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [showVerified, setShowVerified] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const navigate = useNavigate();
    const { login: authLogin } = useAuthContext();

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
        // Valida en tiempo real solo si el campo fue tocado
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
            const accessToken = data.token || data.accessToken;
            const refreshToken = data.refreshToken;

            if (refreshToken) {
                sessionStorage.setItem("refreshToken", refreshToken);
            }

            // Guarda el accessToken en localStorage mediante el contexto
            authLogin(accessToken);

            if (data.user.state.toUpperCase() === "UNVERIFIED") {
                let freshEmail = "";
                try {
                    const emailData = await getEmail();
                    freshEmail = emailData.email;
                    setUserEmail(freshEmail);
                } catch (e) {
                    setUserEmail("");
                }
                try {
                    await sendVerificationCode({ username, targetMail: freshEmail, token: accessToken });
                } catch {}
                // Muestra popup de verificación para usuarios no verificados
                setShowVerified(true);
            } else {
                navigate("/info-personal");
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
        userEmail,
        handleUsernameChange,
        handlePasswordChange,
        handleUsernameBlur,
        handlePasswordBlur,
        handleSubmit,
    };
};

export default useLogin;