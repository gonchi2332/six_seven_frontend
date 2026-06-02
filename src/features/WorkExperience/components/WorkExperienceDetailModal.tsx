import { Briefcase, Building, FileText, Calendar } from 'lucide-react';
import Button from '../../components/Button';
import PopUpCard from '../../components/PopUpCard';
import type { WorkExperience } from '../../hooks/useWorkExperiences';

interface WorkExperienceDetailModalProps {
    isOpen: boolean;
    experience: WorkExperience | null;
    onClose: () => void;
}

const styles = {
    overlay: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto",
    container: "w-full max-w-2xl min-h-screen flex items-center justify-center p-4",
    content: "px-6 py-4",
    
    // Filas de datos
    row: 'flex items-start gap-4 py-3',
    iconBox: 'w-10 h-10 rounded-xl bg-[#2C666E]/40 flex items-center justify-center shrink-0 mt-0.5',
    icon: 'text-[#90DDF0] w-5 h-5',
    textGroup: 'flex flex-col flex-1 min-w-0', // min-w-0 permite que el texto se rompa
    label: 'text-[#90DDF0] text-xs uppercase tracking-wide font-bold mb-1',
    value: 'text-white font-nunito text-base sm:text-lg font-medium leading-snug break-words overflow-wrap-anywhere',
    descriptionValue: 'text-white font-nunito text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere',
    emptyValue: 'text-white/30 italic font-nunito text-base sm:text-lg break-words',
    
    // Grid para fechas
    dates: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2",
    
    // Descripción con fondo sutil
    descriptionBox: "bg-black/20 rounded-xl p-4 mt-2 border border-white/5 overflow-hidden",
    
    buttonContainer: "flex gap-3 px-6 pb-6",
    closeButton: "absolute right-4 top-4 text-white/50 hover:text-[#90DDF0] transition-colors p-1 hover:bg-white/10 rounded-lg",
};

const formatDateLong = (dateStr: string | null): string => {
    if (!dateStr) return 'Presente';
    
    try {
        const year = dateStr.substring(0, 4);
        const monthStr = dateStr.substring(5, 7);
        const dayStr = dateStr.substring(8, 10);
        const month = parseInt(monthStr, 10);
        const day = parseInt(dayStr, 10);
        
        if (isNaN(month) || month < 1 || month > 12) return dateStr;
        
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        if (!isNaN(day) && day >= 1 && day <= 31) {
            return `${day} de ${monthNames[month - 1]} de ${year}`;
        }
        return `${monthNames[month - 1]} ${year}`;
    } catch {
        return dateStr;
    }
};

const InfoRow = ({
    icon: Icon,
    label,
    value,
    isDescription = false,
}: {
    icon: React.ElementType;
    label: string;
    value: string | null | undefined;
    isDescription?: boolean;
}) => (
    <div className={styles.row}>
        <div className={styles.iconBox}>
            <Icon className={styles.icon} />
        </div>
        <div className={styles.textGroup}>
            <p className={styles.label}>{label}</p>
            {value ? (
                <p className={isDescription ? styles.descriptionValue : styles.value}>{value}</p>
            ) : (
                <p className={styles.emptyValue}>No especificado</p>
            )}
        </div>
    </div>
);

const WorkExperienceDetailModal = ({ isOpen, experience, onClose }: WorkExperienceDetailModalProps) => {
    if (!isOpen || !experience) return null;

    const startDateFormatted = formatDateLong(experience.start_date);
    const endDateFormatted = formatDateLong(experience.end_date);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <PopUpCard title="Experiencia Laboral">
                    <button onClick={onClose} className={styles.closeButton}>✕</button>
                    
                    <div className={styles.content}>
                        {/* Puesto y Empresa - Grid responsivo */}
                        <div className={styles.dates}>
                            <InfoRow icon={Briefcase} label="Puesto" value={experience.position} />
                            <InfoRow icon={Building} label="Empresa" value={experience.company_name} />
                        </div>
                        
                        {/* Fechas con día */}
                        <div className={styles.dates}>
                            <InfoRow icon={Calendar} label="Fecha de inicio" value={startDateFormatted} />
                            <InfoRow icon={Calendar} label="Fecha de finalización" value={endDateFormatted} />
                        </div>
                        
                        {/* Descripción - con manejo de texto largo */}
                        <div className={styles.descriptionBox}>
                            <InfoRow icon={FileText} label="Descripción" value={experience.description} isDescription />
                        </div>
                    </div>
                    
                    <div className={styles.buttonContainer}>
                        <Button 
                            variant="secondary" 
                            onClick={onClose}
                            fullWidth
                        >
                            Atrás
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default WorkExperienceDetailModal;