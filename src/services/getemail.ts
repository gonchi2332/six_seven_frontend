import { fetchWithAuth } from "./refreshToken";

/*
  Interfaz que define la respuesta del servicio getEmail:
  -success: Indica si la operación fue exitosa
  -message: Mensaje descriptivo de la respuesta
  -email: Correo electrónico del usuario autenticado
*/
interface EmailResponse {
    success: boolean;
    message: string;
    email: string;
}

const API_URL = import.meta.env.VITE_API_URL;

/*
  Características:
  -Servicio que obtiene el correo electrónico del usuario autenticado
  -Endpoint: GET /api/v2/verification/users/mail
  -Usa fetchWithAuth para manejo automático de refresh token
  -Útil para obtener el email del usuario en flujos de verificación

  @ Retorna: Promise con EmailResponse (success, message, email)
  @ Lanza: Error si la solicitud falla

  @ Ejemplo:
  try {
    const { email } = await getEmail();
    console.log("Email del usuario:", email);
  } catch (error) {
    console.error("Error al obtener email:", error.message);
  }
*/
export const getEmail = async (): Promise<EmailResponse> => {
    const response = await fetchWithAuth(
        `${API_URL}/api/v2/verification/users/mail`,
        {
            method: "GET",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    
    return data;
};

