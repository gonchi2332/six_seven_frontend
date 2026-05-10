import Button from '../../components/Button';
import PopUpCard from '../../components/PopUpCard';
import type { WorkExperience } from '../../hooks/useWorkExperiences';

interface WorkExperienceDetailModalProps {
    isOpen: boolean;
    experience: WorkExperience | null;
    onClose: () => void;
    onEdit: (experience: WorkExperience) => void;
    onDelete: (id: number) => void;
}

const styles = {
    overlay: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto",
    container: "min-h-screen flex items-center justify-center p-4",
    content: "px-6 py-4",
    field: "mb-5",
    label: "text-accent text-xs uppercase tracking-wide font-bold mb-1",
    value: "text-surface font-nunito text-base",
    descriptionValue: "text-surface font-nunito text-base leading-relaxed whitespace-pre-wrap",
    dates: "flex gap-6 mb-5",
    dateField: "flex-1",
    buttonContainer: "flex gap-3 px-6 pb-6",
    closeIcon: "absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors text-2xl cursor-pointer",
};

const formatDateLong = (dateStr: string | null): string => {
    if (!dateStr) return 'Presente';
    
    try {
        const year = dateStr.substring(0, 4);
        const monthStr = dateStr.substring(5, 7);
        const month = parseInt(monthStr, 10);
        
        if (isNaN(month) || month < 1 || month > 12) return dateStr;
        
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return `${monthNames[month - 1]} ${year}`;
    } catch {
        return dateStr;
    }
};

const WorkExperienceDetailModal = ({ isOpen, experience, onClose, onEdit, onDelete }: WorkExperienceDetailModalProps) => {
    if (!isOpen || !experience) return null;

    const startDateFormatted = formatDateLong(experience.start_date);
    const endDateFormatted = formatDateLong(experience.end_date);

    const handleEdit = () => {
        onClose();
        onEdit(experience);
    };

    const handleDelete = () => {
        onClose();
        onDelete(experience.id);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <PopUpCard title="Experiencia Laboral">
                    <button onClick={onClose} className={styles.closeIcon}>✕</button>
                    
                    <div className={styles.content}>
                        <div className={styles.dates}>
                            <div className={styles.dateField}>
                                <p className={styles.label}>Puesto</p>
                                <p className={styles.value}>{experience.position}</p>
                            </div>
                            
                            <div className={styles.dateField}>
                                <p className={styles.label}>Empresa</p>
                                <p className={styles.value}>{experience.company_name}</p>
                            </div>
                        </div>
                        
                        <div className={styles.field}>
                            <p className={styles.label}>Descripción</p>
                            <p className={styles.descriptionValue}>{experience.description}</p>
                        </div>
                        
                        <div className={styles.dates}>
                            <div className={styles.dateField}>
                                <p className={styles.label}>Fecha de inicio</p>
                                <p className={styles.value}>{startDateFormatted}</p>
                            </div>
                            <div className={styles.dateField}>
                                <p className={styles.label}>Fecha de fin</p>
                                <p className={styles.value}>{endDateFormatted}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.buttonContainer}>
                        <Button 
                            variant="secondary" 
                            onClick={handleEdit}
                            fullWidth
                        >
                            Modificar
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={handleDelete}
                            fullWidth
                        >
                            Eliminar
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default WorkExperienceDetailModal;