/*
  Petición de registro de usuario:
  -username: Nombre de usuario único
  -password: Contraseña (mínimo 8 caracteres)
  -names: Nombre(s) del usuario
  -firstSurname: Primer apellido
  -secondSurname: Segundo apellido (opcional)
  -mainRegistrationEmail: Correo electrónico principal
*/
export interface RegisterRequest {
    username: string;
    password: string;
    names: string;
    firstSurname: string;
    secondSurname?: string;
    mainRegistrationEmail: string;
}

/*
  Respuesta del registro de usuario:
  -user: Objeto con id, username y estado del usuario creado
  -token: Token JWT para autenticación automática post-registro
*/
export interface RegisterResponse {
    user: {
        id: number;
        username: string;
        state: string;
    };
    token: string;
}

const API_URL = import.meta.env.VITE_API_URL 

/*
  Características:
  -Servicio que registra un nuevo usuario en el sistema
  -Endpoint: POST /api/v2/auth/users/credentials-info
  -Envía todos los datos del usuario (username, password, nombres, apellidos, email)
  -Si el username ya existe, retorna error específico
  -Retorna token JWT para iniciar sesión automáticamente después del registro

  @ Parámetro: data - Objeto con los datos del usuario a registrar
  @ Retorna: Promise con RegisterResponse (usuario creado + token)
  @ Lanza: Error si el username ya existe o hay problema de conexión

  @ Ejemplo:
  try {
    const { user, token } = await registerUser({
      username: "juanperez",
      password: "12345678",
      names: "Juan",
      firstSurname: "Pérez",
      secondSurname: "Gómez",
      mainRegistrationEmail: "juanperez@gmail.com"
    });
    localStorage.setItem("token", token);
    // Redirigir a verificación
  } catch (error) {
    console.error("Error en registro:", error.message);
  }
*/
export const registerUser = async (
    data: RegisterRequest
): Promise<RegisterResponse> => {
    const response = await fetch(`${API_URL}/api/v2/auth/users/credentials-info`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'El nombre de usuario ya está en uso');
    }

    return response.json();
};

