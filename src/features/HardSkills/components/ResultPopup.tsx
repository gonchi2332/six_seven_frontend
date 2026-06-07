import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";

const OVERLAY = "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 py-4 z-50";
const MESSAGE = "text-[15px] font-nunito text-white text-center px-6 sm:px-8 pb-1";
const SUBTITLE = "text-[13px] font-nunito text-white/60 text-center px-6 sm:px-8 pb-4";
const BUTTONS_WRAPPER = "flex gap-4 justify-center mt-2 px-6 sm:px-8 pb-6";

export type ResultType = "success" | "not-found";

// Contenido dinámico según tipo de resultado
const CONTENT: Record<ResultType, { title: string; message: string; subtitle?: string }> = {
    success: {
        title: "Habilidad Registrada",
        message: "La habilidad ha sido añadida exitosamente.",
    },
    "not-found": {
        title: "Habilidad No Reconocida",
        message: "La habilidad introducida no corresponde a ninguna habilidad técnica reconocible dentro del campo de la informática, ciencias de la computación y desarrollo de software.",
    },
};

interface Props {
    type: ResultType;
    onClose: () => void;
}

// Popup de resultado (éxito o error "no encontrado")
const ResultPopup = ({ type, onClose }: Props) => {
    const { title, message, subtitle } = CONTENT[type];
    return (
        <div className={OVERLAY}>
            <div className="w-full max-w-xs sm:max-w-sm max-h-[90vh] overflow-y-auto">
                <PopUpCard title={title}>
                    <p className={MESSAGE}>{message}</p>
                    {subtitle && <p className={SUBTITLE}>{subtitle}</p>}
                    <div className={BUTTONS_WRAPPER}>
                        <Button variant="primary" onClick={onClose} fullWidth>
                            Registrar
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default ResultPopup;