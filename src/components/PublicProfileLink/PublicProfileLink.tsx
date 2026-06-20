import { useState } from "react";
import { Check, Copy } from "lucide-react";
import Button from "../../components/Button";
import PopUpCard from "../../components/PopUpCard";

const STYLES = {
  CONTAINER: "flex flex-col gap-4 sm:gap-6 p-3 sm:p-4 w-full max-w-[95vw] sm:max-w-xl",
  DESCRIPTION: "text-surface text-sm sm:text-base font-nunito leading-relaxed",
  INPUT_GROUP: "relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2",
  INPUT: "w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 sm:pr-24 text-white font-nunito text-xs sm:text-sm outline-none focus:border-accent/50 transition-all cursor-default truncate",
  COPY_AREA: "sm:absolute sm:right-2 flex items-center justify-center sm:justify-end",
  FOOTER: "flex justify-end mt-2"
};

interface ShareProfileModalProps {
  username: string;
  onClose: () => void;
}

const ShareProfileModal = ({ username, onClose }: ShareProfileModalProps) => {
  const [copied, setCopied] = useState(false);
  
  // URL pública del portafolio del usuario
  const publicUrl = `${window.location.origin}/ver/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    // Restaura el ícono tras 2 segundos
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PopUpCard title="Generar Enlace a Portafolio Público">
      <div className={STYLES.CONTAINER}>
        <p className={STYLES.DESCRIPTION}>
          Cualquier persona con este enlace podrá ver tu portafolio profesional, habilidades y experiencia.
        </p>
        <div className={STYLES.INPUT_GROUP}>
          <input 
            type="text" 
            readOnly 
            value={publicUrl} 
            className={STYLES.INPUT}
          />
          <div className={STYLES.COPY_AREA}>
            <button
              onClick={handleCopy}
              className={`flex items-center justify-center gap-2 px-4 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all w-full sm:w-auto ${
                copied 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                  : "bg-accent text-secondary hover:scale-105 active:scale-95"
              }`}
            >
              {copied ? (
                <><Check size={14} /> Copiado</>
              ) : (
                <><Copy size={14} /> Copiar</>
              )}
            </button>
          </div>
        </div>
        <div className={STYLES.FOOTER}>
          <Button variant="secondary" onClick={onClose} fullWidth >
            Cerrar
          </Button>
        </div>
      </div>
    </PopUpCard>
  );
};

export default ShareProfileModal;