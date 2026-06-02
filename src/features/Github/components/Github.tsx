import { useState } from 'react';
import GithubInput from './GithubInput';
import GithubBadge from './GithubBadge';
import Button from '../../../components/Button';
import { useGitHub } from '../../../hooks/useGithub';

const styles = {
    wrapper: "flex-1 flex flex-col overflow-hidden",
    pageContent: "flex-1 flex items-start justify-center px-3 sm:px-6 py-1 overflow-y-auto",
    outerCard: "w-full max-w-[1400px] px-2 sm:px-6 lg:px-14 py-4 sm:py-8 flex flex-col",
    greenContainer: "rounded-2xl border border-[#2C666E] bg-[#07393C] px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-6",
    header: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
    title: "text-xl sm:text-2xl font-bold font-inter text-white flex items-center gap-2",
    content: "flex flex-col items-center justify-center py-8 sm:py-12 bg-black/20 rounded-xl border border-white/10 min-h-[250px]",
    emptyText: "text-white/50 font-nunito text-sm sm:text-base text-center max-w-xs mb-6",
    badgeWrapper: "w-full flex justify-center transform transition-all duration-300",
    overlay: "fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4",
    loading: "text-white/70 font-nunito text-center py-12 bg-black/20 rounded-xl border border-white/10",
};

interface Props {
    isPublic?: boolean;
}

function Github({ isPublic }: Props) {
    const [showModal, setShowModal] = useState(false);

    const token = localStorage.getItem("token") || "";
    const appUsername = localStorage.getItem("username") || "";

    const { githubUser, isLoading, saveProfile } = useGitHub(appUsername);

    const handleGitHubSuccess = async (username: string) => {
        if (!token) {
            alert("Sesión expirada");
            return;
        }
        const result = await saveProfile(username, token);
        if (result.success) {
            setShowModal(false);
        } else {
            alert(result.message);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.pageContent}>
                <div className={styles.outerCard}>
                    <div className={styles.greenContainer}>

                        <div className={styles.header}>
                            <h1 className={styles.title}>
                                Perfil de GitHub
                            </h1>

                            {githubUser && !isPublic && (
                                <Button variant="secondary" onClick={() => setShowModal(true)}>
                                    Cambiar Perfil
                                </Button>
                            )}
                        </div>

                        {isLoading && !showModal ? (
                            <div className={styles.loading}>Cargando información de GitHub...</div>
                        ) : (
                            <div className={styles.content}>
                                {!githubUser ? (
                                    <>
                                        {!isPublic && (
                                            <p className={styles.emptyText}>
                                                Vincula tu cuenta de GitHub para mostrar tu insignia profesional en tu portafolio público
                                            </p>
                                        )}
                                        {isPublic && (
                                            <p className={styles.emptyText}>
                                                Aún no se vinculó una cuenta de GitHub
                                            </p>
                                        )}
                                        {!isPublic && (
                                            <Button variant="primary" onClick={() => setShowModal(true)}>
                                                Vincular Ahora
                                            </Button>
                                        )}
                                    </>
                                ) : (
                                    <div className={styles.badgeWrapper}>
                                        <GithubBadge username={githubUser} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className={styles.overlay} onClick={() => setShowModal(false)}>
                    <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                        <GithubInput
                            onSuccess={handleGitHubSuccess}
                            onClose={() => setShowModal(false)}
                            initialValue={githubUser || ''}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Github;
