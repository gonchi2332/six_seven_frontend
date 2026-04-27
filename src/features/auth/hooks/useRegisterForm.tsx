import { useState } from 'react';
import { registerUser } from '../../../services/registerFormService';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../context/AuthContext';
interface RegisterFormData {
    name: string;
    paternalLastName: string;
    username: string;
    password: string;
    confirmPassword: string;
    mail: string;

}

interface RegisterFormErrors {
    name: string;
    paternalLastName: string;
    username: string;
    password: string;
    confirmPassword: string;
    mail: string;
}

interface RegisterFormTouched {
    name: boolean;
    paternalLastName: boolean;
    username: boolean;
    password: boolean;
    confirmPassword: boolean;
    mail: boolean;
}




import { sendVerificationCode } from '../../../services/verificationCodeService';

export const useRegisterForm = () => {

    const { login: authLogin } = useAuthContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegisterFormData>({
        name: "",
        paternalLastName: "",
        username: "",
        password: "",
        confirmPassword: "",
        mail: ""
    });

    const [errors, setErrors] = useState<RegisterFormErrors>({
        name: "",
        paternalLastName: "",
        username: "",
        password: "",
        confirmPassword: "",
        mail: ""
    });

    const [touched, setTouched] = useState<RegisterFormTouched>({
        name: false,
        paternalLastName: false,
        username: false,
        password: false,
        confirmPassword: false,
        mail: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string>("");

    // Validaciones
    const validateName = (name: string): string => {
        if (!name) return "El nombre es requerido";
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) return "Solo letras y espacios";
        return "";
    };

    const validatePassword = (password: string): string => {
        if (!password) return "La contraseña es requerida";
        if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres";
        return "";
    };

    const validateConfirmPassword = (password: string, confirm: string): string => {
        if (!confirm) return "La confirmación de contraseña es requerida";
        if (password !== confirm) return "Las contraseñas no coinciden";
        return "";
    };

    const validatePaternalLastName = (paternalName: string) => {
        if (!paternalName) return "El apellido paterno es requerido";
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(paternalName)) return "Solo letras y espacios";
        return "";
    }

    const validateUsername = (username: string) => {
        if (!username) return "El nombre de usuario es obligatorio";
        if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Solo letras, números y guión bajo";
        return "";
    }

    const validateMail = (mail: string) => {
        if (!mail) return "El correo es obligatorio";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return "Correo no válido";
        return "";
    }

    // Handlers
    const handleFieldChange = (
        field: keyof RegisterFormData,
        value: string
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (touched[field]) {
            let error = "";
            switch (field) {
                case "name":
                    error = validateName(value);
                    break;
                case "paternalLastName":
                    error = validatePaternalLastName(value);
                    break;
                case "username":
                    error = validateUsername(value);
                    break;
                case "password":
                    error = validatePassword(value);
                    break;
                case "confirmPassword":
                    error = validateConfirmPassword(formData.password, value);
                    break;
                case "mail":
                    error = validateMail(value);
                    break;
            }
            setErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    // Handlers específicos
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFieldChange("name", e.target.value);
    };

    const handlePaternalLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFieldChange("paternalLastName", e.target.value);
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFieldChange("username", e.target.value);
    };

    const handleMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFieldChange("mail", e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, password: value }));

        if (touched.password) {
            const error = validatePassword(value);
            setErrors(prev => ({ ...prev, password: error }));
        }

        if (touched.confirmPassword && formData.confirmPassword) {
            const confirmError = validateConfirmPassword(value, formData.confirmPassword);
            setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, confirmPassword: value }));

        if (touched.confirmPassword) {
            const error = validateConfirmPassword(formData.password, value);
            setErrors(prev => ({ ...prev, confirmPassword: error }));
        }
    };

    // Blur handlers
    const handleNameBlur = () => {
        if (!touched.name) {
            setTouched(prev => ({ ...prev, name: true }));
            const error = validateName(formData.name);
            setErrors(prev => ({ ...prev, name: error }));
        }
    };

    const handleMailBlur = () => {
        if (!touched.mail) {
            setTouched(prev => ({ ...prev, mail: true }));
            const error = validateMail(formData.mail!);
            setErrors(prev => ({ ...prev, mail: error }));
        }
    };

    const handlePasswordBlur = () => {
        if (!touched.password) {
            setTouched(prev => ({ ...prev, password: true }));
            const error = validatePassword(formData.password);
            setErrors(prev => ({ ...prev, password: error }));
        }
    };

    const handleConfirmPasswordBlur = () => {
        if (!touched.confirmPassword) {
            setTouched(prev => ({ ...prev, confirmPassword: true }));
            const error = validateConfirmPassword(formData.password, formData.confirmPassword);
            setErrors(prev => ({ ...prev, confirmPassword: error }));
        }
    };

    const handlePaternalLastNameBlur = () => {
        if (!touched.paternalLastName) {
            setTouched(prev => ({ ...prev, paternalLastName: true }));
            const error = validatePaternalLastName(formData.paternalLastName);
            setErrors(prev => ({ ...prev, paternalLastName: error }));
        }
    };

    const handleUsernameBlur = () => {
        if (!touched.username) {
            setTouched(prev => ({ ...prev, username: true }));
            const error = validateUsername(formData.username!);
            setErrors(prev => ({ ...prev, username: error }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError("");

        setTouched({
            name: true,
            password: true,
            confirmPassword: true,
            paternalLastName: true,
            username: true,
            mail: true
        });

        const nameError = validateName(formData.name);
        const passwordError = validatePassword(formData.password);
        const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
        const paternalLastNameError = validatePaternalLastName(formData.paternalLastName);
        const usernameError = validateUsername(formData.username);
        const mailError = validateMail(formData.mail!);

        setErrors({
            name: nameError,
            paternalLastName: paternalLastNameError,
            username: usernameError,
            password: passwordError,
            confirmPassword: confirmPasswordError,
            mail: mailError
        });

        if (nameError ||
            passwordError ||
            confirmPasswordError ||
            paternalLastNameError ||
            usernameError ||
            mailError
        ) return;

        setIsLoading(true);

        try {
            // ============================================
            // PASO 1: Registrar usuario
            // ============================================
            const response = await registerUser({
                username: formData.username,
                password: formData.password,
                names: formData.name,
                firstSurname: formData.paternalLastName,
                mainRegistrationEmail: formData.mail
            });

            const token = response.token;

            authLogin(token);
            localStorage.setItem("username", formData.username);

            // ============================================
            // PASO 2: Enviar código de verificación al email
            // ============================================
            try {
                await sendVerificationCode({
                    username: formData.username,
                    targetMail: formData.mail,
                    token: token
                });


                // Redirigir a página de verificación
                navigate("/verification", {
                    state: {
                        email: formData.mail,
                        username: formData.username,
                        codeSent: true
                    }
                });

            } catch (verificationError: any) {

                navigate("/verification", {
                    state: {
                        email: formData.mail,
                        username: formData.username,
                        codeSent: false,
                        error: verificationError.message || "Error al enviar código"
                    }
                });
            }

        } catch (error: any) {


            const errorMessage = error.message?.toLowerCase() || "";

            if (errorMessage.includes("username") || errorMessage.includes("ya existe")) {
                setErrors(prev => ({
                    ...prev,
                    username: "Este nombre de usuario ya está en uso"
                }));
                setTouched(prev => ({ ...prev, username: true }));
            } else if (errorMessage.includes("email") || errorMessage.includes("correo")) {
                setErrors(prev => ({
                    ...prev,
                    mail: "Este correo ya está registrado"
                }));
                setTouched(prev => ({ ...prev, mail: true }));
            } else {
                setServerError(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        errors,
        touched,
        isLoading,
        serverError,
        handleNameChange,
        handlePasswordChange,
        handleConfirmPasswordChange,
        handlePaternalLastNameChange,
        handleUsernameChange,
        handleMailChange,
        handleNameBlur,
        handlePasswordBlur,
        handleConfirmPasswordBlur,
        handlePaternalLastNameBlur,
        handleUsernameBlur,
        handleMailBlur,
        handleSubmit
    };
};
