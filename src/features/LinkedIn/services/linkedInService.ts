import { fetchWithAuth } from "../../../services/refreshToken";

// services/linkedinService.ts
const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/api/v1/platforms/users`;

/*
  Características:
  -Servicio que gestiona la integración con LinkedIn
  -getProfile: obtiene el perfil de LinkedIn de un usuario (NO requiere autenticación)
  -updateProfile: registra o modifica el perfil de LinkedIn del usuario autenticado (requiere token)

  @ Ejemplo:
  // Obtener perfil público
  const profile = await linkedinService.getProfile("juanperez");
  
  // Actualizar perfil propio
  const result = await linkedinService.updateProfile("anahisu");
*/
export const linkedinService = {
  /*
    Características:
    -Obtiene el perfil de LinkedIn de un usuario específico
    -Endpoint: GET /api/v1/platforms/users/{username}/linkedin
    -No requiere autenticación (acceso público)

    @ Parámetro: username - Nombre de usuario de la aplicación
    @ Retorna: Datos del perfil de LinkedIn (linkedinUsername, etc.)

    @ Ejemplo:
    const data = await linkedinService.getProfile("juanperez");
    // data: { success: true, linkedinUsername: "anahisu" }
  */
  getProfile: async (username: string) => {
    const response = await fetch(`${BASE_URL}/${username}/linkedin`);
    return await response.json();
  },

  /*
    Características:
    -Registra o modifica el perfil de LinkedIn del usuario autenticado
    -Endpoint: PUT /api/v1/platforms/users/linkedin
    -Usa fetchWithAuth para manejo automático de refresh token
    -Requiere autenticación (token en header)

    @ Parámetro: linkedinUsername - Nombre de usuario de LinkedIn a vincular
    @ Retorna: Respuesta del servidor con success y message

    @ Ejemplo:
    const result = await linkedinService.updateProfile("anahisu");
    // result: { success: true, message: "Perfil actualizado" }
  */
  updateProfile: async (linkedinUsername: string) => {
    
    const response = await fetchWithAuth(`${BASE_URL}/linkedin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ linkedinUsername }),
    });
    return await response.json();
  }
};