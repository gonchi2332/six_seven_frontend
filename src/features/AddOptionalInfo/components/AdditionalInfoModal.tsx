import TextField from "../../../components/TextField";
import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";
import { useCountries } from "../../../hooks/useCountries";
import { useProfileForm } from "../../../hooks/useProfileFormRegex";
import { usePersonalInfoSubmit } from "../../../hooks/usePersonalInfoSubmit";

const STYLES = {
    FORM_WRAPPER: "flex flex-col gap-4 px-6",
    INPUT_LABEL: "mb-1 text-sm font-inter text-white",
    SELECT: "w-full px-3 py-1.5 border rounded-xl outline-none transition-all duration-200 bg-white font-nunito disabled:cursor-not-allowed border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm",
    SELECT_PLACEHOLDER: "text-gray-400",
    SELECT_VALUE: "text-black",
    IMAGE_WRAPPER: "flex flex-col gap-2",
    FOOTER: "flex flex-row justify-end items-center gap-3 mt-6 pt-4 px-6",
};

interface AdditionalInfoModalProps {
    onClose?: () => void;
}

const AdditionalInfoModal = ({ onClose }: AdditionalInfoModalProps) => {
    const { countries, isLoading } = useCountries();
    const { formData, errors, handleChange, validateForm } = useProfileForm();
    const { handleSubmit, isSubmitting, submitError, submitSuccess } = usePersonalInfoSubmit();

    const handleAcept = async () => {
        if (!validateForm()) return;
        await handleSubmit(formData);
    };

    const handleCancel = () => {
        onClose?.();
    };


    return (
        <div>
            <PopUpCard title="Datos Personales">
                <div>
                    <div className={STYLES.FORM_WRAPPER}>

                        <TextField
                            label="Apellido:"
                            value={formData.secondSurname}
                            onChange={(e) => handleChange("secondSurname", e.target.value)}
                            error={errors.secondSurname}
                            className="w-full"
                        />

                        <TextField
                            label="Ciudad:"
                            value={formData.city}
                            onChange={(e) => handleChange("city", e.target.value)}
                            error={errors.city}
                            className="w-full"
                            placeholder="Ej: Av. San Martin 123"
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
                        <div className="flex flex-col justify-start">
                            <label className={STYLES.INPUT_LABEL}>País de residencia:</label>
                            <select
                                value={formData.country}
                                onChange={(e) => handleChange("country", e.target.value)}
                                disabled={isLoading}
                                className={`${STYLES.SELECT} ${formData.country === "" ? STYLES.SELECT_PLACEHOLDER : STYLES.SELECT_VALUE
                                    }`}
                            >
                                <option value="" disabled className="text-gray-400 hidden">
                                    {isLoading ? "Cargando países..." : "Ej: Bolivia"}
                                </option>
                                {countries.map((country) => (
                                    <option key={country} value={country} className="text-black">
                                        {country}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="hidden md:block" />

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
                        <Button variant="primary" onClick={handleAcept} disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : "Aceptar"}
                        </Button>
                    </div>
                </div>
            </PopUpCard>
        </div>
    );
};

export default AdditionalInfoModal;
