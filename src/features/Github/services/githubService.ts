import { fetchWithAuth } from "../../../services/refreshToken";

// services/gitHubService.ts
const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/api/v1/platforms/users`;

/*
  Características:
  -Servicio que gestiona la integración con GitHub
  -getProfile: obtiene el perfil de GitHub de un usuario (NO requiere autenticación)
  -updateProfile: registra o modifica el perfil de GitHub del usuario autenticado (requiere token)

  @ Ejemplo:
  // Obtener perfil público
  const profile = await gitHubService.getProfile("juanperez");
  
  // Actualizar perfil propio
  const result = await gitHubService.updateProfile("octocat");
*/
export const gitHubService = {
    /*
      Características:
      -Obtiene el perfil de GitHub de un usuario específico
      -Endpoint: GET /api/v1/platforms/users/{username}/github
      -No requiere autenticación (acceso público)

      @ Parámetro: username - Nombre de usuario de la aplicación
      @ Retorna: Datos del perfil de GitHub (githubUsername, etc.)
      @ Lanza: Error si la solicitud falla

      @ Ejemplo:
      const data = await gitHubService.getProfile("juanperez");
      // data: { success: true, githubUsername: "octocat", ... }
    */
    getProfile: async (username: string) => {
        const response = await fetch(`${BASE_URL}/${username}/github`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al obtener perfil de GitHub");
        }
        return await response.json();
    },

    /*
      Características:
      -Registra o modifica el perfil de GitHub del usuario autenticado
      -Endpoint: PUT /api/v1/platforms/users/github
      -Usa fetchWithAuth para manejo automático de refresh token
      -Requiere autenticación (token en header)

      @ Parámetro: githubUsername - Nombre de usuario de GitHub a vincular
      @ Retorna: Respuesta del servidor con success y message
      @ Lanza: Error si la solicitud falla

      @ Ejemplo:
      const result = await gitHubService.updateProfile("octocat");
      // result: { success: true, message: "Perfil actualizado" }
    */
    updateProfile: async (githubUsername: string) => {
        const response = await fetchWithAuth(`${BASE_URL}/github`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ githubUsername }),
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Error al actualizar perfil de GitHub");
        }
        return data;
    }
};