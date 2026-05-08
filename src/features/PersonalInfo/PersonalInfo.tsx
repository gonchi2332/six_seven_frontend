import { useState } from 'react';
import { useNavbarInfo } from '../../hooks/useNavbarInfo';
import { usePersonalInfoSubmit, type DeletableField } from '../../hooks/usePersonalInfoSubmit';
import Button from '../../components/Button';
import { MapPin, Mail, Phone, User, Hash } from 'lucide-react';
import EditPersonalInfoCard from './EditPersonalInfo/EditPersonalInfoCard';
import AddInfoModal from './AddPersonalInfo/AddInfoModal';
import type { FieldValue } from './DeletePersonalInfo/DeleteInfoModal';

// ============================================
// CONSTANTES DE ESTILOS
// ============================================

const styles = {
    container: "flex flex-col gap-6 max-w-3xl mx-auto w-full",
    card: "bg-white/5 border border-white/10 rounded-2xl p-6",
    sectionTitle: "text-accent font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2",
    gridTwo: "grid grid-cols-1 sm:grid-cols-2 gap-5",
    field: "flex items-start gap-3",
    icon: "mt-0.5 text-accent shrink-0",
    label: "text-white/40 text-xs uppercase tracking-wide font-bold",
    value: "text-surface font-nunito text-base mt-0.5",
    emptyValue: "text-white/20 italic font-nunito text-base mt-0.5",
    loadingSkeleton: "h-16 bg-white/5 rounded-2xl animate-pulse border border-white/5",
    loadingContainer: "flex flex-col gap-4",
    headerTitle: "text-surface font-inter font-bold text-2xl",
    headerSubtitle: "text-white/40 text-sm font-nunito",
    actionsRow: "flex items-center gap-4 mt-6 flex-wrap",
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50",
    errorMessage: "text-red-400 text-sm font-inter text-center mt-4",
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

const getFieldLabel = (field: DeletableField): string => {
    const labels: Record<DeletableField, string> = {
        secondSurname: 'Segundo Apellido',
        city: 'Ciudad',
        email: 'Correo de contacto',
        phone: 'Teléfono',
        country: 'País de residencia',
    };
    return labels[field];
};

// ============================================
// COMPONENTES PEQUEÑOS REUTILIZABLES
// ============================================

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null | undefined }) => (
    <div className={styles.field}>
        <Icon size={16} className={styles.icon} />
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

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
    <div className={styles.card}>
        <p className={styles.sectionTitle}>
            <Icon size={13} />
            {title}
        </p>
        <div className={styles.gridTwo}>
            {children}
        </div>
    </div>
);

const LoadingSkeleton = () => (
    <div className={styles.loadingContainer}>
        {[1, 2, 3].map((i) => (
            <div key={i} className={styles.loadingSkeleton} />
        ))}
    </div>
);

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const PersonalInfo = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const { userInfo, isLoading } = useNavbarInfo(refreshKey);
    const { addField, isSubmitting, submitError } = usePersonalInfoSubmit();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const refreshData = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleEdit = () => setIsEditModalOpen(true);
    const handleCloseModal = () => setIsEditModalOpen(false);

    // Campos vacíos (se pueden agregar)
    const emptyFields: DeletableField[] = [];
    if (!userInfo?.second_surname) emptyFields.push('secondSurname');
    if (!userInfo?.residence_city_name) emptyFields.push('city');
    if (!userInfo?.contact_email) emptyFields.push('email');
    if (!userInfo?.phone_number) emptyFields.push('phone');
    if (!userInfo?.residence_country_name) emptyFields.push('country');

    // Campos con valor (se pueden eliminar)
    const fieldsWithValues: FieldValue[] = [];
    if (userInfo?.second_surname) fieldsWithValues.push({ field: 'secondSurname', label: getFieldLabel('secondSurname'), value: userInfo.second_surname });
    if (userInfo?.residence_city_name) fieldsWithValues.push({ field: 'city', label: getFieldLabel('city'), value: userInfo.residence_city_name });
    if (userInfo?.contact_email) fieldsWithValues.push({ field: 'email', label: getFieldLabel('email'), value: userInfo.contact_email });
    if (userInfo?.phone_number) fieldsWithValues.push({ field: 'phone', label: getFieldLabel('phone'), value: userInfo.phone_number });
    if (userInfo?.residence_country_name) fieldsWithValues.push({ field: 'country', label: getFieldLabel('country'), value: userInfo.residence_country_name });

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

    if (isLoading) return <LoadingSkeleton />;

    return (
        <div className={styles.container}>
            {/* Header */}
            <div>
                <h1 className={styles.headerTitle}>Información Personal</h1>
                <p className={styles.headerSubtitle}>
                    Tus datos de perfil y contacto registrados en la plataforma.
                </p>
            </div>

            {/* Sección Identidad */}
            <Section icon={User} title="Identidad">
                <InfoRow icon={User} label="Nombre completo" value={fullName} />
                <InfoRow icon={Hash} label="Nombre de usuario" value={userInfo?.username} />
            </Section>

            {/* Sección Ubicación y Contacto */}
            <Section icon={Mail} title="Ubicación y Contacto">
                <InfoRow icon={MapPin} label="Residencia" value={residence} />
                <InfoRow icon={Mail} label="Correo de contacto" value={userInfo?.contact_email} />
                <InfoRow icon={Phone} label="Teléfono" value={userInfo?.phone_number} />
            </Section>

            {/* Botones de acción */}
            <div className={styles.actionsRow}>
                <Button variant="primary" onClick={handleEdit}>
                    Modificar
                </Button>
                <Button 
                    variant="secondary" 
                    onClick={() => setIsAddModalOpen(true)}
                    disabled={emptyFields.length === 0 || isSubmitting}
                >
                    Agregar
                </Button>
                
            </div>

            {submitError && (
                <p className={styles.errorMessage}>{submitError}</p>
            )}

            {/* Modal de Edición */}
            {isEditModalOpen && (
                <div className={styles.overlay}>
                    <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <EditPersonalInfoCard onClose={handleCloseModal} />
                    </div>
                </div>
            )}

            {/* Modal de Agregar */}
            <AddInfoModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAdd}
                emptyFields={emptyFields}
            />

            {/* Modal de Eliminar */}
            
        </div>
    );
};

export default PersonalInfo;