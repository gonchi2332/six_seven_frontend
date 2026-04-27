import Button from "../../../components/Button";
import TextField from "../../../components/TextField";
import PopUpCard from "../../../components/PopUpCard";
import SkillLevelSelector from "./SkillLevelSelector";
import { useSkillForm } from "../hooks/useSkillForm";

const OVERLAY = "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50";
const FORM_WRAPPER = "flex flex-col gap-4 px-6 sm:px-8 pb-2";
const LABEL = "text-[18px] font-nunito text-surface";
const BUTTONS_WRAPPER = "flex gap-4 justify-center mt-2 px-6 sm:px-8";

interface Props {
  onSubmit: (name: string, level: number) => void;
  onClose: () => void;
}

const AddSkillPopup = ({ onSubmit, onClose }: Props) => {
  const { name, setName, level, setLevel, touched, isValid, handleSubmit, handleCancel } =
    useSkillForm({ onSubmit, onClose });

  return (
    <div className={OVERLAY}>
      <div className="w-full max-w-xs sm:max-w-sm">
        <PopUpCard title="Añadir Habilidad">
          <div className={FORM_WRAPPER}>
            <TextField
              label="Nombre de la habilidad:"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="HTML, React..."
              error={!isValid && touched ? "El nombre es requerido" : undefined}
            />
            <div>
              <p className={LABEL}>Porcentaje de conocimiento:</p>
              <SkillLevelSelector value={level} onChange={setLevel} />
            </div>
          </div>
          <div className={BUTTONS_WRAPPER}>
            <Button variant="primary" onClick={handleCancel} fullWidth>
              Cancelar
            </Button>
            <Button variant="secondary" onClick={handleSubmit} fullWidth>
              Aceptar
            </Button>
          </div>
        </PopUpCard>
      </div>
    </div>
  );
};

export default AddSkillPopup;