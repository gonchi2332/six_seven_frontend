import { useState } from "react";
import { sendVerificationCode } from "../services/verificationCodeService";

/*
  Props del hook useSendVerificationCode:
  -username: Nombre de usuario al que se enviará el código
  -mail: Correo electrónico destino del código de verificación
  -token: Token JWT opcional (para autenticación)
*/
interface UseSendVerificationCodeParams {
    username: string;
    mail: string;
    token?: string | null;
}

/*
  Características:
  -Hook personalizado que maneja el envío de código de verificación
  -Llama al servicio sendVerificationCode para enviar el código al email del usuario
  -Maneja estado de carga (isLoading) y errores (error)
  -Retorna true si el envío fue exitoso, false si hubo error

  @ Ejemplo:
  const { error, isLoading, handleSend } = useSendVerificationCode({
    username: "juanperez",
    mail: "juanperez@gmail.com",
    token: "jwt_token"
  });
  
  const success = await handleSend();
  if (success) {
    // Mostrar popup de verificación
  }
*/
export const useSendVerificationCode = ({ username, mail, token }: UseSendVerificationCodeParams) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async (): Promise<boolean> => {
        setError(null);
        setIsLoading(true);

        try {
            const data = await sendVerificationCode({ username, targetMail: mail, token });
            if (data.success) {
                return true;
            } else {
                setError(data.message ?? "Error al enviar el código");
                return false;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al enviar el código");
            return false;
        } finally {
            setIsLoading(false);
        }
    };


    return {
        error,
        isLoading,
        handleSend,
    };
};