import TextField from "../../../components/TextField";
import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";
import { useState } from "react";

const EditPersonalInfoCard = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastNamePaternal: "",
    lastNameMaternal: "",
    address: "",
    email: "",
    phone: "",
    country: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAcept = () => {
    //apartado para backend
  };
  const handleCancel = () => {
    //apartado para backend
  };
  return (
    <div>
      <PopUpCard title={"Editar Perfil"}>
        <div>
          <div className="flex flex-col gap-6 px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="Nombres:"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="Ej: Juan Dominic"
                className="w-full"
              />
              <TextField
                label="Apellido Paterno:"
                onChange={(e) =>
                  handleChange("lastNamePaternal", e.target.value)
                }
                value={formData.lastNamePaternal}
                placeholder="Ej: Pérez"
                className="w-full"
              />
              <TextField
                label="Apellido Materno:"
                value={formData.lastNameMaternal}
                onChange={(e) =>
                  handleChange("lastNameMaternal", e.target.value)
                }
                placeholder="Ej: Sanchez"
                className="w-full"
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
                className="w-full"
              />
              <TextField
                label="Teléfono:"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Ej: 77123456"
                type="text"
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="País de residencia:"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                placeholder="Ej: Bolivia"
                className="w-full"
              />
              {/* espacios vacios para que el input no se estire mucho, si se anaden mas botones borrar estos */}
              <div className="hidden md:block"></div>
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
