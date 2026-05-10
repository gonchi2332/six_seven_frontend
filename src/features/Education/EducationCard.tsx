import type { EducationEntry } from "../../services/educationService";

interface Props {
    entry: EducationEntry;
    onView: (entry: EducationEntry) => void;
}

const styles = {
    container: "bg-black/30 rounded-xl border border-accent/20 hover:border-accent/50 transition-all overflow-hidden cursor-pointer hover:bg-white/10 flex flex-col justify-between min-h-[165px]",
    content: "p-5", 
    header: "mb-3", 
    title: "text-surface font-inter font-bold text-lg leading-tight line-clamp-2", 
    infoRow: "flex items-center justify-left flex-wrap gap-2 mt-1.5",
    academicLevel: "text-accent font-nunito text-sm font-semibold", 
    date: "text-white/40 font-nunito text-xs",
    institution: "text-surface font-nunito text-[15px] mt-3 italic line-clamp-1", 
    separator: "text-white/50 font-nunito text-xs",
};

const EducationCard = ({ entry, onView }: Props) => {
    const dateRange = entry.endDate
        ? `${entry.startDate} — ${entry.endDate}`
        : `${entry.startDate} — Presente`;

    return (
        <div className={styles.container} onClick={() => onView(entry)}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{entry.degree}</h3>
                    <div className={styles.infoRow}>
                        <span className={styles.academicLevel}>{entry.academicLevel}</span> 
                        <span className={styles.separator}>|</span>
                        <span className={styles.date}>{dateRange}</span>
                    </div>
                </div>
                <p className={styles.institution}>
                    {entry.institution}
                </p>
            </div>
        </div>
    );
};

export default EducationCard;