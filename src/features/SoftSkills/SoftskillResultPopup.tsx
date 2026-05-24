import Button from "../../components/Button";
import PopUpCard from "../../components/PopUpCard";
import type { SoftSkillResultType } from "../../hooks/useAddSoftSkill";

interface SoftSkillResultPopupProps {
    type: SoftSkillResultType;
    onClose: () => void;
}

const CONTENT: Record<SoftSkillResultType, { title: string; message: string }> = {
    success: {
        title: "Habilidad Registrada",
        message: "La habilidad ha sido añadida exitosamente.",
    },
    "not-found": {
        title: "Habilidad No Reconocida",
        message: "La habilidad introducida no corresponde a ninguna habilidad blanda reconocible dentro del campo de la informática, ciencias de la computación y desarrollo de software.",
    },
};

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 py-4 z-50",
    message: "text-[15px] font-nunito text-white text-center px-6 sm:px-8 pb-4",
    buttonsWrapper: "flex gap-4 justify-center mt-2 px-6 sm:px-8 pb-6",
};

const SoftSkillResultPopup = ({ type, onClose }: SoftSkillResultPopupProps) => {
    const { title, message } = CONTENT[type];
    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm max-h-[90vh] overflow-y-auto">
                <PopUpCard title={title}>
                    <p className={styles.message}>{message}</p>
                    <div className={styles.buttonsWrapper}>
                        <Button type="button" variant="primary" onClick={onClose} fullWidth>
                            Registrar
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default SoftSkillResultPopup;