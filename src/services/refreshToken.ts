const API_URL = import.meta.env.VITE_API_URL;

// Estado para controlar si ya se está renovando el token
let isRefreshing = false;
// Cola de suscriptores que esperan el nuevo token
let refreshSubscribers: ((token: string) => void)[] = [];

/*
  Características:
  -Agrega un callback a la cola de suscriptores
  -Los callbacks se ejecutarán cuando se obtenga un nuevo token

  @ Parámetro: cb - Función que recibe el nuevo token
*/
const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

/*
  Características:
  -Ejecuta todos los callbacks suscritos con el nuevo token
  -Limpia la cola de suscriptores después de ejecutarlos

  @ Parámetro: token - Nuevo token JWT obtenido tras refrescar
*/
const onRefreshed = (token: string) => {
    refreshSubscribers.map((cb) => cb(token));
    refreshSubscribers = [];
};

/*
  Características:
  -Función wrapper para fetch que maneja automáticamente renovación de token JWT
  -Agrega el token actual al header Authorization
  -Si la respuesta es 401 (no autorizado), intenta renovar el token
  -Mientras se renueva, encola otras peticiones para que usen el nuevo token
  -Si la renovación falla, limpia localStorage/sessionStorage y redirige a login
  -Soporte para FormData (no agrega Content-Type: application/json)

  @ Parámetros:
  -url: Endpoint a consultar
  -options: Opciones de fetch (method, body, etc.)
  -formData: Si es true, no agrega Content-Type: application/json (para archivos)

  @ Retorna: Promise con Response
  @ Lanza: Redirige a login si no se puede renovar el token

  @ Ejemplo:
  const response = await fetchWithAuth('/api/v1/users/profile', { method: 'GET' });
  
  @ Ejemplo con FormData:
  const formData = new FormData();
  formData.append('file', imageFile);
  const response = await fetchWithAuth('/api/upload', { method: 'POST', body: formData }, true);
*/
export const fetchWithAuth = async (url: string, options: RequestInit = {}, formData?: boolean): Promise<Response> => {
    const token = localStorage.getItem("token") ?? "";
    formData = formData ?? false;
    
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
    };
    if(!formData) {
        options.headers = {...options.headers,'Content-Type': 'application/json'};
    }
    console.log(options.body);
    let response = await fetch(`${url}`, options);

    if (response.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;

            try {
                const refreshToken = sessionStorage.getItem("refreshToken");

                if (!refreshToken) {
                    throw new Error("No hay un refresh token disponible");
                }
                const refreshResponse = await fetch(`${API_URL}/api/v2/auth/refresh`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ refreshToken })
                });

                const data = await refreshResponse.json();
                if (refreshResponse.ok && data.success) {
                    const newToken = data.accessToken;
                    
                    localStorage.setItem("token", newToken);
                    isRefreshing = false;
                    onRefreshed(newToken);
                } else {
                    throw new Error(data.message || "Error en la renovación del token");
                }
            } catch (error) {
                isRefreshing = false;
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/login";
                return response;
            }
        }
        // Espera a que se renueve el token y reintenta la petición
        return new Promise((resolve) => {
            subscribeTokenRefresh((newToken) => {
                if (options.headers) {
                    (options.headers as any)['Authorization'] = `Bearer ${newToken}`;
                }
                resolve(fetch(`${API_URL}${url}`, options));
            });
        });
    }

    return response;
};