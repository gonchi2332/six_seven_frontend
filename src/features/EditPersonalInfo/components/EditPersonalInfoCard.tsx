import TextField from "../../../components/TextField";
import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";
import ImageUpload from "../../UploadFile/components/uploadFile";
import { useCountries } from "../../../hooks/useCountries";
import { useProfileForm } from "../../../hooks/useProfileFormRegex"; 

interface EditPersonalInfoCardProps {
  onClose?: () => void;
}
const EditPersonalInfoCard = ({ onClose }: EditPersonalInfoCardProps) => {
  const { countries, isLoading } = useCountries();
  const { formData, errors, handleChange, validateForm } = useProfileForm();

  const handleAcept = () => {
    if (!validateForm()) {
      // si existen errores
      return;
    }
    // apartado para backend
  };
  const handleCancel = () => {
    onClose?.();
  };

  return (
    <div>
      <PopUpCard title={"Datos Personales"}>
        <div>
          <div className="flex flex-col gap-6 px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="Nombre(s)*:"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                error={errors.firstName}
                className="w-full"
                disabled={true} 
              />
              <TextField
                label="Apellido Paterno*:"
                onChange={(e) =>
                  handleChange("lastNamePaternal", e.target.value)
                }
                value={formData.lastNamePaternal}
                error={errors.lastNamePaternal}
                className="w-full"
                disabled={true}
              />
              <TextField
                label="Apellido Materno:"
                value={formData.lastNameMaternal}
                onChange={(e) =>
                  handleChange("lastNameMaternal", e.target.value)
                }
                error={errors.lastNameMaternal}
                className="w-full"
                disabled={true} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col justify-start">
                <label className="mb-1 text-xl font-inter text-white">
                  País de residencia:
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border rounded-xl outline-none transition-all duration-200 bg-white font-nunito disabled:cursor-not-allowed border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                    formData.country === "" ? "text-gray-400" : "text-black"
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

              <div className="flex flex-col gap-2">
                <span className="mb-1 text-xl font-inter text-white">Imagen de perfil:</span>
                <ImageUpload 
                  onImageSelect={(file) => handleChange("profileImage", file)} 
                />
              </div>
              <div className="hidden md:block"></div>
            </div>
          </div>
          <div className="flex flex-row justify-end items-center gap-4 mt-10 pt-6 px-8">
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