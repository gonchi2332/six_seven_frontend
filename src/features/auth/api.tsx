export interface RegisterRequest {
    username: string;
    password: string;
    names: string;
    paternalSurname: string;
    maternalSurname?: string;
}

export interface RegisterResponse {
    user: {
        id: number;
        username: string;
        state: string;
    };
    token: string;
}





const API_URL = import.meta.env.VITE_API_URL || 'https://six-seven-backend.onrender.com';

// Paso 1: Registrar credenciales
export const registerUser = async (
    data: RegisterRequest
): Promise<RegisterResponse> => {
    const response = await fetch(`${API_URL}/api/v1/auth/users/credentials-info`, {
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

