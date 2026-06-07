import { useState } from "react";
import { verify } from "../services/verificationCodeService";
import { useAuthContext } from "../../../context/AuthContext";

/*
  Props del hook useVerifyCode:
  -username: Nombre del usuario a verificar
  -code: Código de verificación de 8 dígitos ingresado por el usuario
  -token: Token JWT del usuario (para autenticar la solicitud)
*/
interface UseVerifyCodeParams {
    username: string;
    code: string;
    token: string | null;
}

/*
  Características:
  -Hook personalizado que maneja la verificación de código en modo "verify" (registro)
  -Llama al servicio verify para validar el código
  -Si la verificación es exitosa y el backend devuelve un token, lo actualiza mediante useAuthContext
  -Maneja estado de carga (isLoading) y errores (error)
  -Retorna título y descripción dinámicos según haya error o no
  -resetError permite limpiar el error para reintentar

  @ Ejemplo:
  const { error, isLoading, title, description, handleSubmit, resetError } = useVerifyCode({
    username: "juanperez",
    code: "12345678",
    token: "jwt_token"
  });
  
  const success = await handleSubmit();
  if (success) {
    navigate("/info-personal");
  }
*/
export const useVerifyCode = ({ username, code, token }: UseVerifyCodeParams) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthContext();

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const data = await verify({ username, code, token });
            if (data.success !== false) {
                if (data.token) {
                    login(data.token);
                }
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

    const title = error ? "Código inválido" : "Verificación de cuenta";
    const description = error
        ? error
        : "Ingresa el código de verificación enviado a tu correo";

    return {
        error,
        isLoading,
        title,
        description,
        handleSubmit,
        resetError
    };
};