interface LoginPayload {
    username: string;
    password: string;
}

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

