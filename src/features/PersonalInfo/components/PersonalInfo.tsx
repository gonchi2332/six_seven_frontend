import { useState } from 'react';
import { useNavbarInfo } from '../../../hooks/useNavbarInfo';
import { usePersonalInfoSubmit, type DeletableField } from '../hooks/usePersonalInfoSubmit';
import Button from '../../../components/Button';
import { MapPin, Mail, Phone, User, Hash } from 'lucide-react';
import EditPersonalInfoCard from './EditPersonalInfo/EditPersonalInfoCard';
import AddInfoModal from './AddPersonalInfo/AddInfoModal';
import ViewPersonalInfoModal from './ViewPersonalInfoModal';



const styles = {
    wrapper: "flex-1 flex flex-col overflow-hidden",
    pageContent: "flex-1 flex items-start justify-center px-3 sm:px-6 py-1 overflow-y-auto",
    outerCard: "w-full max-w-[1400px] px-2 sm:px-6 lg:px-8 py-4 sm:py-4 flex flex-col",
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
    loading: "text-white/70 font-nunito text-center py-8 bg-black/20 rounded-xl border border-white/10",
    toast: "font-nunito text-sm text-center py-2 px-4 rounded-xl",
};

// ============================================
// COMPONENTES AUXILIARES
// ============================================

/*
  Características:
  -Subcomponente que renderiza una fila de información con ícono, etiqueta y valor
  -Recibe: ícono (lucide-react), etiqueta y valor
  -Si no hay valor, muestra "No especificado" en cursiva y semi-transparente
*/
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

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

/*
  Características:
  -Componente principal de gestión de información personal
  -Muestra datos del usuario: nombre completo, nombre de usuario, correo de registro, residencia, correo de contacto, teléfono
  -Organiza la información en dos tarjetas: "Datos Personales" y "Ubicación y Contacto"
  -Botones de acción: Ver, Modificar, Ingresar Información
  -Botón "Ingresar Información": deshabilitado si no hay campos vacíos o está en envío
  -Integra modales: EditPersonalInfoCard (edición), ViewPersonalInfoModal (visualización), AddInfoModal (agregar campos faltantes)
  -Usa refreshKey para recargar datos después de operaciones

  @ Ejemplo:
  <PersonalInfo />
*/
const PersonalInfo = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const { userInfo, isLoading } = useNavbarInfo(refreshKey);
    const { addField, isSubmitting } = usePersonalInfoSubmit();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const refreshData = () => setRefreshKey(prev => prev + 1);

    // Campos vacíos que pueden ser agregados
    const emptyFields: DeletableField[] = [];
    if (!userInfo?.second_surname) emptyFields.push('secondSurname');
    if (!userInfo?.residence_city_name) emptyFields.push('city');
    if (!userInfo?.contact_email) emptyFields.push('email');
    if (!userInfo?.phone_number) emptyFields.push('phone');
    if (!userInfo?.residence_country_name) emptyFields.push('country');

    const handleAdd = async (field: DeletableField, value: string) => {
        await addField(field, value, userInfo);
        refreshData();
    };

    const fullName = [userInfo?.names, userInfo?.first_surname, userInfo?.second_surname]
        .filter(Boolean)
        .join(" ");

    const residence = [userInfo?.residence_city_name, userInfo?.residence_country_name]
        .filter(Boolean)
        .join(", ");

    return (
        <div className={styles.wrapper}>
            <div className={styles.pageContent}>
                <div className={styles.outerCard}>
                    <div className={styles.greenContainer}>

                        {/* Header Estandarizado */}
                        <div className={styles.header}>
                            <h1 className={styles.title}>Información Personal</h1>
                            <div className={styles.actionRow}>
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsViewModalOpen(true)}
                                >
                                    Ver
                                </Button>
                                <Button
                                    variant="quaternary"
                                    onClick={() => setIsEditModalOpen(true)}
                                >
                                    Modificar
                                </Button>
                                <Button
                                    variant="quaternary"
                                    onClick={() => setIsAddModalOpen(true)}
                                    disabled={emptyFields.length === 0 || isSubmitting}
                                >
                                    Ingresar Información
                                </Button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className={styles.loading}>Cargando información personal...</div>
                        ) : (
                            <div className={styles.listWrapper}>

                                {/* Card Identidad */}
                                <div className={styles.infoCard}>
                                    <p className={styles.sectionTitle}>
                                        <User size={14} /> Datos Personales
                                    </p>
                                    <div className="flex flex-col gap-5">
                                        <InfoRow icon={User} label="Nombre Completo" value={fullName} />
                                        <InfoRow icon={Hash} label="Nombre de Usuario" value={userInfo?.username} />
                                        <InfoRow icon={Mail} label="Correo de Registro" value={userInfo?.main_registration_email} />
                                    </div>
                                </div>

                                {/* Card Contacto y Ubicación */}
                                <div className={styles.infoCard}>
                                    <p className={styles.sectionTitle}>
                                        <MapPin size={14} /> Ubicación y Contacto
                                    </p>
                                    <div className="flex flex-col gap-5">
                                        <InfoRow icon={MapPin} label="Residencia Actual" value={residence} />
                                        <InfoRow icon={Mail} label="Correo de Contacto" value={userInfo?.contact_email} />
                                        <InfoRow icon={Phone} label="Teléfono" value={userInfo?.phone_number} />
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Edición */}
            {isEditModalOpen && (
                <div className={styles.overlay} onClick={() => setIsEditModalOpen(false)}>
                    <div
                        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <EditPersonalInfoCard onClose={() => {
                            setIsEditModalOpen(false);
                            refreshData();
                        }} />
                    </div>
                </div>
            )}

            {/* Modal Ver Información */}
            <ViewPersonalInfoModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                userInfo={userInfo}
            />

            {/* Modal de Agregar */}
            <AddInfoModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAdd}
                emptyFields={emptyFields}
            />
        </div>
    );
};

export default PersonalInfo;

