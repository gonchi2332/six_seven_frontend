import { useState } from "react";
import Button from "../../components/Button/Button";
import PopUpCard from "../../components/PopUpCard/PopUpCard";
import TextField from "../../components/TextField";
import YearSelect from "./YearSelect";
import AcademicLevelSelect from "./AcademicLevelSelect";
import type { EducationEntry, AcademicDegree } from "../../services/educationService";

interface Props {
    mode: "add" | "edit";
    initial?: EducationEntry;
    academicDegrees: AcademicDegree[];
    onSubmit: (data: Omit<EducationEntry, "id">) => Promise<void>;
    onClose: () => void;
    onBack?: () => void;
    serverError?: string | null;
    isSubmitting?: boolean;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50",
    modalContainer: "w-full max-w-xl max-h-[90vh] overflow-y-auto",
    body: "flex flex-col gap-4 px-4 sm:px-8 pb-2",
    row: "grid grid-cols-1 sm:grid-cols-2 gap-4",
    field: "flex flex-col gap-1",
    label: "mb-1 text-xl font-inter text-white",
    required: "text-white ml-0.5",
    errorText: "text-xs text-red-600 mt-1 text-right",
    checkboxContainer: "flex items-center gap-2 mt-1",
    checkbox: "w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer",
    checkboxLabel: "text-surface font-nunito text-sm cursor-pointer",
    serverError: "mx-4 sm:mx-8 mb-2 p-3 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-nunito text-center",
    buttonsWrapper: "flex gap-3 justify-center mt-4 px-4 sm:px-8 pb-6",
};

const EducationForm = ({
    mode, initial, academicDegrees, onSubmit, onClose, onBack, serverError, isSubmitting = false,
}: Props) => {
    const resolvedInitialId = (() => {
        if (!initial) return 0;
        if (initial.academicLevelId && initial.academicLevelId !== 0) return initial.academicLevelId;
        const matched = academicDegrees.find(
            (d) => d.academicdegree.toLowerCase() === (initial.academicLevel ?? "").toLowerCase()
        );
        return matched?.id ?? 0;
    })();

    const [degree, setDegree] = useState(initial?.degree ?? "");
    const [academicLevelId, setAcademicLevelId] = useState<number>(resolvedInitialId);
    const [institution, setInstitution] = useState(initial?.institution ?? "");
    const [startDate, setStartDate] = useState(initial?.startDate ?? "");
    const [endDate, setEndDate] = useState(initial?.endDate ?? "");
    const [isPresent, setIsPresent] = useState(mode === "edit" ? !initial?.endDate : false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const selectedDegree = academicDegrees.find((d) => d.id === academicLevelId);

    const isFormInvalid = () => {
        if (!degree.trim()) return true;
        if (mode === "add" && !academicLevelId) return true;
        if (!institution.trim()) return true;
        if (!startDate) return true;
        if (!isPresent && !endDate) return true;
        return false;
    };

    const isEditDisabled = () => {
        if (!startDate) return true;
        if (!isPresent && !endDate) return true;
        return !hasChanges();
    };

    const hasChanges = () => {
        if (mode === "add") return true;
        if (!initial) return false;
        const currentIsPresent = !initial.endDate;
        const endDateChanged = isPresent !== currentIsPresent || (!isPresent && endDate !== (initial.endDate ?? ""));
        return (
            degree.trim() !== initial.degree ||
            academicLevelId !== resolvedInitialId ||
            institution.trim() !== initial.institution ||
            startDate !== initial.startDate ||
            endDateChanged
        );
    };

    const handleSubmit = async () => {
        const allTouched: Record<string, boolean> = {
            degree: true,
            academicLevel: true,
            institution: true,
            startDate: true,
            endDate: true,
        };
        setTouched(allTouched);
        const next: Record<string, string> = {};
        if (!degree.trim()) next.degree = "El título es obligatorio";
        if (mode === "add" && !academicLevelId) next.academicLevel = "El grado académico es obligatorio";
        if (!institution.trim()) next.institution = "La institución es obligatoria";
        if (!startDate) next.startDate = "El año de inicio es obligatorio";
        if (!isPresent && !endDate) next.endDate = "El año de finalización es obligatorio";
        setErrors(next);
        if (Object.keys(next).length > 0) return;
        await onSubmit({
            degree: degree.trim(),
            academicLevel: selectedDegree?.academicdegree ?? initial?.academicLevel ?? "",
            academicLevelId: academicLevelId || resolvedInitialId || 0,
            institution: institution.trim(),
            startDate,
            endDate: isPresent ? undefined : endDate || undefined,
        });
    };

    const handleCancelOrBack = () => {
        if (onBack) onBack();
        else onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                <PopUpCard title={mode === "add" ? "Registrar Formación Académica" : `Modificar: ${initial?.degree ?? ""}`}>
                    {serverError && <div className={styles.serverError}>{serverError}</div>}
                    <div className={styles.body}>
                        <TextField
                            label="Título/Carrera:*"
                            value={degree}
                            onChange={(e) => {
                                setDegree(e.target.value);
                                setTouched((prev) => ({ ...prev, degree: true }));
                                setErrors((prev) => {
                                    const n = { ...prev };
                                    if (e.target.value.trim()) delete n.degree;
                                    else n.degree = "El título es obligatorio";
                                    return n;
                                });
                            }}
                            placeholder="Ej: Ingeniería Informática"
                            disabled={isSubmitting || mode === "edit"}
                            error={errors.degree}
                            maxLength={50}
                        />
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <p className={styles.label}>Grado académico:<span className={styles.required}>*</span></p>
                                <AcademicLevelSelect
                                    value={academicLevelId}
                                    onChange={(val) => {
                                        setAcademicLevelId(val);
                                        setTouched((prev) => ({ ...prev, academicLevel: true }));
                                        setErrors((prev) => {
                                            const n = { ...prev };
                                            if (val) delete n.academicLevel;
                                            else n.academicLevel = "El grado académico es obligatorio";
                                            return n;
                                        });
                                    }}
                                    disabled={isSubmitting || mode === "edit"}
                                    hasError={!!errors.academicLevel}
                                    options={academicDegrees}
                                />
                                {errors.academicLevel && <p className={styles.errorText}>{errors.academicLevel}</p>}
                            </div>
                            <TextField
                                label="Institución:*"
                                value={institution}
                                onChange={(e) => {
                                    setInstitution(e.target.value);
                                    setTouched((prev) => ({ ...prev, institution: true }));
                                    setErrors((prev) => {
                                        const n = { ...prev };
                                        if (e.target.value.trim()) delete n.institution;
                                        else n.institution = "La institución es obligatoria";
                                        return n;
                                    });
                                }}
                                placeholder="Ej: Universidad Central"
                                disabled={isSubmitting || mode === "edit"}
                                error={errors.institution}
                                maxLength={100}
                            />
                        </div>
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <p className={styles.label}>Año de inicio:<span className={styles.required}>*</span></p>
                                <YearSelect
                                    value={startDate}
                                    onChange={(val) => {
                                        setStartDate(val);
                                        setTouched((prev) => ({ ...prev, startDate: true }));
                                        setErrors((prev) => {
                                            const n = { ...prev };
                                            if (val) delete n.startDate;
                                            else n.startDate = "El año de inicio es obligatorio";
                                            return n;
                                        });
                                    }}
                                    disabled={isSubmitting}
                                    placeholder="Seleccionar..."
                                    hasError={!!errors.startDate}
                                />
                                {errors.startDate && <p className={styles.errorText}>{errors.startDate}</p>}
                            </div>
                            <div className={styles.field}>
                                <p className={styles.label}>Año de finalización:*</p>
                                <YearSelect
                                    value={isPresent ? "" : endDate}
                                    onChange={(val) => {
                                        setEndDate(val);
                                        setTouched((prev) => ({ ...prev, endDate: true }));
                                        setErrors((prev) => {
                                            const n = { ...prev };
                                            if (val) delete n.endDate;
                                            else if (!isPresent) n.endDate = "El año de finalización es obligatorio";
                                            return n;
                                        });
                                    }}
                                    disabled={isSubmitting || isPresent}
                                    placeholder={isPresent ? "Presente" : "Seleccionar..."}
                                    hasError={!!errors.endDate}
                                />
                                {errors.endDate && <p className={styles.errorText}>{errors.endDate}</p>}
                            </div>
                        </div>
                        <div className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                id="isPresentEducation"
                                checked={isPresent}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setIsPresent(checked);
                                    if (checked) {
                                        setEndDate("");
                                        setErrors((prev) => { const n = { ...prev }; delete n.endDate; return n; });
                                    } else {
                                        setTouched((prev) => ({ ...prev, endDate: false }));
                                    }
                                }}
                                className={styles.checkbox}
                            />
                            <label htmlFor="isPresentEducation" className={styles.checkboxLabel}>
                                Presente
                            </label>
                        </div>
                    </div>
                    <div className={styles.buttonsWrapper}>
                        <Button variant="secondary" onClick={handleCancelOrBack} fullWidth disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            fullWidth
                            disabled={isSubmitting || (mode === "add" ? isFormInvalid() : isEditDisabled())}
                        >
                            {isSubmitting ? "Guardando..." : mode === "add" ? "Registrar" : "Modificar"}
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default EducationForm;