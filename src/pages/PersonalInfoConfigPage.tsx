import { useState } from 'react';
import { useNavbarInfo } from '../hooks/useNavbarInfo';
import { MapPin, Mail, Phone, User, Hash } from 'lucide-react';
import Button from '../components/Button';
import Switch from '../components/Switch/Switch';
import { visibilityService } from '../services/visibilityServices';

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
    fieldWrapper: "flex items-center justify-between p-2 rounded-xl bg-black/10 border border-white/5 hover:border-white/10 transition-all gap-4",
    field: "flex items-start gap-3",
    icon: "mt-0.5 text-[#90DDF0] shrink-0",
    label: "text-white/40 text-[10px] sm:text-xs uppercase tracking-wide font-bold",
    value: "text-white font-nunito text-sm sm:text-base mt-0.5 leading-tight",
    loading: "text-white/70 font-nunito text-center py-12 bg-black/20 rounded-xl border border-white/10",
    toast: "font-nunito text-sm text-center py-2 px-4 rounded-xl",
    toastSuccess: "bg-[#90DDF0]/10 border border-[#90DDF0]/40 text-[#90DDF0]",
    toastError: "bg-red-500/10 border border-red-500 text-red-400",
};

const ConfigInfoRow = ({
    icon: Icon,
    label,
    value,
    fieldKey,
    currentVisibility,
    onToggle
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    fieldKey: string;
    currentVisibility: boolean;
    onToggle: (key: string) => void;
}) => (
    <div className={styles.fieldWrapper}>
        <div className={styles.field}>
            <Icon size={18} className={styles.icon} />
            <div>
                <p className={styles.label}>{label}</p>
                <p className={styles.value}>{value}</p>
            </div>
        </div>
        <div>
            <Switch
                key={`${fieldKey}-${currentVisibility}`}
                id={fieldKey}
                initialState={currentVisibility}
                onChange={() => onToggle(fieldKey)}
            />
        </div>
    </div>
);

const PersonalInfoConfigPage = () => {
    const [refreshKey] = useState(0);
    const { userInfo, isLoading } = useNavbarInfo(refreshKey);

    const [localError, setLocalError] = useState<string | null>(null);
    const [localSuccess, setLocalSuccess] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [visibilityMap, setVisibilityMap] = useState<Record<string, boolean>>({});

    const handleLocalVisibilityChange = (fieldKey: string) => {
        setVisibilityMap((prev) => {
            let currentVal = prev[fieldKey];

            if (currentVal === undefined && userInfo) {
                currentVal = !!(userInfo as any)[fieldKey];
            } else if (currentVal === undefined) {
                currentVal = false;
            }

            return {
                ...prev,
                [fieldKey]: !currentVal,
            };
        });
    };

    const handleHideAll = () => {
        setVisibilityMap({
            show_contact_email: false,
            show_phone: false,
            show_residence: false
        });
    };

    const handleSaveChanges = async () => {
        try {
            setIsSaving(true);
            setLocalError(null);

            if (!userInfo) return;

            const finalPayload: Record<string, boolean> = {
                show_contact_email: visibilityMap.show_contact_email !== undefined ? visibilityMap.show_contact_email : !!(userInfo as any).show_contact_email,
                show_phone: visibilityMap.show_phone !== undefined ? visibilityMap.show_phone : !!(userInfo as any).show_phone,
                show_residence: visibilityMap.show_residence !== undefined ? visibilityMap.show_residence : !!(userInfo as any).show_residence,
            };

            const res = await visibilityService.updatePersonalInfo(finalPayload);

            Object.keys(finalPayload).forEach((key) => {
                if (key in userInfo) {
                    (userInfo as any)[key] = finalPayload[key];
                }
            });

            setLocalSuccess(res.message || "Visibilidad de información personal actualizada.");
            setTimeout(() => setLocalSuccess(null), 3000);
            setVisibilityMap({});
        } catch (err: any) {
            setLocalError(err.message || "Error al guardar los cambios.");
            setTimeout(() => setLocalError(null), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const fullName = [userInfo?.names, userInfo?.first_surname, userInfo?.second_surname]
        .filter(Boolean)
        .join(" ");

    const residence = [userInfo?.residence_city_name, userInfo?.residence_country_name]
        .filter(Boolean)
        .join(", ");

    const getVisibility = (key: string): boolean => {
        if (visibilityMap[key] !== undefined) return visibilityMap[key];
        if (userInfo) return !!(userInfo as any)[key];
        return false;
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.pageContent}>
                <div className={styles.outerCard}>
                    <div className={styles.greenContainer}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Configuración de visibilidad de Información Personal</h1>

                            <div className={styles.actionRow}>
                                <Button
                                    variant="secondary"
                                    onClick={handleHideAll}
                                    disabled={isLoading || !userInfo}
                                >
                                    <span>Ocultar todo</span>
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={handleSaveChanges}
                                    disabled={isLoading || isSaving || !userInfo}
                                >
                                    <span>Guardar</span>
                                </Button>
                            </div>
                        </div>

                        {localError && (
                            <p className={`${styles.toast} ${styles.toastError}`}>{localError}</p>
                        )}

                        {localSuccess && (
                            <p className={`${styles.toast} ${styles.toastSuccess}`}>{localSuccess}</p>
                        )}

                        {isLoading ? (
                            <div className={styles.loading}>Cargando panel de configuración...</div>
                        ) : (
                            <div className={styles.listWrapper}>
                                <div className={styles.infoCard}>
                                    <p className={styles.sectionTitle}>
                                        <User size={14} /> Datos Personales</p>
                                    <div className="flex flex-col gap-4">
                                        {fullName && (
                                            <InfoRowStatic icon={User} label="Nombre Completo" value={fullName} badgeText="Siempre Público" />
                                        )}
                                        {userInfo?.username && (
                                            <InfoRowStatic icon={Hash} label="Nombre de Usuario" value={userInfo.username} badgeText="Siempre Público" />
                                        )}
                                        {userInfo?.main_registration_email && (
                                            <InfoRowStatic icon={Mail} label="Correo Principal (Registro)" value={userInfo.main_registration_email} badgeText="Siempre Oculto" />
                                        )}
                                    </div>
                                </div>

                                <div className={styles.infoCard}>
                                    <p className={styles.sectionTitle}>
                                        <MapPin size={14} /> Ubicación y Contacto Público
                                    </p>
                                    <div className="flex flex-col gap-4">
                                        {residence && (
                                            <ConfigInfoRow
                                                icon={MapPin}
                                                label="Residencia Actual"
                                                value={residence}
                                                fieldKey="show_residence"
                                                currentVisibility={getVisibility("show_residence")}
                                                onToggle={handleLocalVisibilityChange}
                                            />
                                        )}
                                        {userInfo?.contact_email && (
                                            <ConfigInfoRow
                                                icon={Mail}
                                                label="Correo Secundario"
                                                value={userInfo.contact_email}
                                                fieldKey="show_contact_email"
                                                currentVisibility={getVisibility("show_contact_email")}
                                                onToggle={handleLocalVisibilityChange}
                                            />
                                        )}
                                        {userInfo?.phone_number && (
                                            <ConfigInfoRow
                                                icon={Phone}
                                                label="Teléfono / WhatsApp"
                                                value={userInfo.phone_number}
                                                fieldKey="show_phone"
                                                currentVisibility={getVisibility("show_phone")}
                                                onToggle={handleLocalVisibilityChange}
                                            />
                                        )}
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

const InfoRowStatic = ({ icon: Icon, label, value, badgeText }: { icon: React.ElementType; label: string; value: string; badgeText: string }) => (
    <div className={`${styles.fieldWrapper} opacity-80 bg-black/5`}>
        <div className={styles.field}>
            <Icon size={18} className={styles.icon} />
            <div>
                <p className={styles.label}>{label}</p>
                <p className={styles.value}>{value}</p>
            </div>
        </div>
        <span className="text-[9px] uppercase tracking-wider text-white/30 font-bold font-inter px-2 shrink-0">{badgeText}</span>
    </div>
);

export default PersonalInfoConfigPage;
