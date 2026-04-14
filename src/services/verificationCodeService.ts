interface VerifyParams {
    username: string;
    code: string;
    token?: string | null;
}

interface SendCodeParams {
    username: string;
    targetMail: string;
    token?: string | null;
}

interface VerifyResponse {
    success: boolean;
    message: string;
}
const API_URL = import.meta.env.VITE_API_URL;


export const verify = async ({ username, code, token }: VerifyParams): Promise<VerifyResponse> => {
    const url = `${API_URL}/api/v1/verification/users/compare-verification-code?username=${username}&currentCode=${code}`;

    const headers: HeadersInit = {};
    if (token) {
        headers["Authorization"] = `Authorization ${token}`;
    }

    const response = await fetch(url, {
        method: "PATCH",
        headers,
    });

    const data: VerifyResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};

export const sendVerificationCode = async ({ username, targetMail, token }: SendCodeParams): Promise<VerifyResponse> => {
    const url = `${API_URL}/api/v1/verification/users/verification-code?username=${username}&targetMail=${targetMail}`;

    const headers: HeadersInit = {};
    if (token) {
        headers["Authorization"] = `Authorization ${token}`;
    }

    const response = await fetch(url, {
        method: "POST",
        headers,
    });

    const data: VerifyResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};
