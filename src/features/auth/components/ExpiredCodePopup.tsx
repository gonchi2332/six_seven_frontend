import Button from "../../../components/Button/Button";

interface ExpiredCodePopupProps {
  onResendCode?: () => void;
  onGoHome?: () => void;
}

const ExpiredCodePopup = ({ onResendCode, onGoHome }: ExpiredCodePopupProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-primary rounded-2xl w-full max-w-sm shadow-2xl py-8 px-6 flex flex-col items-center text-center gap-4">
        <div className="w-20 h-20 flex items-center justify-center border-7 rounded-full border-white/80">
          <i className="fa-solid fa-lock text-white text-3xl"></i>
        </div>

        <h2 className="text-3xl font-bold text-white leading-tight max-w-[210px]">
          Código Expirado
        </h2>

        <p className="text-[#90DDEF]/80 text-lg  leading-relaxed max-w-[180px] font-nunito italic">
          El código de verificación ha expirado
        </p>

        <p className="text-white text-[17px] leading-relaxed max-w-[160px] font-nunito">
          Solicita un nuevo código para continuar
        </p>

        <div className="flex flex-col gap-3 w-full mt-4 items-center">
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