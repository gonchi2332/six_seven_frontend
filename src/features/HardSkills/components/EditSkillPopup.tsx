import { useState } from "react";
import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";
import SkillLevelSelector from "./SkillLevelSelector";
import type { Skill } from "../types/skill.types";

interface EditSkillPopupProps {
    skill: Skill;
    onSubmit: (id: string | number, name: string, level: number) => Promise<void>;
    onClose: () => void;
    serverError?: string | null;
    isSubmitting?: boolean;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 py-4 z-50",
    formWrapper: "flex flex-col gap-4 px-6 sm:px-8 pb-2",
    buttonsWrapper: "flex gap-4 justify-center mt-2 px-6 sm:px-8 pb-6",
    label: "text-[18px] font-nunito text-surface",
    required: "text-white ml-0.5",
    serverError: "mx-6 sm:mx-8 mb-2 p-3 rounded-xl bg-red-400/10 border border-red-400 text-red-400 text-sm font-nunito text-center",
};

// Popup para modificar nivel de habilidad existente
const EditSkillPopup = ({ skill, onSubmit, onClose, serverError, isSubmitting = false }: EditSkillPopupProps) => {
    const [level, setLevel] = useState(skill.level);
    // Botón habilitado solo si hubo cambios
    const hasChanges = level !== skill.level;

    const handleSubmit = async () => {
        await onSubmit(skill.skill_id, skill.name, level);
    };

    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm max-h-[90vh] overflow-y-auto">
                <PopUpCard title={`Modificar: ${skill.name}`}>
                    {serverError && <div className={styles.serverError}>{serverError}</div>}
                    <div className={styles.formWrapper}>
                        <div>
                            <p className={styles.label}>
                                Nivel de conocimiento:<span className={styles.required}>*</span>
                            </p>
                            <SkillLevelSelector value={level} onChange={setLevel} />
                        </div>
                    </div>
                    <div className={styles.buttonsWrapper}>
                        <Button type="button" variant="secondary" onClick={onClose} fullWidth disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="button" variant="primary" onClick={handleSubmit} fullWidth disabled={isSubmitting || !hasChanges}>
                            {isSubmitting ? "Guardando..." : "Modificar"}
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default EditSkillPopup;