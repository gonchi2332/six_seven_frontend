import { MapPin, Mail, Phone, User, Hash, Globe } from 'lucide-react';
import Button from '../../components/Button';
import PopUpCard from '../../components/PopUpCard';
import { parseProfilePicture } from '../../services/decodeBase64';
import type { PersonalInfoResponse } from '../../services/personalInfoService';

const defAvatar = '/defAvatar.png';

// ============================================
// ESTILOS - CON TEXTO RESPONSIVE
// ============================================

const styles = {
    overlay: 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 z-50 overflow-y-auto py-6',
    container: 'w-full max-w-2xl min-h-screen flex items-center justify-center p-4',
    
    // Avatar y nombre
    avatarSection: 'flex flex-col items-center gap-4 px-6 pt-8 pb-6 border-b border-white/10 bg-black/20',
    avatarWrapper: 'relative',
    avatar: 'w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-[#90DDF0]/40 shadow-lg shadow-black/40',
    fullName: 'text-2xl sm:text-3xl font-bold font-inter text-white text-center break-words max-w-full',
    username: 'text-[#90DDF0] font-nunito text-base sm:text-lg font-semibold break-words max-w-full',

    // Grid de datos
    body: 'px-6 py-5',
    grid: 'grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2',
    sectionLabel: 'text-[#90DDF0] font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-3 mt-4 first:mt-0 col-span-full',
    divider: 'border-t border-white/10 my-3 col-span-full',

    // Filas de datos - TEXTO QUE NO SE SALE
    row: 'flex items-start gap-4 py-3 w-full',
    iconBox: 'w-10 h-10 rounded-xl bg-[#2C666E]/40 flex items-center justify-center shrink-0 mt-0.5',
    icon: 'text-[#90DDF0] w-5 h-5',
    textGroup: 'flex flex-col flex-1 min-w-0', // ← min-w-0 permite que el texto se rompa
    label: 'text-[#90DDF0] text-[10px] uppercase tracking-wide font-bold mb-1',
    value: 'text-white font-nunito text-base sm:text-lg font-medium break-words overflow-wrap-anywhere leading-snug',
    emptyValue: 'text-white/30 italic font-nunito text-base sm:text-lg',

    // Footer
    footer: 'px-6 py-5 border-t border-white/10 bg-black/20',
    closeButton: 'absolute right-4 top-4 text-white/50 hover:text-[#90DDF0] transition-colors p-1 hover:bg-white/10 rounded-lg',
};

// ============================================
// COMPONENTE AUXILIAR
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
// COMPONENTE PRINCIPAL
// ============================================

interface ViewPersonalInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    userInfo: PersonalInfoResponse | null;
}

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
                        <div className="flex flex-col items-center gap-1 w-full max-w-full">
                            <h2 className={styles.fullName}>{fullName || 'Sin nombre'}</h2>
                            <p className={styles.username}>@{userInfo.username}</p>
                        </div>
                    </div>

                    {/* Cuerpo: datos en grid responsivo */}
                    <div className={styles.body}>
                        <div className={styles.grid}>
                            {/* Sección Identidad */}
                            <p className={styles.sectionLabel}>
                                <User size={12} /> Datos del Usuario
                            </p>
                            <InfoRow icon={Hash} label="Nombre de Usuario" value={userInfo.username} />
                             <InfoRow icon={Phone} label="Teléfono" value={userInfo.phone_number} />
                            <InfoRow icon={Mail} label="Correo de Registro" value={userInfo.main_registration_email} />
                            <InfoRow icon={Mail} label="Correo de Contacto" value={userInfo.contact_email} />
                           

                            <div className={styles.divider} />

                            {/* Sección Ubicación */}
                            <p className={styles.sectionLabel}>
                                <Globe size={12} /> Ubicación
                            </p>
                            <InfoRow icon={MapPin} label="Ciudad" value={userInfo.residence_city_name} />
                            <InfoRow icon={Globe} label="País" value={userInfo.residence_country_name} />
                            {residence && residence !== ', ' && (
                                <InfoRow icon={MapPin} label="Residencia Completa" value={residence} />
                            )}
                        </div>
                    </div>

                    {/* Footer */}
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