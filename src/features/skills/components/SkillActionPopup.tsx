import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";
import type { Skill } from "../types/skill.types";

interface Props {
    skill: Skill;
    onView: () => void;
    onModify: () => void;
    onDelete: () => void;
    onClose: () => void;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50",
    buttonsWrapper: "flex flex-row gap-2 justify-center mt-2 px-4 sm:px-6 pb-6",
};

const SkillActionPopup = ({ skill, onView, onModify, onDelete, onClose }: Props) => {
    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-lg sm:max-w-xl">
                <PopUpCard title={skill.name}>
                    <div className={styles.buttonsWrapper}>
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="button" variant="secondary" onClick={onView}>
                            Ver
                        </Button>
                        <Button type="button" variant="primary" onClick={onModify}>
                            Modificar
                        </Button>
                        <Button type="button" variant="primary" onClick={onDelete}>
                            Eliminar
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default SkillActionPopup;