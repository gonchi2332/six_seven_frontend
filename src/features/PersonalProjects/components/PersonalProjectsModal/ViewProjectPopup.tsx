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

    // Filas de datos - sin label repetido
    row: 'flex items-start py-1',
    textGroup: 'flex flex-col flex-1',
    value: 'text-white font-nunito text-xs mt-0 leading-snug',
    emptyValue: 'text-white/25 italic font-nunito text-xs mt-0',

    // Enlaces
    linksContainer: 'flex flex-wrap gap-2 mt-1',
    linkButton: 'px-3 py-1 rounded-full bg-[#2C666E]/60 text-white hover:bg-[#2C666E]/90 transition-colors font-nunito text-xs border border-[#90DDF0]/30 inline-flex items-center gap-1.5',

    // Footer - más compacto
    footer: 'px-6 py-3 border-t border-white/10 bg-black/20',
};

// Datos de las secciones
const SECTIONS = [
    { id: 'description', icon: BookOpen, title: 'Descripción', valueKey: 'description' as const },
    { id: 'status', icon: Target, title: 'Estado', valueKey: 'status' as const },
    { id: 'role', icon: Globe, title: 'Rol', valueKey: 'role' as const },
] as const;

// InfoRow sin label (solo muestra el valor)
const InfoRow = ({ value }: { value: string | null | undefined }) => (
    <div className={styles.row}>
        <div className={styles.textGroup}>
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
                            {/* Renderizar secciones dinámicamente */}
                            {SECTIONS.map((section, index) => (
                                <React.Fragment key={section.id}>
                                    {index > 0 && <div className={styles.divider} />}
                                    <p className={styles.sectionLabel}>
                                        <section.icon size={12} /> {section.title}
                                    </p>
                                    <InfoRow value={project[section.valueKey]} />
                                </React.Fragment>
                            ))}

                            <div className={styles.divider} />

                            {/* Sección de Enlaces */}
                            <p className={styles.sectionLabel}>
                                <LinkIcon size={12} /> Enlaces
                            </p>
                            <div className={styles.row}>
                                <div className={styles.textGroup}>
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
