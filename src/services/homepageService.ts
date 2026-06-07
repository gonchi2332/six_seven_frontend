const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/api/v1/profile/users`;

/*
  Interfaz que define la estructura de un usuario en resultados de búsqueda:
  -id: Identificador único del usuario
  -names: Nombre(s) del usuario
  -first_surname: Primer apellido
  -second_surname: Segundo apellido (opcional)
  -username: Nombre de usuario único
  -profile_picture_url: URL de la imagen de perfil (opcional)
*/
export interface UserSearchResult {
    id: string | number;
    names: string;
    first_surname: string;
    second_surname?: string;
    username: string;
    profile_picture_url?: string | null;
}

/*
  Características:
  -Servicio que gestiona operaciones relacionadas con usuarios
  -getAllUsers: Obtiene la lista de todos los usuarios registrados
  -Endpoint: GET /api/v1/profile/users
  -No requiere autenticación (acceso público)
  -Útil para búsqueda de usuarios o listados generales

  @ Ejemplo:
  const users = await userService.getAllUsers();
  console.log("Usuarios encontrados:", users.length);
*/
export const userService = {
    /*
      Características:
      -Obtiene todos los usuarios del sistema
      -Endpoint: GET /api/v1/profile/users
      -Retorna array vacío si la respuesta no contiene users

      @ Retorna: Promise con array de UserSearchResult
    */
    getAllUsers: async (): Promise<UserSearchResult[]> => {
        const response = await fetch(BASE_URL);
        const data = await response.json();
        return Array.isArray(data?.users) ? data.users : [];
    }
};