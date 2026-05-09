import Button from "../../components/Button";
import PopUpCard from "../../components/PopUpCard";

interface Props {
    skillName: string;
    onDelete: () => void;
    onClose: () => void;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50",
    buttonsWrapper: "flex gap-4 justify-center mt-2 px-6 sm:px-8 pb-6",
};

const SoftSkillActionPopup = ({ skillName, onDelete, onClose }: Props) => {
    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm">
                <PopUpCard title={`Habilidad Blanda: ${skillName}`}>
                    <div className={styles.buttonsWrapper}>
                        <Button type="button" variant="secondary" onClick={onClose} fullWidth>
                            Cancelar
                        </Button>
                        <Button type="button" variant="primary" onClick={onDelete} fullWidth>
                            Eliminar
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default SoftSkillActionPopup;