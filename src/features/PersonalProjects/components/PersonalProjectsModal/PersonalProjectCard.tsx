import { ExternalLink, Calendar, FolderGit2, User } from "lucide-react";
import type { ProjectEntry } from "../../services/personalProjectsService";

interface ProjectCardProps {
    project: ProjectEntry;
    onView: (project: ProjectEntry) => void;
}

const styles = {
    card: "group relative bg-[#07393C] rounded-xl border border-[#2C666E] overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-[#90DDF0] hover:shadow-xl cursor-pointer",
    imageContainer: "relative h-36 sm:h-40 overflow-hidden bg-[#0A4D52]",
    image: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
    noImage: "w-full h-full flex items-center justify-center text-[#2C666E]",
    statusBadge: (status: string) => `absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold font-inter ${status === "Finalizado" ? "bg-green-500/90 text-white" :
        status === "En proceso" ? "bg-blue-500/90 text-white" :
            "bg-red-500/90 text-white"
        }`,
    content: "p-3 sm:p-4",
    title: "text-base sm:text-lg font-bold font-inter text-white mb-1 line-clamp-1",
    description: "text-xs sm:text-sm font-nunito text-white/70 mb-3 line-clamp-2",
    infoRow: "flex items-center gap-3 mb-2 text-xs text-white/60",
    infoItem: "flex items-center gap-1",
    links: "flex items-center gap-2 mt-3 pt-2 border-t border-[#2C666E] flex-wrap",
    link: "text-[#90DDF0] hover:text-white transition-colors flex items-center gap-1",
    linkText: "text-xs hidden sm:inline",
};

const ProjectCard = ({ project, onView }: ProjectCardProps) => {
    // Mostrar solo los primeros 3 enlaces en la tarjeta para no saturar
    const visibleLinks = project.links.slice(0, 3);

    return (
        <div className={styles.card} onClick={() => onView(project)}>
            <div className={styles.imageContainer}>
                {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.name} className={styles.image} />
                ) : (
                    <div className={styles.noImage}>
                        <FolderGit2 size={40} />
                    </div>
                )}
                <span className={styles.statusBadge(project.status)}>
                    {project.status}
                </span>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{project.name}</h3>

                <div className={styles.infoRow}>
                    <span className={styles.infoItem}>
                        <FolderGit2 size={12} />
                        <span>{project.topic}</span>
                    </span>
                    <span className={styles.infoItem}>
                        <User size={12} />
                        <span>{project.role}</span>
                    </span>
                    <span className={styles.infoItem}>
                        <Calendar size={12} />
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </span>
                </div>

                <p className={styles.description}>{project.description}</p>

                {project.links.length > 0 && (
                    <div className={styles.links}>
                        {visibleLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className={styles.link}
                                title={link.label}
                            >
                                <ExternalLink size={12} />
                                <span className={styles.linkText}>{link.label}</span>
                            </a>
                        ))}
                        {project.links.length > 3 && (
                            <span className="text-white/40 text-xs">
                                +{project.links.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;
