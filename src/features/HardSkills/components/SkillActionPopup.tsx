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
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 py-4 z-50",
    buttonsWrapper: "flex flex-row flex-wrap gap-2 justify-center mt-2 px-4 sm:px-6 pb-6",
};

// Popup de acciones para una habilidad (Ver, Modificar, Eliminar, Cancelar)
const SkillActionPopup = ({ skill, onView, onModify, onDelete, onClose }: Props) => {
    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <PopUpCard title={skill.name}>
                    <div className={styles.buttonsWrapper}>
                        <Button type="button" variant="primary" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="button" variant="primary" onClick={onDelete}>
                            Eliminar
                        </Button>
                        <Button type="button" variant="secondary" onClick={onView}>
                            Ver
                        </Button>
                        <Button type="button" variant="secondary" onClick={onModify}>
                            Modificar
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default SkillActionPopup;