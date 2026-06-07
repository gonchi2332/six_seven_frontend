import Button from "../../../components/Button/Button";
import PopUpCard from "../../../components/PopUpCard/PopUpCard";

/*
  Props del componente DeleteEducationPopup:
  -degree: Título o nombre del grado académico a eliminar (se muestra en el mensaje)
  -onConfirm: Función ejecutada al confirmar la eliminación
  -onClose: Función ejecutada al cerrar el popup (sin back)
  -onBack: Función ejecutada para volver atrás (cuando el popup está en un flujo)
  -isSubmitting: Estado de carga, deshabilita botones mientras es true
*/
interface Props {
    degree: string;
    onConfirm: () => void;
    onClose: () => void;
    onBack?: () => void;
    isSubmitting?: boolean;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50",
    message: "text-[15px] sm:text-[16px] font-nunito text-surface text-center px-4 sm:px-8 pb-4",
    highlight: "text-white font-semibold",
    buttonsWrapper: "flex gap-3 justify-center mt-2 px-4 sm:px-8 pb-6",
};

/*
  Características:
  -Popup de confirmación para eliminar un registro de formación académica
  -Muestra mensaje con el nombre del grado académico a eliminar
  -Botón Cancelar: si existe onBack lo ejecuta, si no ejecuta onClose
  -Botón Eliminar: ejecuta onConfirm
  -Cuando isSubmitting es true, ambos botones se deshabilitan y el texto del botón Eliminar cambia a "Eliminando..."

  @ Ejemplo:
  <DeleteEducationPopup
    degree="Ingeniería en Sistemas"
    onConfirm={() => handleDelete(educationId)}
    onClose={() => setShowPopup(false)}
    onBack={() => setShowMenu(true)}
    isSubmitting={isDeleting}
  />
*/
const DeleteEducationPopup = ({ degree, onConfirm, onClose, onBack, isSubmitting = false }: Props) => {
    const handleCancel = () => {
        if (onBack) onBack();
        else onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm">
                <PopUpCard title="Eliminar Formación Académica">
                    <p className={styles.message}>
                        ¿Estás seguro que deseas eliminar
                        <span className={styles.highlight}> {degree}</span>?
                    </p>
                    <div className={styles.buttonsWrapper}>
                        <Button type="button" variant="secondary" onClick={handleCancel} fullWidth disabled={isSubmitting}>
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

export default DeleteEducationPopup;

