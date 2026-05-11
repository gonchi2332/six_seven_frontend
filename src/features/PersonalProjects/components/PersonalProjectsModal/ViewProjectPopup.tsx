import PopUpCard from "../../../../components/PopUpCard";
import Button from "../../../../components/Button";
import type { ProjectEntry } from "../../services/personalProjectsService";

interface ViewProjectPopupProps {
    project: ProjectEntry;
    onBack: () => void; // Nueva función para regresar al modal de opciones
}

const STYLES = {
    HEADER_IMAGE: "w-full h-52 object-cover rounded-xl mb-6",
    TOPIC_BADGE: "inline-flex px-4 py-1 rounded-full bg-[#90DDF0] text-[#0a2e33] text-sm font-nunito font-semibold mb-5",
    CONTENT: "flex flex-col px-6 pb-2",
    SECTION: "flex flex-col mb-6",
    SECTION_BORDER: "border-l-2 border-[#90DDF0] pl-3",
    SECTION_TITLE: "text-[#90DDF0] font-inter font-bold text-base mb-2",
    SECTION_TEXT: "text-white/80 font-nunito text-sm leading-relaxed",
    LINKS_LIST: "flex flex-wrap gap-2 mt-1",
    LINK_BUTTON: "px-4 py-1.5 rounded-full bg-[#2C666E]/60 text-white hover:bg-[#2C666E]/90 transition-colors font-nunito text-sm border border-[#90DDF0]/30",
    FOOTER: "flex gap-3 px-6 pt-4 pb-5 mt-2",
};

const ViewProjectPopup = ({ project, onBack }: ViewProjectPopupProps) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="max-w-2xl w-full relative">
                <PopUpCard title={project.name}>
                    <div className={STYLES.CONTENT}>
                        <div className="flex justify-center">
                            <span className={STYLES.TOPIC_BADGE}>{project.topic}</span>
                        </div>

                        {project.imageUrl && (
                            <img
                                src={project.imageUrl}
                                alt={project.name}
                                className={STYLES.HEADER_IMAGE}
                            />
                        )}

                        <div className={STYLES.SECTION}>
                            <div className={STYLES.SECTION_BORDER}>
                                <h3 className={STYLES.SECTION_TITLE}>Descripción:</h3>
                                <p className={STYLES.SECTION_TEXT}>{project.description}</p>
                            </div>
                        </div>

                        <div className={STYLES.SECTION}>
                            <div className={STYLES.SECTION_BORDER}>
                                <h3 className={STYLES.SECTION_TITLE}>Estado:</h3>
                                <p className={STYLES.SECTION_TEXT}>{project.status}</p>
                            </div>
                        </div>

                        <div className={STYLES.SECTION}>
                            <div className={STYLES.SECTION_BORDER}>
                                <h3 className={STYLES.SECTION_TITLE}>Enlaces del proyecto:</h3>
                                <div className={STYLES.LINKS_LIST}>
                                    {project.links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={STYLES.LINK_BUTTON}
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={STYLES.FOOTER}>
                        <div className="flex-1">
                            <Button variant="secondary" onClick={onBack} fullWidth>
                                Atrás
                            </Button>
                        </div>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default ViewProjectPopup;
