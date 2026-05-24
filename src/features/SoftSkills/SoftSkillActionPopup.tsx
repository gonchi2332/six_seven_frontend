import Button from "../../components/Button";
import PopUpCard from "../../components/PopUpCard";

interface Props {
    skillName: string;
    onView: () => void;
    onDelete: () => void;
    onClose: () => void;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 py-4 z-50",
    buttonsWrapper: "flex flex-row flex-wrap gap-2 justify-center mt-2 px-4 sm:px-6 pb-6",
};

const SoftSkillActionPopup = ({ skillName, onView, onDelete, onClose }: Props) => {
    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
                <PopUpCard title={skillName}>
                    <div className={styles.buttonsWrapper}>
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="button" variant="secondary" onClick={onDelete}>
                            Eliminar
                        </Button>
                        <Button type="button" variant="primary" onClick={onView}>
                            Ver
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default SoftSkillActionPopup;