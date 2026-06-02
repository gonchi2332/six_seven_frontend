import type { Certificate } from "../services/certificateService";

interface Props {
    certificate: Certificate;
    onClick: (certificate: Certificate) => void;
}

const styles = {
    container: "bg-black/30 rounded-xl border border-accent/20 hover:border-accent/50 transition-all overflow-hidden cursor-pointer hover:bg-white/10 flex flex-col",
    imageWrapper: "w-full h-32 sm:h-40 overflow-hidden bg-black/40 flex items-center justify-center",
    image: "w-full h-full object-cover",
    imageFallback: "text-white/30 font-nunito text-sm text-center px-2",
    content: "p-3 sm:p-4 flex flex-col gap-1",
    title: "text-surface font-inter font-bold text-sm sm:text-base leading-tight line-clamp-2",
    area: "text-accent font-nunito text-xs sm:text-sm font-semibold",
    date: "text-white/40 font-nunito text-xs",
};

const CertificateCard = ({ certificate, onClick }: Props) => {
    const formattedDate = certificate.issueDate ? new Date(certificate.issueDate + "T00:00:00").toLocaleDateString("es-ES", {
        day: "2-digit", month: "2-digit", year: "numeric",
    }) : "";

    return (
        <div className={styles.container} onClick={() => onClick(certificate)}>
            <div className={styles.imageWrapper}>
                {certificate.coverImage ? (<img src={certificate.coverImage} alt={certificate.title} className={styles.image} />) : (
                    <span className={styles.imageFallback}>Sin imagen</span>)}
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{certificate.title}</h3>
                <span className={styles.area}>{certificate.area}</span>
                <span className={styles.date}>{formattedDate}</span>
            </div>
        </div>
    );
};

export default CertificateCard;
