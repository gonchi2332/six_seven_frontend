import Button from "../../components/Button";
import PopUpCard from "../../components/PopUpCard";
import type { SoftSkillResultType } from "../../hooks/useAddSoftSkill";

interface SoftSkillResultPopupProps {
    type: SoftSkillResultType;
    onClose: () => void;
}

const CONTENT: Record<SoftSkillResultType, { title: string; message: string; subtitle?: string }> = {
    success: {
        title: "Habilidad Registrada",
        message: "La habilidad ya existe y ha sido añadida exitosamente.",
    },
    "not-found": {
        title: "Habilidad No Encontrada",
        message: "La habilidad no existe.",
        subtitle: "La sugerencia estará sujeta a evaluación.",
    },
};

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50",
    message: "text-[16px] font-nunito text-white text-center px-6 sm:px-8 pb-1",
    subtitle: "text-[13px] font-nunito text-white/60 text-center px-6 sm:px-8 pb-4",
    buttonsWrapper: "flex gap-4 justify-center mt-2 px-6 sm:px-8 pb-6",
};

const SoftSkillResultPopup = ({ type, onClose }: SoftSkillResultPopupProps) => {
    const { title, message, subtitle } = CONTENT[type];
    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm">
                <PopUpCard title={title}>
                    <p className={styles.message}>{message}</p>
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                    <div className={styles.buttonsWrapper}>
                        <Button type="button" variant="primary" onClick={onClose} fullWidth>
                            Aceptar
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default SoftSkillResultPopup;