import TextField from "../../../components/TextField";
import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";
import ImageUpload from "../../UploadFile/components/uploadFile";
import { useCountries } from "../../../hooks/useCountries";
import { useProfileForm } from "../../../hooks/useProfileFormRegex";

const STYLES = {
  FORM_WRAPPER: "flex flex-col gap-6 px-8",
  GRID_3: "grid grid-cols-1 md:grid-cols-3 gap-4",
  INPUT_LABEL: "mb-1 text-xl font-inter text-white",
  SELECT: "w-full px-4 py-2 border rounded-xl outline-none transition-all duration-200 bg-white font-nunito disabled:cursor-not-allowed border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
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
  const { formData, errors, handleChange, validateForm } = useProfileForm();

  const handleAcept = () => {
    if (!validateForm()) return;
    // apartado para backend
  };

  const handleCancel = () => {
    onClose?.();
  };

  return (
    <div>
      <PopUpCard title="Datos Personales">
        <div>
          <div className={STYLES.FORM_WRAPPER}>

            <div className={STYLES.GRID_3}>
              <TextField
                label="Nombre(s)*:"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                error={errors.firstName}
                className="w-full"
                disabled
              />
              <TextField
                label="Apellido Paterno*:"
                value={formData.lastNamePaternal}
                onChange={(e) => handleChange("lastNamePaternal", e.target.value)}
                error={errors.lastNamePaternal}
                className="w-full"
                disabled
              />
              <TextField
                label="Apellido Materno:"
                value={formData.lastNameMaternal}
                onChange={(e) => handleChange("lastNameMaternal", e.target.value)}
                error={errors.lastNameMaternal}
                className="w-full"
                disabled
              />
            </div>

            <div className={STYLES.GRID_3}>
              <TextField
                label="Dirección:"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Ej: Av. San Martin 123"
                className="w-full"
              />
              <TextField
                label="Correo de contacto:"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Ej: juan@ejemplo.com"
                type="email"
                error={errors.email}
                className="w-full"
              />
              <TextField
                label="Teléfono:"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Ej: +591 77123456"
                type="text"
                error={errors.phone}
                className="w-full"
              />
            </div>

            <div className={STYLES.GRID_3}>
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
                    {isLoading ? "Cargando países..." : "Ej: Bolivia"}
                  </option>
                  {countries.map((countryName, index) => (
                    <option key={index} value={countryName} className="text-black">
                      {countryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className={STYLES.IMAGE_WRAPPER}>
                <span className={STYLES.INPUT_LABEL}>Imagen de perfil:</span>
                <ImageUpload
                  onImageSelect={(file) => handleChange("profileImage", file)}
                />
              </div>

              <div className="hidden md:block" />
            </div>
          </div>

          <div className={STYLES.FOOTER}>
            <Button variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleAcept}>
              Aceptar
            </Button>
          </div>
        </div>
      </PopUpCard>
    </div>
  );
};

export default EditPersonalInfoCard;