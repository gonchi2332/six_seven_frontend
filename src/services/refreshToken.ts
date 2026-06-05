const API_URL = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
    refreshSubscribers.map((cb) => cb(token));
    refreshSubscribers = [];
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = localStorage.getItem("token") ?? "";
    
    options.headers = {
        ...options.headers,
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
    };
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