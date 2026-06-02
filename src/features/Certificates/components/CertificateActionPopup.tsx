import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";
import type { Certificate } from "../../../services/certificateService";

interface Props {
    certificate: Certificate;
    onView: () => void;
    onModify: () => void;
    onDelete: () => void;
    onClose: () => void;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 py-4 z-50",
    buttonsWrapper: "flex flex-row flex-wrap sm:flex-nowrap gap-2 justify-center mt-2 px-4 sm:px-6 pb-6",
};

const CertificateActionPopup = ({ certificate, onView, onModify, onDelete, onClose }: Props) => {
    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-sm sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <PopUpCard title={certificate.title}>
                    <div className={styles.buttonsWrapper}>
                        <Button type="button" variant="primary" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="button" variant="primary" onClick={onDelete}>
                            Eliminar
                        </Button>
                        <Button type="button" variant="secondary" onClick={onView}>
                            Ver
                        </Button>
                        <Button type="button" variant="secondary" onClick={onModify}>
                            Modificar
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default CertificateActionPopup;
