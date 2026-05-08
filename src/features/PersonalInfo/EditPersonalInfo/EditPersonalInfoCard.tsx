import { useEffect } from "react";
import TextField from "../../../components/TextField";
import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";
import ImageUpload from "../../UploadFile/components/uploadFile";
import { useCountries } from "../../../hooks/useCountries";
import { useProfileForm } from "../../../hooks/useProfileFormRegex";
import { usePersonalInfo } from "../../../hooks/useProfileFormForm";
import { usePersonalInfoSubmit } from "../../../hooks/usePersonalInfoSubmit";

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

interface EditPersonalInfoCardProps {
  onClose?: () => void;
}

const EditPersonalInfoCard = ({ onClose }: EditPersonalInfoCardProps) => {
  const { countries, isLoading } = useCountries();
  const { formData, errors, handleChange, validateForm, setInitialData } = useProfileForm();
  const { isLoadingData, loadError } = usePersonalInfo(setInitialData);
  const { handleSubmit, isSubmitting, submitError, submitSuccess } = usePersonalInfoSubmit();

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess, onClose]);

  const handleAcept = async () => {
    if (!validateForm()) return;
    await handleSubmit(formData);
  };

  const handleCancel = () => {
    onClose?.();
  };

  // ============================================
  // DETERMINAR QUÉ CAMPOS ESTÁN VACÍOS
  // ============================================

  const isEmptyField = (value: string | undefined | null): boolean => {
    return !value || value.trim() === '';
  };

  // Campos obligatorios (siempre deshabilitados)
  const isFirstNameEmpty = isEmptyField(formData.firstName);
  const isFirstSurnameEmpty = isEmptyField(formData.firstSurname);
  
  if (isLoadingData) {
    return (
      <PopUpCard title="Datos Personales">
        <p className="text-white text-center py-10">Cargando información...</p>
      </PopUpCard>
    );
  }

  if (loadError) {
    return (
      <PopUpCard title="Datos Personales">
        <p className="text-red-400 text-center py-10">{loadError}</p>
      </PopUpCard>
    );
  }

  // Botón de aceptar deshabilitado si hay campos obligatorios vacíos
  const isFormIncomplete = isFirstNameEmpty || isFirstSurnameEmpty;

  return (
    <div>
      <PopUpCard title="Datos Personales">
        <div>
          <div className={STYLES.FORM_WRAPPER}>
            {/* Grid dinámico - todos los campos en un solo contenedor */}
            <div className={STYLES.DYNAMIC_GRID}>
              {/* Campo 1: Nombre(s) - SIEMPRE visible */}
              <TextField
                label="Nombre(s)*:"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                error={errors.firstName}
                className="w-full"
              />
              
              {/* Campo 2: Primer Apellido - SIEMPRE visible */}
              <TextField
                label="Primer Apellido*:"
                value={formData.firstSurname}
                onChange={(e) => handleChange("firstSurname", e.target.value)}
                error={errors.firstSurname}
                className="w-full"
              />
              
              {/* Campo 3: Segundo Apellido - Solo si existe */}
              {formData.secondSurname !== undefined && (
                <TextField
                  label="Segundo Apellido:"
                  value={formData.secondSurname}
                  onChange={(e) => handleChange("secondSurname", e.target.value)}
                  error={errors.secondSurname}
                  className="w-full"
                />
              )}

              {/* Campo 4: Ciudad - Solo si tiene valor */}
              {formData.city && formData.city.trim() !== '' && (
                <TextField
                  label="Ciudad:"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  error={errors.city}
                  className="w-full"
                />
              )}

              {/* Campo 5: Correo - Solo si tiene valor */}
              {formData.email && formData.email.trim() !== '' && (
                <TextField
                  label="Correo de contacto:"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Ej: juan@ejemplo.com"
                  type="email"
                  error={errors.email}
                  className="w-full"
                />
              )}

              {/* Campo 6: Teléfono - Solo si tiene valor */}
              {formData.phone && formData.phone.trim() !== '' && (
                <TextField
                  label="Teléfono:"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Ej: +591 77123456"
                  type="text"
                  error={errors.phone}
                  className="w-full"
                />
              )}

              {/* Campo 7: País de residencia - Solo si tiene valor */}
              {formData.country && formData.country.trim() !== '' && (
                <div className="flex flex-col justify-start">
                  <label className={STYLES.INPUT_LABEL}>País de residencia:</label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    disabled={isLoading}
                    className={`${STYLES.SELECT} ${
                      formData.country === "" ? STYLES.SELECT_PLACEHOLDER : STYLES.SELECT_VALUE
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

              {/* Campo 8: Imagen de perfil - Siempre visible */}
              <div className={STYLES.IMAGE_WRAPPER}>
                <span className={STYLES.INPUT_LABEL}>Imagen de perfil:</span>
                <ImageUpload
                  onImageSelect={(file) => handleChange("profileImage", file)}
                  initialImageUrl={formData.profileImageUrl ?? null}
                />
              </div>
            </div>

            {/* Mensajes de error y éxito */}
            {submitError && (
              <p className="text-red-400 text-sm font-inter">{submitError}</p>
            )}
            {submitSuccess && (
              <p className="text-green-400 text-sm font-inter">
                Información actualizada correctamente.
              </p>
            )}
          </div>

          {/* Footer con botones */}
          <div className={STYLES.FOOTER}>
            <Button variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={handleAcept} 
              disabled={isSubmitting || isFormIncomplete}
            >
              {isSubmitting ? "Guardando..." : "Aceptar"}
            </Button>
          </div>
        </div>
      </PopUpCard>
    </div>
  );
};

export default EditPersonalInfoCard;