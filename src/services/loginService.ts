interface LoginPayload {
    username: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    user: {
        id: number;
        username: string;
        hashed_password: string;
        state: string;
        names: string;
        paternal_surname: string;
    };
    token: string;
}
console.log("URL de la API:", import.meta.env.VITE_API_URL);
const API_URL = import.meta.env.VITE_API_URL;

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await fetch(
        `${API_URL}/api/v1/auth/users/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        }
    );

    const data = await response.json();

    if (!response.ok || !data.token) {
        throw new Error(data.message || "Error al iniciar sesión");
    }


    return data;
};
