import { Globe, Link as LinkIcon, BookOpen, Target, Tag } from 'lucide-react';
import PopUpCard from "../../../../components/PopUpCard";
import Button from "../../../../components/Button";
import type { ProjectEntry } from "../../services/personalProjectsService";

interface ViewProjectPopupProps {
    project: ProjectEntry;
    onBack: () => void;
}

const styles = {
    overlay: 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 z-50 overflow-y-auto py-4',
    container: 'min-h-screen flex items-center justify-center p-2',

    // Header con topic badge - más compacto
    headerSection: 'flex flex-col items-center gap-2 px-6 pt-4 pb-3 border-b border-white/10 bg-black/20',
    topicBadge: 'flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#90DDF0]/20 text-[#90DDF0] text-xs font-nunito font-semibold border border-[#90DDF0]/30',
    projectName: 'text-lg font-bold font-inter text-white text-center mt-1',

    // Imagen
    imageWrapper: 'px-6 pt-4 pb-2',
    image: 'w-full h-48 object-cover rounded-xl shadow-lg shadow-black/40',

    // Cuerpo con grid
    body: 'px-6 py-3',
    grid: 'grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0',
    sectionLabel: 'text-[#90DDF0] font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5 mb-1 mt-2 first:mt-0 col-span-full',
    divider: 'border-t border-white/10 my-1.5 col-span-full',

    // Filas de datos - más compactas
    row: 'flex items-start gap-2 py-1',
    iconBox: 'w-6 h-6 rounded-lg bg-[#2C666E]/50 flex items-center justify-center shrink-0 mt-0.5',
    icon: 'text-[#90DDF0] w-3 h-3',
    textGroup: 'flex flex-col flex-1',
    label: 'text-white/40 text-[8px] uppercase tracking-wide font-bold',
    value: 'text-white font-nunito text-xs mt-0 leading-snug',
    emptyValue: 'text-white/25 italic font-nunito text-xs mt-0',

    // Enlaces
    linksContainer: 'flex flex-wrap gap-2 mt-1',
    linkButton: 'px-3 py-1 rounded-full bg-[#2C666E]/60 text-white hover:bg-[#2C666E]/90 transition-colors font-nunito text-xs border border-[#90DDF0]/30 inline-flex items-center gap-1.5',

    // Footer - más compacto
    footer: 'px-6 py-3 border-t border-white/10 bg-black/20',
};


const InfoRow = ({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string | null | undefined;
}) => (
    <div className={styles.row}>
        <div className={styles.iconBox}>
            <Icon className={styles.icon} />
        </div>
        <div className={styles.textGroup}>
            <p className={styles.label}>{label}</p>
            {value ? (
                <p className={styles.value}>{value}</p>
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
                    {/* Header con topic y nombre */}
                    <div className={styles.headerSection}>
                        <div className={styles.topicBadge}>
                            <Tag size={12} />
                            <span>{project.topic}</span>
                        </div>
                        <h2 className={styles.projectName}>{project.name}</h2>
                    </div>

                    {/* Imagen del proyecto */}
                    {project.imageUrl && (
                        <div className={styles.imageWrapper}>
                            <img
                                src={project.imageUrl}
                                alt={project.name}
                                className={styles.image}
                            />
                        </div>
                    )}

                    <div className={styles.body}>
                        <div className={styles.grid}>
                            {/* Sección Descripción */}
                            <p className={styles.sectionLabel}>
                                <BookOpen size={12} /> Descripción
                            </p>
                            <InfoRow icon={BookOpen} label="Descripción" value={project.description} />

                            <div className={styles.divider} />

                            <p className={styles.sectionLabel}>
                                <Target size={12} /> Estado
                            </p>
                            <InfoRow icon={Target} label="Estado del proyecto" value={project.status} />

                            <div className={styles.divider} />

                            <p className={styles.sectionLabel}>
                                <Globe size={12} /> Rol
                            </p>
                            <InfoRow icon={Globe} label="Rol en el proyecto" value={project.role} />

                            <div className={styles.divider} />

                            <p className={styles.sectionLabel}>
                                <LinkIcon size={12} /> Enlaces
                            </p>
                            <div className={styles.row}>
                                <div className={styles.iconBox}>
                                    <LinkIcon className={styles.icon} />
                                </div>
                                <div className={styles.textGroup}>
                                    <p className={styles.label}>Enlaces del proyecto</p>
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
                                                    <LinkIcon size={10} />
                                                    {link.label}
                                                </a>
                                            ))
                                        ) : (
                                            <p className={styles.emptyValue}>No hay enlaces registrados</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <Button
                            variant="secondary"
                            onClick={onBack}
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

export default ViewProjectPopup;
