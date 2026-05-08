import type { EducationEntry } from "../../services/educationService";

interface Props {
    entry: EducationEntry;
    onView: (entry: EducationEntry) => void;
    onEdit: (entry: EducationEntry) => void;
    onDelete: (entry: EducationEntry) => void;
}

const styles = {
    card: "flex flex-col justify-between p-3 sm:p-4 rounded-xl border border-white/10 bg-black/30 hover:border-[#90DDF0]/40 transition-all gap-3 min-h-[160px]",
    top: "flex flex-col gap-1",
    title: "text-white font-inter font-semibold text-[14px] sm:text-[15px] leading-tight line-clamp-2",
    year: "text-white/50 font-nunito text-[11px] sm:text-[12px]",
    degree: "text-white/70 font-nunito text-[12px] sm:text-[13px] line-clamp-2",
    buttons: "flex flex-wrap gap-1",
    btnVer: "px-2 py-1 rounded-lg border border-white/20 text-white font-nunito text-[11px] sm:text-xs hover:border-[#90DDF0] hover:text-[#90DDF0] transition-colors",
    btnModificar: "px-2 py-1 rounded-lg border border-white/20 text-white font-nunito text-[11px] sm:text-xs hover:border-[#90DDF0] hover:text-[#90DDF0] transition-colors",
    btnEliminar: "px-2 py-1 rounded-lg border border-red-500/40 text-red-400 font-nunito text-[11px] sm:text-xs hover:border-red-400 hover:text-red-300 transition-colors",
};

const EducationCard = ({ entry, onView, onEdit, onDelete }: Props) => {
    const dateRange = entry.endDate
        ? `${entry.startDate} - ${entry.endDate}`
        : `${entry.startDate} - Presente`;

    return (
        <div className={styles.card}>
            <div className={styles.top}>
                <span className={styles.title}>{entry.degree}</span>
                <span className={styles.year}>{dateRange}</span>
                <span className={styles.degree}>{entry.academicLevel}</span>
            </div>
            <div className={styles.buttons}>
                <button type="button" onClick={() => onView(entry)} className={styles.btnVer}>Ver</button>
                <button type="button" onClick={() => onEdit(entry)} className={styles.btnModificar}>Modificar</button>
                <button type="button" onClick={() => onDelete(entry)} className={styles.btnEliminar}>Eliminar</button>
            </div>
        </div>
    );
};

export default EducationCard;