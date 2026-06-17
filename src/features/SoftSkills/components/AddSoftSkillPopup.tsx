import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";
import TextField from "../../../components/TextField";
import useAddSoftSkill from "../hooks/useAddSoftSkill";
import type { SoftSkill } from "../services/softSkillService";

interface AddSoftSkillPopupProps {
    onSubmit: (name: string) => void;
    onClose: () => void;
    username: string;
    userSkills: SoftSkill[];
    isSubmitting?: boolean;
    catalogSkills?: string[];
}

const LATIN_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/;

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 py-4 z-50",
    formWrapper: "flex flex-col gap-4 px-6 sm:px-8 pb-2",
    buttonsWrapper: "flex gap-4 justify-center mt-2 px-6 sm:px-8 pb-6",
    required: "text-white ml-0.5",
    inlineError: "mt-1 text-xs text-red-600 font-medium self-end",
    // Unificado con el estado disabled visualmente claro (bg-gray-100 y text-gray-400)
    inputBase: "w-full px-4 py-2 border rounded-xl outline-none transition-all duration-200 bg-white font-nunito disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400",
    inputNormal: "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
    inputError: "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50",
    inputDisabled: "border-gray-300 opacity-60",
    dropdown: "absolute top-full left-0 right-0 mt-1 z-10 rounded-xl border border-gray-300 bg-white overflow-hidden max-h-44 overflow-y-auto shadow-lg",
    dropdownItem: "w-full text-left px-4 py-2.5 text-[15px] font-nunito text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 cursor-pointer",
    checkboxWrapper: "flex items-center gap-3 cursor-pointer select-none w-fit group mt-1", // mt-1 unificado
    checkboxBox: (active: boolean) => `w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${active ? "bg-white border-white scale-105 shadow-sm" : "bg-transparent border-white/50 group-hover:border-white"}`,
    checkboxLabel: (active: boolean) => `text-[16px] text-white font-nunito transition-all duration-200 ${active ? "text-white font-semibold" : "text-surface/70 group-hover:text-white"}`,
};

const AddSoftSkillPopup = ({
    onSubmit, onClose, username, userSkills, isSubmitting = false, catalogSkills = [],
}: AddSoftSkillPopupProps) => {
    const {
        search, suggestions, showDropdown, setShowDropdown, isOther, otherName,
        topError, inlineError, hasFieldError, loading, isDisabled, containerRef,
        handleSearchChange, handleSelectSuggestion, handleToggleOther,
        handleOtherNameChange, handleConfirm,
    } = useAddSoftSkill(onSubmit, onClose, username, catalogSkills);

    void userSkills;

    const getInputClass = () => {
        if (isOther) return `${styles.inputBase} ${styles.inputDisabled}`;
        if (hasFieldError) return `${styles.inputBase} ${styles.inputError}`;
        return `${styles.inputBase} ${styles.inputNormal}`;
    };

    const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!LATIN_REGEX.test(e.target.value)) return;
        handleOtherNameChange(e);
    };

    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm max-h-[90vh] overflow-y-auto">
                <PopUpCard title="Registrar Habilidad Blanda">
                    {topError && (
                        <div className="mx-6 sm:mx-8 mb-2 p-3 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-nunito text-center">
                            {topError}
                        </div>
                    )}
                    <div className={styles.formWrapper}>
                        <div className="relative flex flex-col" ref={containerRef}>
                            <label className="mb-1 text-xl font-inter text-white">
                                Seleccionar habilidad:<span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearchChange}
                                onFocus={() => !isOther && search.trim() && setShowDropdown(true)}
                                placeholder={isOther ? "Buscador deshabilitado" : "Escriba y seleccione de la lista..."}
                                disabled={isOther || isSubmitting}
                                className={getInputClass()}
                            />
                            {!isOther && !hasFieldError && (
                                <span className="text-xs text-surface mt-1 font-nunito pl-1">
                                    El sistema sugerirá habilidades registradas a medida que escriba.
                                </span>
                            )}

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
                        <div className="pt-1">
                            <button type="button" onClick={handleToggleOther} className={styles.checkboxWrapper}>
                                <span className={styles.checkboxBox(isOther)}>
                                    {isOther && (
                                        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                                            <path d="M1 4L4 7.5L10 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </span>
                                <span className={styles.checkboxLabel(isOther)}>Mi habilidad no está en la lista (Otro)</span>
                            </button>
                        </div>

                        {isOther && (
                            <TextField
                                label="Nombre de la nueva habilidad:*"
                                value={otherName}
                                onChange={handleOtherChange}
                                placeholder="Ej: Trabajo en equipo..."
                                disabled={isSubmitting}
                                error={hasFieldError && inlineError ? inlineError : undefined}
                                maxLength={50}
                            />
                        )}
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

export default AddSoftSkillPopup;