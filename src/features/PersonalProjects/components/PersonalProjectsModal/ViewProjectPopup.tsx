import React from 'react';
import { Globe, Link as LinkIcon, BookOpen, Target, Tag } from 'lucide-react';
import PopUpCard from "../../../../components/PopUpCard";
import Button from "../../../../components/Button";
import type { ProjectEntry } from "../../services/personalProjectsService";

interface ViewProjectPopupProps {
    project: ProjectEntry;
    onBack: () => void;
}

const styles = {
    overlay: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto",
    container: "w-full max-w-2xl min-h-screen flex items-center justify-center p-4",
    content: "px-4 py-2 flex flex-col gap-4",
    headerSection: 'flex flex-col items-center gap-2 pb-3 border-b border-white/5',
    topicBadge: 'flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#90DDF0]/10 text-[#90DDF0] text-xs font-inter font-bold uppercase tracking-wider border border-[#90DDF0]/20',
    projectName: 'text-xl sm:text-2xl font-bold font-inter text-white text-center mt-1 leading-tight',

    imageWrapper: 'w-full overflow-hidden rounded-xl border border-white/10 bg-black/20',
    image: 'w-full h-48 sm:h-64 object-cover transform hover:scale-[1.02] transition-transform duration-300',

    row: 'flex items-start gap-4 py-3',
    iconBox: 'w-10 h-10 rounded-xl bg-[#2C666E]/40 flex items-center justify-center shrink-0 mt-0.5',
    icon: 'text-[#90DDF0] w-5 h-5',
    textGroup: 'flex flex-col flex-1 min-w-0', 
    label: 'text-[#90DDF0] text-xs uppercase tracking-wide font-bold mb-1',
    value: 'text-white font-nunito text-base sm:text-lg font-medium leading-snug break-words overflow-wrap-anywhere',
    descriptionValue: 'text-white font-nunito text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere',
    emptyValue: 'text-white/30 italic font-nunito text-base sm:text-lg break-words',
    metaGrid: "grid grid-cols-1 sm:grid-cols-2 gap-4",
    descriptionBox: "bg-black/20 rounded-xl p-4 border border-white/5 overflow-hidden",
    linksBox: "bg-black/20 rounded-xl p-4 border border-white/5 flex flex-col gap-3",
    linksContainer: 'flex flex-wrap gap-2.5 mt-1',
    linkButton: 'px-4 py-2 rounded-xl bg-[#2C666E]/30 text-white hover:bg-[#2C666E]/60 hover:text-[#90DDF0] transition-all font-nunito text-sm font-semibold border border-[#2C666E]/50 inline-flex items-center gap-2 shadow-sm',
    buttonContainer: "flex gap-3 px-6 pb-6",
    closeButton: "absolute right-4 top-4 text-white/50 hover:text-[#90DDF0] transition-colors p-1 hover:bg-white/10 rounded-lg",
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

const ViewProjectPopup = ({ project, onBack }: ViewProjectPopupProps) => {
    return (
        <div className={styles.overlay} onClick={onBack}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <PopUpCard title="Proyecto Personal">
                    <button onClick={onBack} className={styles.closeButton}>✕</button>
                    
                    <div className={styles.content}>
                        <div className={styles.headerSection}>
                            {project.topic && (
                                <div className={styles.topicBadge}>
                                    <Tag size={12} className="text-[#90DDF0]" />
                                    <span>{project.topic}</span>
                                </div>
                            )}
                            <h2 className={styles.projectName}>{project.name}</h2>
                        </div>
                        {project.imageUrl && (
                            <div className={styles.imageWrapper}>
                                <img
                                    src={project.imageUrl}
                                    alt={project.name}
                                    className={styles.image}
                                />
                            </div>
                        )}

                        <div className={styles.metaGrid}>
                            <InfoRow icon={Target} label="Estado del Proyecto" value={project.status} />
                            <InfoRow icon={Globe} label="Rol en el Proyecto" value={project.role} />
                        </div>
                        <div className={styles.descriptionBox}>
                            <InfoRow icon={BookOpen} label="Descripción" value={project.description} isDescription />
                        </div>
                        <div className={styles.linksBox}>
                            <div className="flex items-center gap-2 text-[#90DDF0]">
                                <LinkIcon size={16} />
                                <span className="text-xs uppercase tracking-wide font-bold">Enlaces de interés</span>
                            </div>
                            <div className={styles.linksContainer}>
                                {project.links && project.links.length > 0 ? (
                                    project.links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.linkButton}
                                        >
                                            <LinkIcon size={14} className="text-[#90DDF0]" />
                                            <span>{link.label}</span>
                                        </a>
                                    ))
                                ) : (
                                    <p className={styles.emptyValue}>No hay enlaces registrados para este proyecto</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <Button variant="secondary" onClick={onBack} fullWidth>
                            Atrás
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default ViewProjectPopup;