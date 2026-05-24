import type { WorkExperience } from '../../hooks/useWorkExperiences';

interface WorkExperienceItemProps {
    experience: WorkExperience;
    onView: (experience: WorkExperience) => void;
}

const styles = {
    container: "bg-black/30 rounded-xl border border-accent/20 hover:border-accent/50 transition-all overflow-hidden cursor-pointer hover:bg-white/10",
    content: "p-4",
    header: "mb-2",
    title: "text-surface font-inter font-bold text-base",
    companyRow: "flex items-center justify-left flex-wrap gap-2 mt-1",
    company: "text-accent font-nunito text-xs",
    date: "text-white/30 font-nunito text-xs",
    description: "text-surface font-nunito text-sm leading-relaxed line-clamp-2 mt-2",
    separator: "text-white/50 font-nunito text-xs"
};

const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return 'Presente';
    
    try {
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
                    <div className={styles.companyRow}>
                        <span className={styles.company}>{experience.company_name}</span> 
                        <span className={styles.separator}>|</span>
                        <span className={styles.date}>{startDateFormatted} — {endDateFormatted}</span>
                    </div>
                </div>
                <p className={styles.description}>{experience.description}</p>
            </div>
        </div>
    );
};

export default WorkExperienceItem;