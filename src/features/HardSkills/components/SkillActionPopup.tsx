import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";
import type { Skill } from "../types/skill.types";

/*
  Props del componente SkillActionPopup:
  -skill: Objeto con los datos de la habilidad (muestra su nombre en el título)
  -onView: Función ejecutada al hacer clic en "Ver"
  -onModify: Función ejecutada al hacer clic en "Modificar"
  -onDelete: Función ejecutada al hacer clic en "Eliminar"
  -onClose: Función ejecutada al hacer clic en "Cancelar" o cerrar
*/
interface Props {
    skill: Skill;
    onView: () => void;
    onModify: () => void;
    onDelete: () => void;
    onClose: () => void;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 py-4 z-50",
    buttonsWrapper: "flex flex-row flex-wrap gap-2 justify-center mt-2 px-4 sm:px-6 pb-6",
};

/*
  Características:
  -Popup de acciones para una habilidad (técnica o blanda)
  -Muestra el nombre de la habilidad en la cabecera del PopUpCard
  -Botones: Cancelar (cierra), Eliminar, Ver, Modificar
  -Diseño responsive: en móvil los botones se envuelven (flex-wrap), en desktop van en una línea
  -Cada botón ejecuta su respectiva función callback

  @ Ejemplo:
  <SkillActionPopup
    skill={{ skill_id: 1, name: "JavaScript", level: 4 }}
    onView={() => viewSkillDetails(skill)}
    onModify={() => openEditModal(skill)}
    onDelete={() => confirmDelete(skill)}
    onClose={() => setShowPopup(false)}
  />
*/
const SkillActionPopup = ({ skill, onView, onModify, onDelete, onClose }: Props) => {
    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <PopUpCard title={skill.name}>
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

export default SkillActionPopup;