import { useState } from "react";
import { Check, Copy } from "lucide-react";
import Button from "../../components/Button";
import PopUpCard from "../../components/PopUpCard";

const STYLES = {
  CONTAINER: "flex flex-col gap-6 p-4 w-xl",
  DESCRIPTION: "text-surface text-xl font-nunito leading-relaxed",
  INPUT_GROUP: "relative flex items-center mt-2",
  INPUT: "w-full bg-black/40 border border-white/10 rounded-xl text-xl py-3 px-4 pr-24 text-white font-nunito text-sm outline-none focus:border-accent/50 transition-all cursor-default",
  COPY_AREA: "absolute right-2 flex items-center gap-2",
  FOOTER: "flex justify-end mt-2"
};

interface ShareProfileModalProps {
  username: string;
  onClose: () => void;
}

const ShareProfileModal = ({ username, onClose }: ShareProfileModalProps) => {
  const [copied, setCopied] = useState(false);
  
  // Construimos la URL completa
  const publicUrl = `${window.location.origin}/ver/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PopUpCard title="Generar enlace a perfil publico">
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                copied 
                  ? "bg-green-500/20 text-green-400" 
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
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </PopUpCard>
  );
};

export default ShareProfileModal;