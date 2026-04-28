import Button from "../../../components/Button";
import TextField from "../../../components/TextField";
import PopUpCard from "../../../components/PopUpCard";
import SkillLevelSelector from "./SkillLevelSelector";
import { useSkillForm } from "../../../hooks/useSkillForm";
import type { Skill } from "../types/skill.types";

const OVERLAY = "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50";
const FORM_WRAPPER = "flex flex-col gap-4 px-6 sm:px-8 pb-2";
const LABEL = "text-[18px] font-nunito text-surface";
const BUTTONS_WRAPPER = "flex gap-4 justify-center mt-2 px-6 sm:px-8";
const FIELD_WRAPPER = "flex flex-col gap-0.5";
const ERROR = "text-red-300/90 font-nunito text-xs text-left mt-0.5";
const SERVER_ERROR = "mx-6 sm:mx-8 mb-2 p-3 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-nunito text-center";
const REQUIRED = "text-white ml-0.5";
const FIELD_LABEL = "text-[18px] font-nunito text-surface";

interface Props {
  skill: Skill;
  onSubmit: (id: string, name: string, level: number) => Promise<void>;
  onClose: () => void;
  serverError?: string | null;
  isSubmitting?: boolean;
}

const EditSkillPopup = ({ skill, onSubmit, onClose, serverError, isSubmitting = false }: Props) => {
  const { name, setName, level, setLevel, nameError, isSubmitting: localSubmitting, handleSubmit, handleCancel } =
    useSkillForm({
      initialName: skill.name,
      initialLevel: skill.level,
      onSubmit: async (n, l) => await onSubmit(skill.id, n, l),
      onClose,
    });

  const submitting = isSubmitting || localSubmitting;

  return (
    <div className={OVERLAY}>
      <div className="w-full max-w-xs sm:max-w-sm">
        <PopUpCard title="Editar Habilidad">
          {serverError && <div className={SERVER_ERROR}>{serverError}</div>}
          <div className={FORM_WRAPPER}>
            <div className={FIELD_WRAPPER}>
              <p className={FIELD_LABEL}>Nombre de la habilidad:<span className={REQUIRED}>*</span></p>
              <TextField
                label=""
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 50))}
                placeholder="HTML, React..."
                disabled={submitting}
              />
              {nameError && <p className={ERROR}>{nameError}</p>}
            </div>
            <div>
              <p className={LABEL}>Nivel de Conocimiento:<span className={REQUIRED}>*</span></p>
              <SkillLevelSelector value={level} onChange={setLevel} />
            </div>
          </div>
          <div className={BUTTONS_WRAPPER}>
            <Button variant="secondary" onClick={handleCancel} fullWidth disabled={submitting}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit} fullWidth disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </PopUpCard>
      </div>
    </div>
  );
};

export default EditSkillPopup;