// hooks/useReports.ts
import { useState, useCallback, useEffect } from 'react';
import { getUserReports, type ReportPeriod, type ReportsResponse, type ReportItem } from '../services/reportService';

// Deduplica items por interfaceId, sumando totalViews en caso de duplicados
const deduplicateReports = (items: ReportItem[]): ReportItem[] => {
    const map = new Map<number, ReportItem>();
    for (const item of items) {
        const existing = map.get(item.interfaceId);
        if (existing) {
            map.set(item.interfaceId, {
                ...existing,
                totalViews: (existing.totalViews || 0) + (item.totalViews || 0),
            });
        } else {
            map.set(item.interfaceId, { ...item });
        }
    }
    return Array.from(map.values());
};

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
            // Deduplicar para evitar tarjetas repetidas si el backend devuelve duplicados
            const deduped: ReportsResponse = {
                ...data,
                reports: deduplicateReports(data.reports ?? []),
            };
            setReports(deduped);
            return deduped;
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