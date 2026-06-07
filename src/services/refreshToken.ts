const API_URL = import.meta.env.VITE_API_URL;

let isRefreshing = false;
// Cola de callbacks pendientes mientras se renueva el token
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

// Notifica a todos los suscriptores con el nuevo token
const onRefreshed = (token: string) => {
    refreshSubscribers.map((cb) => cb(token));
    refreshSubscribers = [];
};

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
                // Si falla la renovación, limpia sesión y redirige al login
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/login";
                return response;
            }
        }
        // Encola la petición hasta que el token sea renovado
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