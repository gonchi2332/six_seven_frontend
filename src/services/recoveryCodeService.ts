
interface ForgotPasswordParams {
    username: string;
    email: string;
}

interface VerifyCodeParams {
    username: string;
    code: string;
}

interface ForgotPasswordResponse {
    result: boolean;
    messageState: string;
}

interface VerifyCodeResponse {
    success: boolean;
    message: string;
}

interface ErrorResponse {
    error: string;
}


const API_URL = import.meta.env.VITE_API_URL;


export const requestRecoveryCode = async ({ username, email }: ForgotPasswordParams): Promise<ForgotPasswordResponse> => {
    const response = await fetch(`${API_URL}/api/v1/auth/users/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email }),
    });

    const data: ForgotPasswordResponse | ErrorResponse = await response.json();

    if (!response.ok) {
        throw new Error((data as ErrorResponse).error ?? "Error al solicitar el código de recuperación");
    }

    return data as ForgotPasswordResponse;
};

export const verifyRecoveryCode = async ({ username, code }: VerifyCodeParams): Promise<VerifyCodeResponse> => {
    const response = await fetch(`${API_URL}/api/v1/auth/users/verify-code`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, code }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error ?? "Error al verificar el código");
    }

    return data;
};
