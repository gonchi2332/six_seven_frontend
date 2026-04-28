import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";

const OVERLAY = "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50";
const MESSAGE = "text-[18px] font-nunito text-surface text-center px-6 sm:px-8 pb-4";
const BUTTONS_WRAPPER = "flex gap-4 justify-center mt-2 px-6 sm:px-8";

interface Props {
  skillName: string;
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteSkillPopup = ({ skillName, onConfirm, onClose }: Props) => {
  return (
    <div className={OVERLAY}>
      <div className="w-full max-w-xs sm:max-w-sm">
        <PopUpCard title="Eliminar Habilidad">
          <p className={MESSAGE}>
            ¿Estás seguro que quieres eliminar esta habilidad?
          </p>
          <div className={BUTTONS_WRAPPER}>
            <Button variant="secondary" onClick={onClose} fullWidth>
              Cancelar
            </Button>
            <Button variant="primary" onClick={onConfirm} fullWidth>
              Aceptar
            </Button>
          </div>
        </PopUpCard>
      </div>
    </div>
  );
};

export default DeleteSkillPopup;