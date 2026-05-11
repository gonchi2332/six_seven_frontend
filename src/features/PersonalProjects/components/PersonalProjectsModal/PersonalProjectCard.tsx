// PersonalProjectCard.tsx (versión simplificada)
import type { ProjectEntry } from "../../services/personalProjectsService";

interface ProjectCardProps {
    project: ProjectEntry;
    onClick: (project: ProjectEntry) => void;
}

const STYLES = {
    CARD: "bg-[#0a2e33] rounded-lg overflow-hidden border border-[#2C666E] hover:border-[#90DDF0] transition-all cursor-pointer hover:shadow-lg hover:scale-[1.02]",
    IMAGE: "w-full h-32 object-cover",
    CONTENT: "p-3",
    TITLE: "text-white font-semibold text-base mb-1 truncate",
    TOPIC: "text-[#90DDF0] text-xs mb-2",
    DESCRIPTION: "text-white/60 text-sm line-clamp-2",
    STATUS: (status: string) => `inline-block px-2 py-0.5 rounded-full text-xs mt-2 ${status === "Finalizado" ? "bg-green-500/20 text-green-400" :
            status === "Cancelado" ? "bg-red-500/20 text-red-400" :
                "bg-yellow-500/20 text-yellow-400"
        }`,
};

const PersonalProjectCard = ({ project, onClick }: ProjectCardProps) => {
    return (
        <div className={STYLES.CARD} onClick={() => onClick(project)}>
            {project.imageUrl && (
                <img src={project.imageUrl} alt={project.name} className={STYLES.IMAGE} />
            )}
            <div className={STYLES.CONTENT}>
                <h3 className={STYLES.TITLE}>{project.name}</h3>
                <p className={STYLES.TOPIC}>{project.topic}</p>
                <p className={STYLES.DESCRIPTION}>{project.description}</p>
                <span className={STYLES.STATUS(project.status)}>{project.status}</span>
            </div>
        </div>
    );
};

export default PersonalProjectCard;