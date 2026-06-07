import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";

/*
  Props del componente DeleteCertificatePopup:
  -title: Título del certificado que se va a eliminar (se muestra en el mensaje)
  -onConfirm: Función ejecutada al confirmar la eliminación
  -onClose: Función ejecutada al cancelar o cerrar
  -isSubmitting: Estado de carga, deshabilita botones mientras es true
*/
interface Props {
    title: string;
    onConfirm: () => void;
    onClose: () => void;
    isSubmitting?: boolean;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 py-4 z-50",
    message: "text-[15px] sm:text-[16px] font-nunito text-surface text-center px-4 sm:px-8 pb-4",
    highlight: "text-white font-semibold",
    buttonsWrapper: "flex gap-3 justify-center mt-2 px-4 sm:px-8 pb-6",
};

/*
  Características:
  -Popup de confirmación para eliminar un certificado
  -Muestra mensaje con el título del certificado a eliminar
  -Botón Cancelar: cierra el popup sin eliminar
  -Botón Eliminar: ejecuta onConfirm
  -Cuando isSubmitting es true, ambos botones se deshabilitan y el texto del botón Eliminar cambia a "Eliminando..."

  @ Ejemplo:
  <DeleteCertificatePopup
    title="AWS Certified Solutions Architect"
    onConfirm={() => handleDelete(certificateId)}
    onClose={() => setShowPopup(false)}
    isSubmitting={isDeleting}
  />
*/
const DeleteCertificatePopup = ({ title, onConfirm, onClose, isSubmitting = false }: Props) => {
    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm max-h-[90vh] overflow-y-auto">
                <PopUpCard title="Eliminar Certificado">
                    <p className={styles.message}>
                        ¿Estás seguro que quieres eliminar
                        <span className={styles.highlight}> {title}</span>?
                    </p>
                    <div className={styles.buttonsWrapper}>
                        <Button type="button" variant="secondary" onClick={onClose} fullWidth disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="button" variant="primary" onClick={onConfirm} fullWidth disabled={isSubmitting}>
                            {isSubmitting ? "Eliminando..." : "Eliminar"}
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default DeleteCertificatePopup;

