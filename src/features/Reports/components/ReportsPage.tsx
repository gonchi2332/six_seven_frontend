import { useReports } from '../hooks/useReports';
import PeriodSelector from './PeriodSelector';
import StatsCards from './StatsCards';

const styles = {
    wrapper: "flex-1 flex flex-col overflow-hidden",
    pageContent: "flex-1 flex items-start justify-center px-3 sm:px-6 py-1 overflow-y-auto",
    outerCard: "w-full max-w-[1400px] px-2 sm:px-6 lg:px-14 py-4 sm:py-8 flex flex-col",
    greenContainer: "rounded-2xl border border-[#2C666E] bg-[#07393C] px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-6",
    header: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
    title: "text-xl sm:text-2xl font-bold font-inter text-white",
    loading: "text-white/70 font-nunito text-center py-12 bg-black/20 rounded-xl border border-white/10",
    error: "text-red-400 text-center py-12 bg-red-500/10 rounded-xl border border-red-500",
    empty: "text-white/50 font-nunito text-center py-12 bg-black/20 rounded-xl border border-white/10",
};

const ReportsPage = () => {
    const { reports, isLoading, error, period, changePeriod } = useReports();

    return (
        <div className={styles.wrapper}>
            <div className={styles.pageContent}>
                <div className={styles.outerCard}>
                    <div className={styles.greenContainer}>
                        
                        <div className={styles.header}>
                            <h1 className={styles.title}>Reportes Analíticos</h1>
                            <PeriodSelector 
                                period={period} 
                                onPeriodChange={changePeriod}
                                isLoading={isLoading}
                            />
                        </div>

                        {isLoading ? (
                            <div className={styles.loading}>Cargando reportes...</div>
                        ) : error ? (
                            <div className={styles.error}>{error}</div>
                        ) : !reports?.reports?.length ? (
                            <div className={styles.empty}>No hay datos disponibles</div>
                        ) : (
                            <StatsCards reports={reports.reports} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;