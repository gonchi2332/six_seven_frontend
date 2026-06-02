import Button from '../../../components/Button';
import PopUpCard from '../../../components/PopUpCard';
import type { WorkExperience } from '../../../hooks/useWorkExperiences';

interface WorkExperiencePopUpProps {
    isOpen: boolean;
    experience: WorkExperience | null;
    onClose: () => void;
    onEdit: (experience: WorkExperience) => void;
    onDelete: (id: number) => void;
    onView: (experience: WorkExperience) => void;
}

const styles = {
    // Estilos exactos del EducationPopup
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50 overflow-y-auto",
    buttonContainer: "flex gap-3 px-6 pb-6",
};

const WorkExperiencePopUp = ({
    isOpen,
    experience,
    onClose,
    onEdit,
    onDelete,
    onView
}: WorkExperiencePopUpProps) => {

    if (!isOpen || !experience) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className="w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
                <PopUpCard title={experience.position}>
                    <div className={styles.buttonContainer}>
                        <Button variant="primary" onClick={onClose} fullWidth>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={() => onDelete(experience.id)} fullWidth>
                            Eliminar
                        </Button>
                        <Button variant="secondary" onClick={() => onView(experience)} fullWidth>
                            Ver
                        </Button>
                        <Button variant="secondary" onClick={() => onEdit(experience)} fullWidth>
                            Modificar
                        </Button>

                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default WorkExperiencePopUp;
