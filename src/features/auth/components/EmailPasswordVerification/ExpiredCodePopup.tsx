import Button from "../../../../components/Button/Button";

const EXPIRED_CONTAINER = "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6";
const EXPIRED_CARD = "bg-primary rounded-2xl w-full max-w-sm shadow-2xl py-6 min-h-[450px] flex flex-col items-center px-10 text-center";
const EXPIRED_ICON_WRAPPER = "w-20 h-20 flex items-center justify-center bg-black rounded-full shadow-lg border border-white/10 mb-4";
const EXPIRED_TITLE = "text-[24px] md:text-3xl font-inter font-bold text-surface max-w-[240px] mb-5";
const EXPIRED_SUBTITLE = "text-[18px] font-nunito font-normal text-[#90DDEF] italic max-w-[210px] mb-5";
const EXPIRED_MESSAGE = "text-[18px] font-nunito font-normal text-surface max-w-[210px] mb-7";
const EXPIRED_BUTTONS_WRAPPER = "flex flex-col items-center gap-3 w-[260px] mx-auto mt-auto";

interface ExpiredCodePopupProps {
  onResendCode?: () => void;
  onGoHome?: () => void;
}

const ExpiredCodePopup = ({ onResendCode, onGoHome }: ExpiredCodePopupProps) => {
  return (
    <div className={EXPIRED_CONTAINER}>
      <div className={EXPIRED_CARD}>
        <div className={EXPIRED_ICON_WRAPPER}>
          <i className="fa-solid fa-lock text-white text-3xl"></i>
        </div>

        <h2 className={EXPIRED_TITLE}>
          Código Expirado
        </h2>

        <p className={EXPIRED_SUBTITLE}>
          El código de verificación ha expirado
        </p>

        <p className={EXPIRED_MESSAGE}>
          Solicita un nuevo código para continuar
        </p>

        <div className={EXPIRED_BUTTONS_WRAPPER}>
          <Button variant="secondary" onClick={onResendCode} fullWidth>
            Reenviar Código
          </Button>

          <Button variant="primary" onClick={onGoHome} fullWidth>
            Volver al Inicio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpiredCodePopup;