
interface EmailPayload {
    token: string;
}

interface EmailResponse {
    success: boolean;
    message: string;
    email: string;
}
const API_URL = import.meta.env.VITE_API_URL;

export const getEmail = async (payload: EmailPayload): Promise<EmailResponse> => {
    const response = await fetch(
        `${API_URL}/api/v2/verification/users/mail`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${payload.token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }


    return data;
};

