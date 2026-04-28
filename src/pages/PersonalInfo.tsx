import { useState } from 'react';
import Button from "../components/Button";
import EditPersonalInfoCard from "../features/EditPersonalInfo/components";
import Header from '../components/Header/Header';
import { useNavbarInfo } from '../hooks/useNavbarInfo';

const STYLES = {
    CONTAINER: "flex flex-col gap-6",
    CARD: "p-8 bg-white/5 rounded-3xl border border-white/10 w-full",
    INFO_BOX: "flex flex-col gap-4",
    GRID: "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4",
    DETAILS: "text-surface text-lg font-nunito flex items-center gap-3",
    LABEL: "text-accent font-bold text-sm uppercase tracking-widest block mb-1",
    OVERLAY: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm",
};

const PersonalInfo = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { userInfo, isLoading } = useNavbarInfo();

    const handleClose = () => {
        setIsOpen(false);
        window.location.reload();
    };

    return (
        <>
            <div className={STYLES.CONTAINER}>
                <Header title="Información Personal" />

                {isLoading ? (
                    <p className="text-white/50 italic px-4">Cargando tus datos...</p>
                ) : (
                    <div className={STYLES.CARD}>
                        <div className={STYLES.INFO_BOX}>
                            <span className={STYLES.LABEL}>Ubicación y Contacto</span>

                            <div className={STYLES.GRID}>
                                {(userInfo?.residence_city_name || userInfo?.residence_country_name) && (
                                    <p className={STYLES.DETAILS}>
                                        <span className="text-accent text-xl">Ubicacion:</span>
                                        <span>
                                            {[userInfo.residence_city_name, userInfo.residence_country_name]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </span>
                                    </p>
                                )}

                                {userInfo?.contact_email && (
                                    <p className={STYLES.DETAILS}>
                                        <span className="text-accent text-xl">Correo electronico:</span>
                                        <span>{userInfo.contact_email}</span>
                                    </p>
                                )}

                                {userInfo?.phone_number && (
                                    <p className={STYLES.DETAILS}>
                                        <span className="text-accent text-xl">Telefono:</span>
                                        <span>{userInfo.phone_number}</span>
                                    </p>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/5">
                                <Button onClick={() => setIsOpen(true)} variant="primary">
                                    Modificar Información
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isOpen && (
                <div className={STYLES.OVERLAY} onClick={() => setIsOpen(false)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <EditPersonalInfoCard onClose={handleClose} />
                    </div>
                </div>
            )}
        </>
    );
};

export default PersonalInfo;
