import Button from "../../../components/Button/Button";
import PopUpCard from "../../../components/PopUpCard/PopUpCard";
import type { EducationEntry } from "../services/educationService";

/*
  Props del componente EducationPopup:
  -isOpen: Controla si el popup es visible
  -entry: Entrada de formación académica seleccionada (null si no hay)
  -onClose: Función ejecutada al cerrar el popup
  -onEdit: Función ejecutada al hacer clic en "Modificar", recibe la entrada
  -onDelete: Función ejecutada al hacer clic en "Eliminar", recibe la entrada
  -onView: Función ejecutada al hacer clic en "Ver"
*/
interface Props {
    isOpen: boolean;
    entry: EducationEntry | null;
    onClose: () => void;
    onEdit: (entry: EducationEntry) => void;
    onDelete: (entry: EducationEntry) => void;
    onView: () => void;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50",
    buttonContainer: "flex flex-col sm:flex-row flex-wrap gap-2 px-4 sm:px-6 pb-6 justify-center w-full",
    btnWide: "w-full sm:flex-1 sm:min-w-6",
};

/*
  Características:
  -Popup de acciones para una entrada de formación académica
  -Muestra el título del grado académico en la cabecera del PopUpCard
  -Si isOpen es false o no hay entry, no se renderiza (retorna null)
  -Botones: Cancelar (cierra), Eliminar, Ver, Modificar
  -Diseño responsive: en móvil los botones se apilan verticalmente, en desktop se distribuyen en fila
  -Cada botón ejecuta su respectiva función callback

  @ Ejemplo:
  <EducationPopup
    isOpen={showPopup}
    entry={selectedEducation}
    onClose={() => setShowPopup(false)}
    onEdit={(entry) => openEditForm(entry)}
    onDelete={(entry) => confirmDelete(entry)}
    onView={() => openViewDetail()}
  />
*/
const EducationPopup = ({ isOpen, entry, onClose, onEdit, onDelete, onView }: Props) => {
    if (!isOpen || !entry) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className="flex-col w-full max-w-sm sm:max-w-160" onClick={(e) => e.stopPropagation()}>
                <PopUpCard title={entry.degree}>
                    <div className={styles.buttonContainer}>
                        <div className={styles.btnWide}>
                            <Button variant="primary" onClick={onClose} fullWidth>
                                Cancelar
                            </Button>
                        </div>
                        <div className={styles.btnWide}>
                            <Button variant="primary" onClick={() => onDelete(entry)} fullWidth>
                                Eliminar
                            </Button>
                        </div>
                        <div className={styles.btnWide}>
                            <Button variant="secondary" onClick={onView} fullWidth>
                                Ver
                            </Button>
                        </div>
                        <div className={styles.btnWide}>
                            <Button variant="secondary" onClick={() => onEdit(entry)} fullWidth>
                                Modificar
                            </Button>
                        </div>

                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default EducationPopup;

