import { Eye, TrendingUp, BarChart3 } from 'lucide-react';
import type { ReportItem } from '../services/reportService';

interface StatsCardsProps {
    reports: ReportItem[];
}

const styles = {
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
    card: "bg-black/20 border border-white/10 rounded-xl p-5 hover:border-[#90DDF0]/30 transition-all duration-200",
    header: "flex items-center gap-3 mb-3",
    iconBox: "w-10 h-10 rounded-xl bg-[#2C666E]/40 flex items-center justify-center",
    icon: "text-[#90DDF0] w-5 h-5",
    title: "text-white/70 font-nunito text-sm font-medium",
    value: "text-white font-inter text-2xl font-bold mt-1",
    zeroValue: "text-white/30 font-inter text-2xl font-bold mt-1",
};

const getIcon = (interfaceName: string) => {
    switch (interfaceName) {
        case 'Perfil':
            return Eye;
        default:
            return BarChart3;
    }
};

const StatsCards = ({ reports }: StatsCardsProps) => {
    const totalViews = reports.reduce((sum, item) => sum + (item.totalViews || 0), 0);

    return (
        <>
            {/* Tarjeta de total general */}
            <div className={styles.grid}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <div className={styles.iconBox}>
                            <TrendingUp className={styles.icon} />
                        </div>
                    </div>
                    <p className={styles.title}>Total de visitas</p>
                    <p className={totalViews > 0 ? styles.value : styles.zeroValue}>
                        {totalViews.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Tarjetas por cada sección */}
            <div className={styles.grid}>
                {reports.map((item) => {
                    const Icon = getIcon(item.interfaceName);
                    const hasViews = (item.totalViews || 0) > 0;
                    
                    return (
                        <div key={item.interfaceId} className={styles.card}>
                            <div className={styles.header}>
                                <div className={styles.iconBox}>
                                    <Icon className={styles.icon} />
                                </div>
                            </div>
                            <p className={styles.title}>{item.interfaceName}</p>
                            <p className={hasViews ? styles.value : styles.zeroValue}>
                                {hasViews ? item.totalViews?.toLocaleString() : 'Sin visitas'}
                            </p>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default StatsCards;