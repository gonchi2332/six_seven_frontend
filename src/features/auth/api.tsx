export interface RegisterRequest {
    username: string;
    password: string;
    names: string;
    paternalSurname: string;
}

export interface RegisterResponse {
    user: {
        id: number;
        username: string;
        state: string;
    };
    token: string;
}

export interface PersonalInfoRequest {
    phone: number;
    maternalSurname: string;
    address: string;
    residenceCountryId: number;
    contactEmail: string;
}

export interface PersonalInfoResponse {
    success: boolean;
    message: string;
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
        throw new Error(error.message || 'Error al registrar usuario');
    }

    return response.json();
};

// Paso 2: Registrar información personal (incluye apellido materno)
export const registerPersonalInfo = async (
    data: PersonalInfoRequest,
    token: string
): Promise<PersonalInfoResponse> => {
    const response = await fetch(`${API_URL}/api/v1/register/users/personal-info`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al registrar información personal');
    }

    return response.json();
};