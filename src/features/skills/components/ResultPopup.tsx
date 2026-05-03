import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";

const OVERLAY = "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50";
const MESSAGE = "text-[16px] font-nunito text-white text-center px-6 sm:px-8 pb-1";
const SUBTITLE = "text-[13px] font-nunito text-white/60 text-center px-6 sm:px-8 pb-4";
const BUTTONS_WRAPPER = "flex gap-4 justify-center mt-2 px-6 sm:px-8 pb-6";

export type ResultType = "success" | "not-found";

const CONTENT: Record<ResultType, { title: string; message: string; subtitle?: string }> = {
  success: {
    title: "Habilidad Registrada",
    message: "La habilidad ya existe y ha sido añadida exitosamente.",
  },
  "not-found": {
    title: "Habilidad No Encontrada",
    message: "La habilidad no existe.",
    subtitle: "La sugerencia estará sujeta a evaluación.",
  },
};

interface Props {
  type: ResultType;
  onClose: () => void;
}

const ResultPopup = ({ type, onClose }: Props) => {
  const { title, message, subtitle } = CONTENT[type];
  return (
    <div className={OVERLAY}>
      <div className="w-full max-w-xs sm:max-w-sm">
        <PopUpCard title={title}>
          <p className={MESSAGE}>{message}</p>
          {subtitle && <p className={SUBTITLE}>{subtitle}</p>}
          <div className={BUTTONS_WRAPPER}>
            <Button variant="primary" onClick={onClose} fullWidth>
              Aceptar
            </Button>
          </div>
        </PopUpCard>
      </div>
    </div>
  );
};

export default ResultPopup;