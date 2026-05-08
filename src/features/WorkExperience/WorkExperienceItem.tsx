import type { WorkExperience } from '../../hooks/useWorkExperiences';

interface WorkExperienceItemProps {
    experience: WorkExperience;
    onView: (experience: WorkExperience) => void;
}

const styles = {
    container: "bg-white/5 rounded-xl border border-accent/20 hover:border-accent/50 transition-all overflow-hidden cursor-pointer hover:bg-white/10",
    content: "p-4",
    header: "mb-2",
    title: "text-surface font-inter font-bold text-base",
    subtitle: "text-accent font-nunito text-xs",
    description: "text-surface font-nunito text-sm leading-relaxed line-clamp-2",
    date: "text-white/30 font-nunito text-xs mt-2",
};

const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return 'Presente';
    
    try {
        // Extraer año y mes de YYYY-MM-DD
        const year = dateStr.substring(0, 4);
        const monthStr = dateStr.substring(5, 7);
        const month = parseInt(monthStr, 10);
        
        if (isNaN(month) || month < 1 || month > 12) return dateStr;
        
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return `${monthNames[month - 1]} ${year}`;
    } catch {
        return dateStr;
    }
};

const WorkExperienceItem = ({ experience, onView }: WorkExperienceItemProps) => {
    const startDateFormatted = formatDate(experience.start_date);
    const endDateFormatted = formatDate(experience.end_date);

    const handleClick = () => {
        onView(experience);
    };

    return (
        <div className={styles.container} onClick={handleClick}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{experience.position}</h3>
                    <p className={styles.subtitle}>{experience.company_name}</p>
                </div>
                <p className={styles.description}>{experience.description}</p>
                <div className={styles.date}>
                    {startDateFormatted} — {endDateFormatted}
                </div>
            </div>
        </div>
    );
};

export default WorkExperienceItem;