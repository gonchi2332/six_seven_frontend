import Button from '../../components/Button';
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
    container: "min-h-screen w-full flex items-center justify-center p-4",
    modal: "bg-primary rounded-2xl w-full max-w-[400px] mx-auto overflow-hidden",
    header: "relative flex items-center justify-center p-6 border-b border-accent/20",
    title: "text-2xl font-bold text-surface font-inter text-center",
    closeButton: "absolute right-6 text-gray-400 hover:text-gray-600 transition-colors text-2xl",
    content: "p-8",
    field: "mb-6",
    label: "text-accent text-xs uppercase tracking-wide font-bold mb-2",
    value: "text-surface font-nunito text-lg font-medium",
    descriptionValue: "text-surface font-nunito text-base leading-relaxed whitespace-pre-wrap",
    dates: "flex gap-8 mb-6",
    dateField: "flex-1",
    buttonContainer: "flex gap-4 mt-8 pt-6 border-t border-accent/20",
};

const formatDateLong = (dateStr: string | null): string => {
    if (!dateStr) return 'Presente';
    
    try {
        // Extraer año y mes de YYYY-MM-DD
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
                <div className={styles.modal}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>Experiencia Laboral</h2>
                        <button onClick={onClose} className={styles.closeButton}>✕</button>
                    </div>
                    
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
                        
                        
                        
                        <div className={styles.buttonContainer}>
                            <Button 
                                variant="secondary" 
                                onClick={handleEdit}
                                fullWidth
                            >
                                Editar
                            </Button>
                            <Button 
                                variant="primary" 
                                onClick={handleDelete}
                                fullWidth
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkExperienceDetailModal;