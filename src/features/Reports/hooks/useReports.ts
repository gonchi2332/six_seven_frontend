import { useState, useCallback, useEffect } from 'react';
import { getUserReports, type ReportPeriod, type ReportsResponse } from '../services/reportService';

export const useReports = () => {
    const [reports, setReports] = useState<ReportsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [period, setPeriod] = useState<ReportPeriod>('day');

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

    useEffect(() => {
        fetchReports(period);
    }, [period, fetchReports]);

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