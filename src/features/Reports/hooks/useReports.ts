// hooks/useReports.ts
import { useState, useCallback, useEffect } from 'react';
import { getUserReports, type ReportPeriod, type ReportsResponse } from '../services/reportService';

// Hook para manejar reportes de usuario
export const useReports = () => {
    const [reports, setReports] = useState<ReportsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [period, setPeriod] = useState<ReportPeriod>('day');

    // Obtener reportes para el periodo seleccionado
    const fetchReports = useCallback(async (selectedPeriod: ReportPeriod) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getUserReports(selectedPeriod);
            setReports(data);
            return data;
        } catch (err: any) {
            setError(err.message || 'Error al cargar reportes');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Cargar reportes cuando cambia el periodo
    useEffect(() => {
        fetchReports(period);
    }, [period, fetchReports]);

    // Cambiar el periodo activo
    const changePeriod = (newPeriod: ReportPeriod) => {
        setPeriod(newPeriod);
    };

    return {
        reports,
        isLoading,
        error,
        period,
        changePeriod,
        refetch: () => fetchReports(period),
    };
};