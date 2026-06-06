// ============================================
// TIPOS
// ============================================

export type ReportPeriod = 'day' | 'month' | 'year';

export interface ReportItem {
    interfaceId: number;
    interfaceName: string;
    timeAxis: string;
    totalViews: number;
}

export interface ReportsResponse {
    success: boolean;
    message: string;
    reports: ReportItem[];
}

// ============================================
// CONSTANTES
// ============================================

const API_URL = import.meta.env.VITE_API_URL;

const getToken = (): string | null => {
    return localStorage.getItem('token');
};

const getHeaders = (): HeadersInit => {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// ============================================
// SERVICIO
// ============================================

export const getUserReports = async (period: ReportPeriod): Promise<ReportsResponse> => {
    const response = await fetch(
        `${API_URL}/api/v1/reports/user?period=${period}`,
        {
            method: 'GET',
            headers: getHeaders(),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || 'Error al obtener reportes');
    }

    return data;
};