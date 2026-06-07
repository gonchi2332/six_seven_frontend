/*
  Payload para el servicio de login:
  -username: Nombre de usuario del usuario
  -password: Contraseña del usuario
*/
interface LoginPayload {
    username: string;
    password: string;
}

/*
  Respuesta del servicio de login:
  -success: Indica si la operación fue exitosa
  -message: Mensaje descriptivo de la respuesta
  -user: Datos del usuario (username, estado, apellidos, etc.)
  -profilePicture: URL o base64 de la foto de perfil
  -token: Token JWT opcional (puede venir como token o accessToken)
  -accessToken: Token JWT de acceso
  -refreshToken: Token JWT para refrescar la sesión
*/
interface LoginResponse {
    success: boolean;
    message: string;
    user: {
        username: string;
        hashed_password: string;
        state: string;
        first_surname: string;
        profile_surname: string;
        profilePicture: string;
    };
    profilePicture: string;
    token?: string;
    accessToken: string;
    refreshToken: string;
}

const API_URL = import.meta.env.VITE_API_URL;

/*
  Características:
  -Servicio que maneja la petición de inicio de sesión al backend
  -Endpoint: POST /api/v2/auth/users/login
  -Envía username y password en el cuerpo de la solicitud
  -Si la respuesta no es exitosa (response.ok false) o faltan accessToken/refreshToken, lanza error
  -Retorna los datos del usuario junto con los tokens

  @ Parámetro: payload - Objeto con username y password
  @ Retorna: Promise con LoginResponse que contiene usuario y tokens
  @ Lanza: Error si las credenciales son inválidas o hay problema de conexión

  @ Ejemplo:
  try {
    const { accessToken, refreshToken, user } = await login({ 
      username: "juanperez", 
      password: "12345678" 
    });
    localStorage.setItem("token", accessToken);
  } catch (error) {
    console.error("Error de login:", error.message);
  }
*/
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await fetch(
        `${API_URL}/api/v2/auth/users/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        }
    );

    const data = await response.json();

    if (!response.ok || !data.accessToken || !data.refreshToken) {
        throw new Error(data.message || "Error al iniciar sesión");
    }


    return data;
};