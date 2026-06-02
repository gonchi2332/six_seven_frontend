import { useParams } from "react-router-dom";
import { useLinkedin } from "../../../hooks/useLinkedIn";
import LinkedInBadge from "./LinkedInBadge";

const styles = {
    wrapper: "flex-1 flex flex-col overflow-hidden",
    pageContent: "flex-1 flex items-start justify-center px-3 sm:px-6 py-1 overflow-y-auto",
    outerCard: "w-full max-w-[1400px] px-2 sm:px-6 lg:px-14 py-4 sm:py-8 flex flex-col",
    // El contenedor verde distintivo de tu app
    greenContainer: "rounded-2xl border border-[#2C666E] bg-[#07393C] px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-6",
    header: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
    title: "text-xl sm:text-2xl font-bold font-inter text-white flex items-center gap-3",

    // Contenido central (Badge)
    content: "flex flex-col items-center justify-center py-8 sm:py-12 bg-black/20 rounded-xl border border-white/10 min-h-[250px]",
    badgeWrapper: "w-full flex justify-center transform transition-all duration-300",

    // Estados
    loading: "text-white/70 font-nunito text-center py-12 bg-black/20 rounded-xl border border-white/10",
    emptyText: "text-white/50 font-nunito text-sm sm:text-base text-center max-w-xs",
};

const PublicLinkedIn = () => {
    const { username } = useParams<{ username: string }>();
    const { linkedinUser, isLoading } = useLinkedin(username || "");

    return (
        <div className={styles.wrapper}>
            <div className={styles.pageContent}>
                <div className={styles.outerCard}>
                    <div className={styles.greenContainer}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>
                                Perfil de LinkedIn
                            </h1>
                        </div>

                        {isLoading ? (
                            <div className={styles.loading}>Cargando LinkedIn...</div>
                        ) : (
                            <div className={styles.content}>
                                <div className={styles.badgeWrapper}>
                                    {linkedinUser ? (
                                        <LinkedInBadge username={linkedinUser} />
                                    ) : (
                                        <p className={styles.emptyText}>
                                            Aún no se vinculó una cuenta de LinkedIn
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicLinkedIn;
