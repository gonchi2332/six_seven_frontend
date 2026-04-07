import Button from "../../../../components/Button/Button";
import {
    EXPIRED_CONTAINER,
    EXPIRED_CARD,
    EXPIRED_ICON_WRAPPER,
    EXPIRED_TITLE,
    EXPIRED_SUBTITLE,
    EXPIRED_MESSAGE,
    EXPIRED_BUTTONS_WRAPPER
} from "./Verification.constats";

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
          <Button variant="secondary" onClick={onResendCode}>
            Reenviar Código
          </Button>

          <Button variant="primary" onClick={onGoHome}>
            Volver al Inicio
          </Button>
        </div>
        
      </div>
    </div>
  );
};

export default ExpiredCodePopup;