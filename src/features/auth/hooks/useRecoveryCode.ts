import { useState } from "react";
import { requestRecoveryCode, verifyRecoveryCode } from "../services/recoveryCodeService";
import { useNavigate } from "react-router-dom";

/*
  Props del hook useSendRecoveryCode:
  -username: Nombre de usuario ingresado por el usuario
  -onSubmit: Función ejecutada al enviar exitosamente (recibe username y email)
  -onCancel: Función ejecutada al cancelar (si no se provee, navega a /login)
*/
interface UseSendRecoveryCodeParams {
    username: string;
    onSubmit?: (username: string, email: string) => void;
    onCancel?: () => void;
}

/*
  Características:
  -Hook que maneja el envío del código de recuperación de contraseña
  -Llama al servicio requestRecoveryCode para obtener el email asociado al username
  -Retorna email para mostrar censurado en el UI
  -Maneja estado de carga y errores
  -handleCancel: si hay onCancel lo ejecuta, si no navega a /login

  @ Ejemplo:
  const { isLoading, email, error, handleSubmit, handleCancel } = useSendRecoveryCode({
    username,
    onSubmit: (user, mail) => setUserData(user, mail),
    onCancel: () => setShowPopup(false)
  });
*/
export const useSendRecoveryCode = ({ username, onSubmit, onCancel }: UseSendRecoveryCodeParams) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const navigate = useNavigate();



    const handleSend = async (): Promise<{ success: boolean; email: string | null }> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await requestRecoveryCode({ username });
            const recoveryEmail = data.verificationMails[0];
            setEmail(recoveryEmail);
            return { success: true, email: recoveryEmail };
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al enviar el código");
            return { success: false, email: null };
        } finally {
            setIsLoading(false);
        }
    };


    const handleSubmit = async () => {
        const { success, email: mail } = await handleSend();
        if (success) {
            onSubmit?.(username, mail ?? "");

        }
    };
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate("/login");
        }
    };



    return { isLoading, email, error, handleSend, handleSubmit, handleCancel };
};

/*
  Props del hook useVerifyRecoveryCode:
  -username: Nombre de usuario que está recuperando la contraseña
  -code: Código de verificación ingresado por el usuario
*/
interface UseVerifyRecoveryParams {
    username: string;
    code: string;
}

/*
  Características:
  -Hook que maneja la verificación del código de recuperación
  -Llama al servicio verifyRecoveryCode para validar el código
  -Retorna título y descripción dinámicos según haya error o no
  -Si hay error, muestra mensaje específico
  -resetError permite limpiar el error para reintentar

  @ Ejemplo:
  const { isLoading, error, title, description, handleSubmit, resetError } = useVerifyRecoveryCode({
    username: "juanperez",
    code: "12345678"
  });
*/
export const useVerifyRecoveryCode = ({ username, code }: UseVerifyRecoveryParams) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const data = await verifyRecoveryCode({ username, code });
            if (data.success) {
                return true;
            } else {
                setError(data.message ?? "Código inválido");
                return false;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Código inválido");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const resetError = () => setError(null);

    const title = error ? "Código inválido" : "Recuperación de Contraseña";
    const description = error
        ? error
        : "Ingresa el código de recuperación enviado a tu correo";

    return { isLoading, error, title, description, handleSubmit, resetError };
};