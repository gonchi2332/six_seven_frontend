import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";
import LevelBars from "../../../components/LevelBars/Levelbars ";
import type { Skill } from "../types/skill.types";

interface Props {
    skill: Skill;
    onClose: () => void;
}

const LEVEL_LABELS: Record<number, string> = {
    1: "Básico",
    2: "Elemental",
    3: "Intermedio",
    4: "Avanzado",
    5: "Excelente",
};

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 py-4 z-50",
    content: "px-4 sm:px-6 pb-5 pt-0 flex flex-col gap-4 sm:gap-5",
    field: "flex flex-col gap-1",
    label: "text-accent text-xs uppercase tracking-wide font-bold mb-1",
    value: "text-surface font-nunito text-sm sm:text-base",
    divider: "border-t border-white/10",
    levelLabel: "text-[13px] font-nunito text-[#90DDF0] font-semibold text-center",
    buttonContainer: "flex gap-3 px-4 sm:px-6 pb-6",
};

const ViewHardSkillPopup = ({ skill, onClose }: Props) => {
    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm my-4 max-h-[90vh] overflow-y-auto">
                <PopUpCard title="Habilidad Técnica">
                    <div className={styles.content}>
                        <div className={styles.field}>
                            <p className={styles.label}>Nombre</p>
                            <p className={styles.value}>{skill.name}</p>
                        </div>
                        <div className={styles.divider} />
                        <div className={styles.field}>
                            <p className={styles.label}>Nivel de conocimiento</p>
                            <LevelBars level={skill.level} size="md" />
                            <span className={styles.levelLabel}>
                                {skill.level} - {LEVEL_LABELS[skill.level] ?? ""}
                            </span>
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <Button type="button" variant="secondary" onClick={onClose} fullWidth>
                            Atrás
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default ViewHardSkillPopup;