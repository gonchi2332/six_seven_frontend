import { type ReportPeriod } from '../services/reportService';

interface PeriodSelectorProps {
    period: ReportPeriod;
    onPeriodChange: (period: ReportPeriod) => void;
    isLoading?: boolean;
}

const styles = {
    container: "flex gap-2 p-1 bg-black/20 rounded-xl",
    button: "px-4 py-2 rounded-lg text-sm font-nunito font-semibold transition-all duration-200",
    buttonActive: "bg-[#90DDF0] text-[#07393C]",
    buttonInactive: "text-white/60 hover:text-white hover:bg-white/5",
};

const periods: { value: ReportPeriod; label: string }[] = [
    { value: 'day', label: 'Día' },
    { value: 'month', label: 'Mes' },
    { value: 'year', label: 'Año' },
];

const PeriodSelector = ({ period, onPeriodChange, isLoading = false }: PeriodSelectorProps) => {
    return (
        <div className={styles.container}>
            {periods.map((p) => (
                <button
                    key={p.value}
                    onClick={() => !isLoading && onPeriodChange(p.value)}
                    disabled={isLoading}
                    className={`${styles.button} ${
                        period === p.value ? styles.buttonActive : styles.buttonInactive
                    }`}
                >
                    {p.label}
                </button>
            ))}
        </div>
    );
};

export default PeriodSelector;