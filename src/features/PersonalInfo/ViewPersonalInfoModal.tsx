import { MapPin, Mail, Phone, User, Hash, Globe } from 'lucide-react';
import Button from '../../components/Button';
import PopUpCard from '../../components/PopUpCard';
import { parseProfilePicture } from '../../services/decodeBase64';
import type { PersonalInfoResponse } from '../../services/personalInfoService';

const defAvatar = '/defAvatar.png';

// ============================================
// ESTILOS
// ============================================

const styles = {
    overlay: 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 z-50 overflow-y-auto py-4',
    container: 'min-h-screen flex items-center justify-center p-2',
    
    // Avatar y nombre - más compacto
    avatarSection: 'flex flex-col items-center gap-2 px-6 pt-4 pb-3 border-b border-white/10 bg-black/20',
    avatarWrapper: 'relative',
    avatar: 'w-16 h-16 rounded-full object-cover border-3 border-[#90DDF0]/40 shadow-lg shadow-black/40',
    fullName: 'text-lg font-bold font-inter text-white text-center',
    username: 'text-[#90DDF0] font-nunito text-xs font-semibold',

    // Grid de datos
    body: 'px-6 py-3',
    grid: 'grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0',
    sectionLabel: 'text-[#90DDF0] font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5 mb-1 mt-2 first:mt-0 col-span-full',
    divider: 'border-t border-white/10 my-1.5 col-span-full',

    // Filas de datos - más compactas
    row: 'flex items-start gap-2 py-1',
    iconBox: 'w-6 h-6 rounded-lg bg-[#2C666E]/50 flex items-center justify-center shrink-0 mt-0.5',
    icon: 'text-[#90DDF0] w-3 h-3',
    textGroup: 'flex flex-col',
    label: 'text-white/40 text-[8px] uppercase tracking-wide font-bold',
    value: 'text-white font-nunito text-xs mt-0 leading-snug',
    emptyValue: 'text-white/25 italic font-nunito text-xs mt-0',

    // Footer - más compacto
    footer: 'px-6 py-3 border-t border-white/10 bg-black/20',
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
                            <InfoRow icon={Phone} label="Teléfono" value={userInfo.phone_number} />

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
                            Atrás
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default ViewPersonalInfoModal;