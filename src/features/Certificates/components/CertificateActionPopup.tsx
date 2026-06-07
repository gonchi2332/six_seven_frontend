import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";
import type { Certificate } from "../services/certificateService";

/*
  Props del componente CertificateActionPopup:
  -certificate: Objeto con los datos del certificado (título, etc.)
  -onView: Función ejecutada al hacer clic en "Ver"
  -onModify: Función ejecutada al hacer clic en "Modificar"
  -onDelete: Función ejecutada al hacer clic en "Eliminar"
  -onClose: Función ejecutada al hacer clic en "Cancelar" o cerrar
*/
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

/*
  Características:
  -Popup de acciones para un certificado específico
  -Muestra el título del certificado en la cabecera del PopUpCard
  -Botones: Cancelar (cierra), Eliminar, Ver, Modificar
  -Diseño responsive: en móvil los botones se envuelven, en desktop van en una línea
  -Cada botón ejecuta su respectiva función callback sin lógica adicional

  @ Ejemplo:
  <CertificateActionPopup
    certificate={{ id: 1, title: "Certificado Java" }}
    onView={() => openPDF(certificate.url)}
    onModify={() => openEditModal(certificate)}
    onDelete={() => confirmDelete(certificate.id)}
    onClose={() => setShowPopup(false)}
  />
*/
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

