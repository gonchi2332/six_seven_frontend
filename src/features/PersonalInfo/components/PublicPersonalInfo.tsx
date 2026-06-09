import { useEffect } from 'react';
import { usePersonalInfo } from '../../../hooks/useNavbarInfo';
import { MapPin, Mail, Phone, User, Hash } from 'lucide-react';
import { useParams } from 'react-router-dom';

const styles = {
    wrapper: "flex-1 flex flex-col overflow-hidden",
    pageContent: "flex-1 flex items-start justify-center px-3 sm:px-6 py-1 overflow-y-auto",
    outerCard: "w-full max-w-[1400px] px-2 sm:px-6 lg:px-14 py-4 sm:py-8 flex flex-col",
    greenContainer: "rounded-2xl border border-[#2C666E] bg-[#07393C] px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6",
    header: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
    title: "text-xl sm:text-2xl font-bold font-inter text-white",
    actionRow: "flex items-center gap-2",
    listWrapper: "grid grid-cols-1 md:grid-cols-2 gap-4",
    infoCard: "bg-black/20 border border-white/10 rounded-xl p-5 flex flex-col gap-4",
    sectionTitle: "text-[#90DDF0] font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-2",
    field: "flex items-start gap-3",
    icon: "mt-0.5 text-[#90DDF0] shrink-0",
    label: "text-white/40 text-[10px] sm:text-xs uppercase tracking-wide font-bold",
    value: "text-white font-nunito text-sm sm:text-base mt-0.5 leading-tight",
    emptyValue: "text-white/20 italic font-nunito text-sm mt-0.5",
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50 overflow-y-auto",
    loading: "text-white/70 font-nunito text-center py-12 bg-black/20 rounded-xl border border-white/10",
    toast: "font-nunito text-sm text-center py-2 px-4 rounded-xl",
};


const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null | undefined }) => (
    <div className={styles.field}>
        <Icon size={18} className={styles.icon} />
        <div>
            <p className={styles.label}>{label}</p>
            {value ? (
                <p className={styles.value}>{value}</p>
            ) : (
                <p className={styles.emptyValue}>No especificado</p>
            )}
        </div>
    </div>
);

// Página pública de información personal (portafolio visible)
const PersonalInfoPage = () => {
    const { username } = useParams<{ username: string }>();
    const {
        publicInfo,
        isLoadingPublic,
        publicError,
        setPublicUser
    } = usePersonalInfo();

    // Cargar información cuando cambia el username
    useEffect(() => {
        setPublicUser(username ?? null);
    }, [username, setPublicUser]);

    const fullName = [publicInfo?.names, publicInfo?.first_surname, publicInfo?.second_surname]
        .filter(Boolean)
        .join(" ");

    const residence = [publicInfo?.residence_city_name, publicInfo?.residence_country_name]
        .filter(Boolean)
        .join(", ");

    return (
        <div className={styles.wrapper}>
            <div className={styles.pageContent}>
                <div className={styles.outerCard}>
                    <div className={styles.greenContainer}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Información Personal</h1>
                        </div>

                        {publicError && (
                            <p className={`${styles.toast} bg-red-500/10 border border-red-500 text-red-400`}>
                                {publicError}
                            </p>
                        )}

                        {isLoadingPublic ? (
                            <div className={styles.loading}>Cargando información personal...</div>
                        ) : !publicInfo ? (
                            <div className={styles.loading}>No se encontró información para este usuario</div>
                        ) : (
                            <div className={styles.listWrapper}>
                                <div className={styles.infoCard}>
                                    <p className={styles.sectionTitle}>
                                        <User size={14} /> Datos Personales
                                    </p>
                                    <div className="flex flex-col gap-5">
                                        <InfoRow icon={User} label="Nombre Completo" value={fullName} />
                                        <InfoRow icon={Hash} label="Nombre de Usuario" value={publicInfo?.username} />
                                    </div>
                                </div>
                                <div className={styles.infoCard}>
                                    <p className={styles.sectionTitle}>
                                        <MapPin size={14} /> Ubicación y Contacto
                                    </p>
                                    <div className="flex flex-col gap-5">
                                        <InfoRow icon={MapPin} label="Residencia Actual" value={residence} />
                                        <InfoRow icon={Mail} label="Correo de Contacto" value={publicInfo?.contact_email} />
                                        <InfoRow icon={Phone} label="Teléfono" value={publicInfo?.phone_number} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoPage;

