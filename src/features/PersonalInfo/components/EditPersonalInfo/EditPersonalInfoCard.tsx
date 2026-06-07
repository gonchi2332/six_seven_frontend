import { useEffect } from 'react';
import TextField from "../../../../components/TextField";
import Button from "../../../../components/Button";
import PopUpCard from "../../../../components/PopUpCard";
import ImageUpload from "../../../UploadFile/components/uploadFile";
import { useCountries } from "../../../../hooks/useCountries";
import { useProfileForm } from "../../hooks/useProfileFormRegex";
import { usePersonalInfo } from "../../hooks/useProfileFormForm";
import { usePersonalInfoSubmit } from "../../hooks/usePersonalInfoSubmit";

const STYLES = {
    FORM_WRAPPER: "flex flex-col gap-6 px-8",
    DYNAMIC_GRID: "grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min",
    INPUT_LABEL: "mb-1 text-xl font-inter text-white",
    SELECT: "w-full px-4 py-2 border rounded-xl outline-none transition-all duration-200 bg-white font-nunito disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
    SELECT_PLACEHOLDER: "text-gray-400",
    SELECT_VALUE: "text-black",
    IMAGE_WRAPPER: "flex flex-col gap-2",
    FOOTER: "flex flex-row justify-end items-center gap-4 mt-10 pt-6 px-8",
};

/*
  Props del componente EditPersonalInfoCard:
  -onClose: Función ejecutada al cancelar o cerrar el modal
*/
interface EditPersonalInfoCardProps {
    onClose?: () => void;
}

/*
  Características:
  -Modal para modificar información personal del usuario
  -Carga datos actuales del usuario al montar el componente
  -Muestra campos dinámicamente según existan o no en los datos originales
  -Campos siempre visibles: nombre(s), primer apellido, imagen de perfil
  -Campos condicionales: segundo apellido, ciudad, correo, teléfono, país (solo si ya existían)
  -Integra selector de países (useCountries)
  -Upload de imagen de perfil (ImageUpload)
  -Validación de campos con regex (useProfileForm)
  -Al enviar exitosamente, recarga la página para reflejar cambios
  -Muestra errores de carga, validación y envío

  @ Ejemplo:
  <EditPersonalInfoCard onClose={() => setShowModal(false)} />
*/
const EditPersonalInfoCard = ({ onClose }: EditPersonalInfoCardProps) => {
    const { countries, isLoading } = useCountries();
    const {
        formData,
        errors,
        handleChange,
        validateForm,
        setInitialData,
        restoreOriginalData,
        isFormComplete,
        shouldShowField
    } = useProfileForm();
    const { isLoadingData, loadError } = usePersonalInfo(setInitialData);
    const { handleSubmit, isSubmitting, submitError, submitSuccess } = usePersonalInfoSubmit();

    // Recargar la página cuando el submit es exitoso
    useEffect(() => {
        if (submitSuccess) {
            // Pequeño delay para mostrar el mensaje de éxito
            const timer = setTimeout(() => {
                window.location.reload();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [submitSuccess]);

    const handleAcept = async () => {
        if (!validateForm()) return;
        await handleSubmit(formData);
    };

    const handleCancel = () => {
        restoreOriginalData();
        onClose?.();
    };

    if (isLoadingData) {
        return (
            <PopUpCard title="Modificar Informacion Personal">
                <p className="text-white text-center py-10">Cargando información...</p>
            </PopUpCard>
        );
    }

    if (loadError) {
        return (
            <PopUpCard title="Modificar Informacion Personal">
                <p className="text-red-400 text-center py-10">{loadError}</p>
            </PopUpCard>
        );
    }

    return (
        <div>
            <PopUpCard title="Modificar Informacion Personal">
                <div>
                    <div className={STYLES.FORM_WRAPPER}>
                        <div className={STYLES.DYNAMIC_GRID}>
                            {/* Nombre(s) - SIEMPRE visible */}
                            {shouldShowField('firstName') && (
                                <TextField
                                    label="Nombre(s)*:"
                                    value={formData.firstName}
                                    onChange={(e) => handleChange("firstName", e.target.value)}
                                    error={errors.firstName}
                                    className="w-full"
                                />
                            )}
                            {/* Primer Apellido - SIEMPRE visible */}
                            {shouldShowField('firstSurname') && (
                                <TextField
                                    label="Primer apellido*:"
                                    value={formData.firstSurname}
                                    onChange={(e) => handleChange("firstSurname", e.target.value)}
                                    error={errors.firstSurname}
                                    className="w-full"
                                />
                            )}
                            {/* Segundo Apellido - Solo si existía originalmente */}
                            {shouldShowField('secondSurname') && (
                                <TextField
                                    label="Segundo apellido*:"
                                    value={formData.secondSurname ?? ''}
                                    onChange={(e) => handleChange("secondSurname", e.target.value)}
                                    error={errors.secondSurname}
                                    className="w-full"
                                />
                            )}

                            {/* Ciudad - Solo si existía originalmente */}
                            {shouldShowField('city') && (
                                <TextField
                                    label="Ciudad*:"
                                    value={formData.city ?? ''}
                                    onChange={(e) => handleChange("city", e.target.value)}
                                    error={errors.city}
                                    className="w-full"
                                />
                            )}

                            {/* Correo - Solo si existía originalmente */}
                            {shouldShowField('email') && (
                                <TextField
                                    label="Correo de contacto*:"
                                    value={formData.email ?? ''}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    placeholder="Ej: juan@ejemplo.com"
                                    type="email"
                                    error={errors.email}
                                    className="w-full"
                                />
                            )}

                            {/* Teléfono - Solo si existía originalmente */}
                            {shouldShowField('phone') && (
                                <TextField
                                    label="Teléfono*:"
                                    value={formData.phone ?? ''}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    placeholder="Ej: +591 77123456"
                                    type="text"
                                    error={errors.phone}
                                    className="w-full"
                                />
                            )}

                            {/* País de residencia - Solo si existe originalmente */}
                            {formData.country && formData.country.trim() !== '' && (
                                <div className="flex flex-col justify-start">
                                    <label className={STYLES.INPUT_LABEL}>País de residencia*:</label>
                                    <select
                                        value={formData.country}
                                        onChange={(e) => handleChange("country", e.target.value)}
                                        disabled={isLoading}
                                        className={`${STYLES.SELECT} ${formData.country === "" ? STYLES.SELECT_PLACEHOLDER : STYLES.SELECT_VALUE
                                            }`}
                                    >
                                        <option value="" disabled className="text-gray-400 hidden">
                                            {isLoading ? "Cargando países..." : "Selecciona un país"}
                                        </option>
                                        {countries.map((country) => (
                                            <option key={country} value={country} className="text-black">
                                                {country}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Imagen de perfil - Siempre visible */}
                            <div className={STYLES.IMAGE_WRAPPER}>
                                <span className={STYLES.INPUT_LABEL}>Imagen de perfil*:</span>
                                <ImageUpload
                                    onImageSelect={(file) => handleChange("profileImage", file)}
                                    initialImageUrl={formData.profileImageUrl ?? null}
                                />
                            </div>
                        </div>

                        {submitError && (
                            <p className="text-red-400 text-sm font-inter">{submitError}</p>
                        )}
                        {submitSuccess && (
                            <p className="text-green-400 text-sm font-inter">
                                Información actualizada correctamente.
                            </p>
                        )}
                    </div>

                    <div className={STYLES.FOOTER}>
                        <Button variant="secondary" onClick={handleCancel}>
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleAcept}
                            disabled={isSubmitting || !isFormComplete()}
                        >
                            {isSubmitting ? "Guardando..." : "Modificar"}
                        </Button>
                    </div>
                </div>
            </PopUpCard>
        </div>
    );
};

export default EditPersonalInfoCard;

