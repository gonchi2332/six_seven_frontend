/*
  Parámetros para verificar el código:
  -username: Nombre de usuario a verificar
  -code: Código de verificación de 8 dígitos
  -token: Token JWT opcional (para autenticar la solicitud)
*/
interface VerifyParams {
    username: string;
    code: string;
    token?: string | null;
}

/*
  Parámetros para enviar código de verificación:
  -username: Nombre de usuario que recibe el código
  -targetMail: Correo electrónico destino
  -token: Token JWT opcional (para autenticar la solicitud)
*/
interface SendCodeParams {
    username: string;
    targetMail: string;
    token?: string | null;
}

/*
  Respuesta de verificación:
  -success: Indica si la operación fue exitosa
  -message: Mensaje descriptivo
  -token: Nuevo token JWT (puede venir en caso de verificación exitosa)
*/
interface VerifyResponse {
    success?: boolean;
    message: string;
    token?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

/*
  Características:
  -Servicio que verifica si el código ingresado es válido para el usuario
  -Endpoint: PATCH /api/v2/verification/users/compare-verification-code
  -Parámetros por query: username y currentCode
  -Incluye token JWT en header Authorization si está disponible
  -Si la verificación es exitosa, puede devolver un nuevo token

  @ Parámetro: username, code, token
  @ Retorna: Promise con VerifyResponse
  @ Lanza: Error si el código es inválido o la solicitud falla

  @ Ejemplo:
  try {
    const { success, token: newToken } = await verify({ 
      username: "juanperez", 
      code: "12345678",
      token: "jwt_token"
    });
    if (success && newToken) {
      login(newToken);
    }
  } catch (error) {
    console.error("Código inválido");
  }
*/
export const verify = async ({ username, code, token }: VerifyParams): Promise<VerifyResponse> => {
    const url = `${API_URL}/api/v2/verification/users/compare-verification-code?username=${username}&currentCode=${code}`;

    const headers: HeadersInit = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method: "PATCH",
        headers,
    });

    const data: VerifyResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};

/*
  Características:
  -Servicio que envía un código de verificación al correo del usuario
  -Endpoint: POST /api/v2/verification/users/verification-code
  -Parámetros por query: username y targetMail
  -Incluye token JWT en header Authorization si está disponible
  -Útil para registro de nuevos usuarios o reenvío de código

  @ Parámetro: username, targetMail, token
  @ Retorna: Promise con VerifyResponse
  @ Lanza: Error si no se puede enviar el código

  @ Ejemplo:
  try {
    await sendVerificationCode({ 
      username: "juanperez", 
      targetMail: "juanperez@gmail.com",
      token: "jwt_token"
    });
    // Mostrar popup de ingreso de código
  } catch (error) {
    console.error("Error al enviar código:", error.message);
  }
*/
export const sendVerificationCode = async ({ username, targetMail, token }: SendCodeParams): Promise<VerifyResponse> => {
    const url = `${API_URL}/api/v2/verification/users/verification-code?username=${username}&targetMail=${targetMail}`;

    const headers: HeadersInit = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method: "POST",
        headers,
    });

    const data: VerifyResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};

