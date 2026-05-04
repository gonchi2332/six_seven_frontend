import Button from "../../components/Button";
import PopUpCard from "../../components/PopUpCard";
import SoftSkillResultPopup from "./SoftskillResultPopup";
import useAddSoftSkill from "../../hooks/useAddSoftSkill";
import type { SoftSkill } from "../../services/softSkillService";

interface AddSoftSkillPopupProps {
    onSubmit: (name: string) => void;
    onClose: () => void;
    username: string;
    userSkills: SoftSkill[];
    isSubmitting?: boolean;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50",
    formWrapper: "flex flex-col gap-4 px-6 sm:px-8 pb-2",
    buttonsWrapper: "flex gap-4 justify-center mt-2 px-6 sm:px-8 pb-2",
    label: "text-[16px] font-nunito text-surface mb-0.5",
    required: "text-white ml-0.5",
    inlineError: "text-[13px] font-nunito text-red-400 mt-1",
    inputBase: "w-full bg-transparent border rounded-xl px-4 py-2.5 text-surface font-nunito text-[15px] outline-none transition-colors placeholder:text-surface/35",
    inputActive: "border-surface/30 focus:border-primary",
    inputError: "border-red-500 focus:border-red-400",
    inputDisabled: "border-surface/15 text-surface/30 cursor-not-allowed opacity-50",
    dropdown: "absolute top-full left-0 right-0 mt-1 z-10 rounded-xl border border-surface/20 bg-[#1a1a2e] overflow-hidden max-h-44 overflow-y-auto shadow-lg",
    dropdownItem: "w-full text-left px-4 py-2.5 text-[15px] font-nunito text-surface transition-colors hover:bg-white/10 cursor-pointer",
    checkboxWrapper: "flex items-center gap-3 cursor-pointer select-none w-fit group",
    checkboxBox: (active: boolean) =>
        `w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
            active ? "bg-white border-white scale-105 shadow-sm" : "bg-transparent border-white/50 group-hover:border-white"
        }`,
    checkboxLabel: (active: boolean) =>
        `text-[16px] text-white font-nunito transition-all duration-200 ${
            active ? "text-white font-semibold" : "text-surface/70 group-hover:text-white"
        }`,
};

const AddSoftSkillPopup = ({ onSubmit, onClose, username, userSkills, isSubmitting = false }: AddSoftSkillPopupProps) => {
    const {
        search,
        suggestions,
        showDropdown,
        setShowDropdown,
        isOther,
        otherName,
        result,
        inlineError,
        hasFieldError,
        loading,
        isDisabled,
        containerRef,
        handleSearchChange,
        handleSelectSuggestion,
        handleToggleOther,
        handleOtherNameChange,
        handleConfirm,
        handleResultClose,
    } = useAddSoftSkill(onSubmit, onClose, username, userSkills);

    const getSearchInputClassName = () => {
        if (isOther) return `${styles.inputBase} ${styles.inputDisabled}`;
        if (hasFieldError) return `${styles.inputBase} ${styles.inputError}`;
        return `${styles.inputBase} ${styles.inputActive}`;
    };

    if (result) {
        return <SoftSkillResultPopup type={result} onClose={handleResultClose} />;
    }

    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm">
                <PopUpCard title="Registrar Habilidad">
                    <div className={styles.formWrapper}>
                        <div className="relative flex flex-col gap-1" ref={containerRef}>
                            <p className={styles.label}>
                                Buscar habilidad:<span className={styles.required}>*</span>
                            </p>
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearchChange}
                                onFocus={() => !isOther && search.trim() && setShowDropdown(true)}
                                placeholder="Ej: Liderazgo, Empatía..."
                                disabled={isOther || isSubmitting}
                                className={getSearchInputClassName()}
                            />
                            {!isOther && hasFieldError && inlineError && (
                                <p className={styles.inlineError}>{inlineError}</p>
                            )}
                            {showDropdown && !isOther && suggestions.length > 0 && (
                                <div className={styles.dropdown}>
                                    {suggestions.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => handleSelectSuggestion(s)}
                                            className={styles.dropdownItem}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleToggleOther}
                            className={styles.checkboxWrapper}
                        >
                            <span className={styles.checkboxBox(isOther)}>
                                {isOther && (
                                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                                        <path
                                            d="M1 4L4 7.5L10 1"
                                            stroke="#000"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </span>
                            <span className={styles.checkboxLabel(isOther)}>Otro</span>
                        </button>

                        {isOther && (
                            <div className="flex flex-col gap-1">
                                <p className={styles.label}>
                                    Nombre de la habilidad:<span className={styles.required}>*</span>
                                </p>
                                <input
                                    type="text"
                                    value={otherName}
                                    onChange={handleOtherNameChange}
                                    placeholder="Escribe el nombre..."
                                    disabled={isSubmitting}
                                    className={`${styles.inputBase} ${hasFieldError ? styles.inputError : styles.inputActive}`}
                                />
                                {hasFieldError && inlineError && (
                                    <p className={styles.inlineError}>{inlineError}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.buttonsWrapper}>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            fullWidth
                            disabled={loading || isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleConfirm}
                            fullWidth
                            disabled={isDisabled || isSubmitting}
                        >
                            {loading ? "Verificando..." : isSubmitting ? "Guardando..." : "Confirmar"}
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default AddSoftSkillPopup;