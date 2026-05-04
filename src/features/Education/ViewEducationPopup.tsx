import Button from "../../components/Button/Button";
import PopUpCard from "../../components/PopUpCard/PopUpCard";
import type { EducationEntry } from "../../services/educationService";

interface Props {
    entry: EducationEntry;
    onClose: () => void;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50",
    body: "flex flex-col gap-3 px-6 sm:px-8 pb-2",
    row: "flex flex-col sm:flex-row sm:gap-6 gap-3",
    field: "flex flex-col gap-1 flex-1",
    label: "text-[13px] font-nunito text-white/50",
    value: "text-[15px] font-nunito text-white font-semibold",
    divider: "border-t border-white/10",
    buttonsWrapper: "flex justify-center mt-2 px-6 sm:px-8 pb-6",
};

const ViewEducationPopup = ({ entry, onClose }: Props) => {
    const dateRange = entry.endDate
        ? `${entry.startDate} - ${entry.endDate}`
        : `${entry.startDate} - Presente`;

    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm">
                <PopUpCard title="Experiencia Académica">
                    <div className={styles.body}>
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <span className={styles.label}>Institución</span>
                                <span className={styles.value}>{entry.institution}</span>
                            </div>
                            <div className={styles.field}>
                                <span className={styles.label}>Grado</span>
                                <span className={styles.value}>{entry.degree}</span>
                            </div>
                        </div>
                        <div className={styles.divider} />
                        <div className={styles.field}>
                            <span className={styles.label}>Título</span>
                            <span className={styles.value}>{entry.title}</span>
                        </div>
                        <div className={styles.divider} />
                        <div className={styles.field}>
                            <span className={styles.label}>Período</span>
                            <span className={styles.value}>{dateRange}</span>
                        </div>
                    </div>
                    <div className={styles.buttonsWrapper}>
                        <Button type="button" variant="secondary" onClick={onClose} fullWidth>
                            Cerrar
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default ViewEducationPopup;