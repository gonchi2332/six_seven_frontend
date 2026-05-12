import { MapPin, Mail, Phone, User, Hash, ArrowLeft, Globe } from 'lucide-react';
import Button from '../../components/Button';
import PopUpCard from '../../components/PopUpCard';
import { parseProfilePicture } from '../../services/decodeBase64';
import type { PersonalInfoResponse } from '../../services/personalInfoService';

const defAvatar = '/defAvatar.png';

// ============================================
// ESTILOS
// ============================================

const styles = {
    overlay: 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center px-3 sm:px-4 z-50 overflow-y-auto py-4 sm:py-6',
    container: 'min-h-screen flex items-center justify-center p-2 sm:p-4',
    
    // Avatar y nombre
    avatarSection: 'flex flex-col items-center gap-3 sm:gap-4 px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-white/10 bg-black/20',
    avatarWrapper: 'relative',
    avatar: 'w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-[#90DDF0]/40 shadow-lg shadow-black/40',
    fullName: 'text-xl sm:text-2xl font-bold font-inter text-white text-center',
    username: 'text-[#90DDF0] font-nunito text-sm sm:text-base font-semibold',

    // Grid de datos (2 columnas en desktop, 1 en móvil)
    body: 'px-4 sm:px-6 py-4 sm:py-5',
    grid: 'grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1',
    sectionLabel: 'text-[#90DDF0] font-bold text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-2 mb-2 sm:mb-3 mt-3 sm:mt-4 col-span-full',
    divider: 'border-t border-white/10 my-2 sm:my-3 col-span-full',

    // Filas de datos
    row: 'flex items-start gap-3 py-2 sm:py-2.5',
    iconBox: 'w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#2C666E]/50 flex items-center justify-center shrink-0 mt-0.5',
    icon: 'text-[#90DDF0] w-3.5 h-3.5 sm:w-4 sm:h-4',
    textGroup: 'flex flex-col',
    label: 'text-white/40 text-[10px] sm:text-[12px] uppercase tracking-wide font-bold',
    value: 'text-white font-nunito  sm:text-sm mt-0.5 leading-snug',
    emptyValue: 'text-white/25 italic font-nunito text-xs sm:text-sm mt-0.5',

    // Footer
    footer: 'px-4 sm:px-6 py-4 sm:py-5 border-t border-white/10 bg-black/20',
};

// ============================================
// COMPONENTE AUXILIAR: fila de dato
// ============================================

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

// ============================================
// PROPS
// ============================================

interface ViewPersonalInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    userInfo: PersonalInfoResponse | null;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const ViewPersonalInfoModal = ({ isOpen, onClose, userInfo }: ViewPersonalInfoModalProps) => {
    if (!isOpen || !userInfo) return null;

    const fullName = [userInfo.names, userInfo.first_surname, userInfo.second_surname]
        .filter(Boolean)
        .join(' ');

    const residence = [userInfo.residence_city_name, userInfo.residence_country_name]
        .filter(Boolean)
        .join(', ');

    const avatarSrc = userInfo.profile_picture
        ? (parseProfilePicture(userInfo.profile_picture) ?? defAvatar)
        : defAvatar;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <PopUpCard title="Mi Perfil">
                    {/* Avatar y nombre */}
                    <div className={styles.avatarSection}>
                        <div className={styles.avatarWrapper}>
                            <img
                                src={avatarSrc}
                                alt="Foto de perfil"
                                className={styles.avatar}
                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = defAvatar; }}
                            />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <h2 className={styles.fullName}>{fullName || 'Sin nombre'}</h2>
                            <p className={styles.username}>@{userInfo.username}</p>
                        </div>
                    </div>

                    {/* Cuerpo: datos en grid responsivo */}
                    <div className={styles.body}>
                        <div className={styles.grid}>
                            {/* Sección Identidad */}
                            <p className={styles.sectionLabel}>
                                <User size={12} /> Identidad
                            </p>
                            <InfoRow icon={Hash} label="Nombre de Usuario" value={userInfo.username} />
                            <InfoRow icon={Mail} label="Correo de Registro" value={userInfo.main_registration_email} />

                            <div className={styles.divider} />

                            {/* Sección Contacto */}
                            <p className={styles.sectionLabel}>
                                <Phone size={12} /> Contacto
                            </p>
                            <InfoRow icon={Mail} label="Correo de Contacto" value={userInfo.contact_email} />
                            <InfoRow icon={Phone} label="Teléfono / WhatsApp" value={userInfo.phone_number} />

                            <div className={styles.divider} />

                            {/* Sección Ubicación */}
                            <p className={styles.sectionLabel}>
                                <Globe size={12} /> Ubicación
                            </p>
                            <InfoRow icon={MapPin} label="Ciudad" value={userInfo.residence_city_name} />
                            <InfoRow icon={Globe} label="País" value={userInfo.residence_country_name} />
                            {residence && (
                                <InfoRow icon={MapPin} label="Residencia Completa" value={residence} />
                            )}
                        </div>
                    </div>

                    {/* Footer: botón Atrás */}
                    <div className={styles.footer}>
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            fullWidth
                        >
                            <ArrowLeft size={16} className="inline mr-2" />
                            Atrás
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default ViewPersonalInfoModal;