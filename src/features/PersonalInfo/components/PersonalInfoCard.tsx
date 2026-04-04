import TextField from "../../../components/TextField";
import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";

interface PersonalInfoCardProps {
  title: string;
}

const PersonalInfoCard = ({ title }: PersonalInfoCardProps) => {
  return (
    <div>
      <PopUpCard title={title}>
        <div>
          <div className="flex flex-col gap-6 px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="Nombres:"
                value=""
                onChange={() => {}}
                placeholder="Ej: Juan Dominic"
                className="w-full"
              />
              <TextField
                label="Apellido Paterno:"
                value=""
                onChange={() => {}}
                placeholder="Ej: Pérez"
                className="w-full"
              />
              <TextField
                label="Apellido Materno:"
                value=""
                onChange={() => {}}
                placeholder="Ej: Sanchez"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="Dirección:"
                value=""
                onChange={() => {}}
                placeholder="Ej: Av. San Martin 123"
                className="w-full"
              />
              <TextField
                label="Correo de contacto:"
                value=""
                onChange={() => {}}
                placeholder="Ej: juan@ejemplo.com"
                type="email"
                className="w-full"
              />
              <TextField
                label="Teléfono:"
                value=""
                onChange={() => {}}
                placeholder="Ej: 77123456"
                type="text"
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="País de residencia:"
                value=""
                onChange={() => {}}
                placeholder="Ej: Bolivia"
                className="w-full"
              />
              {/* espacios vacios para que el input no se estire mucho, si se anaden mas botones borrar estos */}
              <div className="hidden md:block"></div>
              <div className="hidden md:block"></div>
            </div>
          </div>
          <div className="flex flex-row justify-end items-center gap-4 mt-10 pt-6 px-8">
            <Button variant="secondary">Cerrar Sesión</Button>
            <Button variant="secondary">Cancelar</Button>
            <Button variant="primary">Aceptar</Button>
          </div>
        </div>
      </PopUpCard>
    </div>
  );
};

export default PersonalInfoCard;
