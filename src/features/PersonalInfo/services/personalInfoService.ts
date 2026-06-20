import { fetchWithAuth } from "../../../services/refreshToken";

// Estructura de la respuesta de información personal
export interface PersonalInfoResponse {
    username: string;
    is_new: boolean;
    state: string;
    phone_number: string | null;
    names: string;
    first_surname: string;
    second_surname: string | null;
    residence_city_name: string | null;
    residence_country_name: string | null;
    contact_email: string | null;
    main_registration_email: string;
    profile_picture: string | null;
}

const API_URL = import.meta.env.VITE_API_URL;

// Obtener información personal del usuario autenticado (requiere token)
export const getPersonalInfo = async (username: string): Promise<PersonalInfoResponse> => {
    const response = await fetchWithAuth(
        `${API_URL}/api/v2/register/users/personal-info?username=${username}`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    const data = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al obtener la información");
    }
    return data.userPersonalInfo;
};

// Obtener información personal pública (portafolio visible, no requiere token)
export const fetchPublicPersonalInfo = async (username: string): Promise<PersonalInfoResponse> => {
    const response = await fetch(`${API_URL}/api/v2/register/users/${username}/personal-info`);
    const data = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al obtener la información");
    }
    return data.userPersonalInfo;
};

// Actualizar información personal (requiere token, soporta FormData para imágenes)
export const updatePersonalInfo = async (formData: FormData) => {
    console.log("Enviando datos al backend:");
    console.log(JSON.stringify(Object.fromEntries(formData)));
    const response = await fetchWithAuth(`${API_URL}/api/v2/register/users/personal-info`, {
        method: "PUT",
        body: formData,
    }, true); // true = es FormData, no agregar Content-Type application/json

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar");
    }

    return data;
};

