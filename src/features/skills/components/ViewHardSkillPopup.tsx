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
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50",
    body: "flex flex-col gap-4 px-6 sm:px-8 pb-2",
    field: "flex flex-col gap-1",
    label: "text-[13px] font-nunito text-white/50",
    value: "text-[15px] font-nunito text-white font-semibold",
    divider: "border-t border-white/10",
    levelLabel: "text-[13px] font-nunito text-[#90DDF0] font-semibold text-center",
    buttonsWrapper: "flex justify-center mt-2 px-6 sm:px-8 pb-6",
};

const ViewHardSkillPopup = ({ skill, onClose }: Props) => {
    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm">
                <PopUpCard title="Habilidad Técnica">
                    <div className={styles.body}>
                        <div className={styles.field}>
                            <span className={styles.label}>Nombre</span>
                            <span className={styles.value}>{skill.name}</span>
                        </div>
                        <div className={styles.divider} />
                        <div className={styles.field}>
                            <span className={styles.label}>Nivel de conocimiento</span>
                            <LevelBars level={skill.level} size="md" />
                            <span className={styles.levelLabel}>
                                {skill.level} - {LEVEL_LABELS[skill.level] ?? ""}
                            </span>
                        </div>
                    </div>
                    <div className={styles.buttonsWrapper}>
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