import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";
import TextField from "../../../components/TextField";
import SkillLevelSelector from "./SkillLevelSelector";
import useAddSkill from "../hooks/useAddSkill";

/*
  Props del componente AddSkillPopup:
  -onSubmit: Función ejecutada al confirmar el registro, recibe nombre y nivel de la habilidad
  -onClose: Función ejecutada al cancelar o cerrar el popup
  -isSubmitting: Estado de carga externo (deshabilita botones)
  -catalogSkills: Lista de habilidades predefinidas del catálogo para autocompletado
*/
interface AddSkillPopupProps {
    onSubmit: (name: string, level: number) => void;
    onClose: () => void;
    isSubmitting?: boolean;
    catalogSkills?: string[];
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 py-4 z-50",
    formWrapper: "flex flex-col gap-4 px-6 sm:px-8 pb-2",
    buttonsWrapper: "flex gap-4 justify-center mt-2 px-6 sm:px-8 pb-6",
    label: "text-[16px] font-nunito text-surface mb-0.5",
    required: "text-white ml-0.5",
    inlineError: "mt-1 text-xs text-red-600 font-medium self-end",
    inputBase: "w-full px-4 py-2 border rounded-xl outline-none transition-all duration-200 bg-white font-nunito disabled:cursor-not-allowed",
    inputNormal: "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
    inputError: "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50",
    inputDisabled: "border-gray-300 opacity-50 cursor-not-allowed",
    dropdown: "absolute top-full left-0 right-0 mt-1 z-10 rounded-xl border border-gray-300 bg-white overflow-hidden max-h-44 overflow-y-auto shadow-lg",
    dropdownItem: "w-full text-left px-4 py-2.5 text-[15px] font-nunito text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 cursor-pointer",
    checkboxWrapper: "flex items-center gap-3 cursor-pointer select-none w-fit group",
    checkboxBox: (active: boolean) => `w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${active ? "bg-white border-white scale-105 shadow-sm" : "bg-transparent border-white/50 group-hover:border-white"}`,
    checkboxLabel: (active: boolean) => `text-[16px] text-white font-nunito transition-all duration-200 ${active ? "text-white font-semibold" : "text-surface/70 group-hover:text-white"}`,
};

/*
  Características:
  -Popup para registrar una nueva habilidad técnica
  -Dos modos de selección:
    1. Seleccionar del catálogo: input con autocompletado (sugerencias)
    2. "Otro": permite escribir nombre personalizado
  -Checkbox "Otro" para alternar entre modos
  -Nivel de habilidad: selector visual de 0-5 (SkillLevelSelector)
  -Validaciones: habilidad no duplicada, nivel requerido
  -Muestra sugerencias dinámicas mientras escribe
  -Mensajes de error: inline (campo) y top (error general)

  @ Ejemplo:
  <AddSkillPopup
    onSubmit={(name, level) => addHardSkill(name, level)}
    onClose={() => setShowPopup(false)}
    catalogSkills={["JavaScript", "Python", "React", "Node.js"]}
    isSubmitting={isLoading}
  />
*/
const AddSkillPopup = ({ onSubmit, onClose, isSubmitting = false, catalogSkills = [] }: AddSkillPopupProps) => {
    const {
        search, suggestions, showDropdown, setShowDropdown, isOther, otherName,
        level, setLevel, topError, inlineError, hasFieldError, loading, containerRef,
        isDisabled, handleSearchChange, handleSelectSuggestion, handleToggleOther,
        handleOtherNameChange, handleConfirm,
    } = useAddSkill(onSubmit, onClose, catalogSkills);

    const getInputClass = () => {
        if (isOther) return `${styles.inputBase} ${styles.inputDisabled}`;
        if (hasFieldError) return `${styles.inputBase} ${styles.inputError}`;
        return `${styles.inputBase} ${styles.inputNormal}`;
    };

    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm max-h-[90vh] overflow-y-auto">
                <PopUpCard title="Registrar Habilidad Técnica">
                    {topError && (
                        <div className="mx-6 sm:mx-8 mb-2 p-3 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-nunito text-center">
                            {topError}
                        </div>
                    )}
                    <div className={styles.formWrapper}>
                        <div className="relative flex flex-col" ref={containerRef}>
                            <label className="mb-1 text-xl font-inter text-white">
                                Seleccionar habilidad:<span className={styles.required}></span>
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearchChange}
                                onFocus={() => !isOther && search.trim() && setShowDropdown(true)}
                                placeholder="Ej: JavaScript, React..."
                                disabled={isOther || isSubmitting}
                                className={getInputClass()}
                            />
                            {!isOther && hasFieldError && inlineError && (
                                <span className={styles.inlineError}>{inlineError}</span>
                            )}
                            {showDropdown && !isOther && suggestions.length > 0 && (
                                <div className={styles.dropdown}>
                                    {suggestions.map((s) => (
                                        <button key={s} type="button" onClick={() => handleSelectSuggestion(s)} className={styles.dropdownItem}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button type="button" onClick={handleToggleOther} className={styles.checkboxWrapper}>
                            <span className={styles.checkboxBox(isOther)}>
                                {isOther && (
                                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                                        <path d="M1 4L4 7.5L10 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </span>
                            <span className={styles.checkboxLabel(isOther)}>Otro</span>
                        </button>

                        {isOther && (
                            <TextField
                                label="Nombre de la habilidad:*"
                                value={otherName}
                                onChange={handleOtherNameChange}
                                placeholder="Escribe el nombre..."
                                disabled={isSubmitting}
                                error={hasFieldError && inlineError ? inlineError : undefined}
                                maxLength={50}
                            />
                        )}

                        <div>
                            <p className={styles.label}>
                                Nivel de conocimiento:<span className={styles.required}>*</span>
                            </p>
                            <SkillLevelSelector value={level} onChange={setLevel} />
                        </div>
                    </div>

                    <div className={styles.buttonsWrapper}>
                        <Button type="button" variant="secondary" onClick={onClose} fullWidth disabled={loading || isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="button" variant="primary" onClick={handleConfirm} fullWidth disabled={isDisabled || isSubmitting}>
                            {loading ? "Verificando..." : isSubmitting ? "Guardando..." : "Registrar"}
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default AddSkillPopup;

