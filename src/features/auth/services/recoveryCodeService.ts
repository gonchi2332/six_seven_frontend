/*
  Parámetros para solicitar código de recuperación:
  -username: Nombre de usuario que solicita recuperación
*/
interface ForgotPasswordParams {
    username: string;
}

/*
  Parámetros para verificar el código de recuperación:
  -username: Nombre de usuario
  -code: Código de verificación ingresado
*/
interface VerifyCodeParams {
    username: string;
    code: string;
}

/*
  Parámetros para restablecer la contraseña:
  -username: Nombre de usuario
  -newPassword: Nueva contraseña (debe cumplir validaciones)
  -code: Código de verificación válido
*/
interface ResetPasswordParams {
    username: string;
    newPassword: string;
    code: string;
}

/*
  Respuesta del endpoint forgot-password:
  -result: Indica si la operación fue exitosa
  -messageState: Estado del mensaje
  -verificationMails: Tupla con emails de verificación
*/
interface ForgotPasswordResponse {
    result: boolean;
    messageState: string;
    verificationMails: [string, string[]];
}

/*
  Respuesta del endpoint verify-code:
  -success: Indica si el código es válido
  -message: Mensaje descriptivo
*/
interface VerifyCodeResponse {
    success: boolean;
    message: string;
}

/*
  Respuesta de error genérica:
  -error: Mensaje de error del backend
*/
interface ErrorResponse {
    error: string;
}


const API_URL = import.meta.env.VITE_API_URL;

/*
  Características:
  -Solicita un código de recuperación para el username proporcionado
  -Endpoint: POST /api/v2/auth/users/forgot-password?username={username}
  -Retorna los emails donde se envió el código

  @ Parámetro: username - Nombre de usuario
  @ Retorna: Promise con ForgotPasswordResponse
  @ Lanza: Error si la solicitud falla

  @ Ejemplo:
  const { verificationMails } = await requestRecoveryCode({ username: "juanperez" });
  const recoveryEmail = verificationMails[0];
*/
export const requestRecoveryCode = async ({ username }: ForgotPasswordParams): Promise<ForgotPasswordResponse> => {
    const response = await fetch(`${API_URL}/api/v2/auth/users/forgot-password?username=${username}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data: ForgotPasswordResponse | ErrorResponse = await response.json();

    if (!response.ok) {
        throw new Error((data as ErrorResponse).error ?? "Error al solicitar el código de recuperación");
    }

    return data as ForgotPasswordResponse;
};

/*
  Características:
  -Verifica si el código ingresado es válido para el usuario
  -Endpoint: POST /api/v2/auth/users/verify-code
  -Envía username y code en el cuerpo de la solicitud

  @ Parámetros: username y code
  @ Retorna: Promise con VerifyCodeResponse (success: boolean)
  @ Lanza: Error si el código es inválido o la solicitud falla

  @ Ejemplo:
  const { success } = await verifyRecoveryCode({ 
    username: "juanperez", 
    code: "12345678" 
  });
  if (success) {
    // Avanzar al paso de reseteo
  }
*/
export const verifyRecoveryCode = async ({ username, code }: VerifyCodeParams): Promise<VerifyCodeResponse> => {
    const response = await fetch(`${API_URL}/api/v2/auth/users/verify-code`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, code }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error ?? "Error al verificar el código");
    }

    return data;
};

/*
  Características:
  -Restablece la contraseña del usuario usando el código de verificación
  -Endpoint: PATCH /api/v2/auth/users/reset-password
  -Envía username, password (nueva) y verificationCode en el cuerpo

  @ Parámetros: username, newPassword, code
  @ Retorna: Promise con la respuesta del servidor
  @ Lanza: Error si el código no es válido o la nueva contraseña no cumple requisitos

  @ Ejemplo:
  await resetPassword({ 
    username: "juanperez", 
    newPassword: "nuevaPass123", 
    code: "12345678" 
  });
  // Redirigir a login
*/
export const resetPassword = async ({ username, newPassword, code }: ResetPasswordParams) => {
    const response = await fetch(`${API_URL}/api/v2/auth/users/reset-password`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password: newPassword, verificationCode: code }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? data.error ?? "Error al restablecer la contraseña");
    }

    return data;
};

