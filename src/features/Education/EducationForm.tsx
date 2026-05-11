import { useState } from "react";
import Button from "../../components/Button/Button";
import PopUpCard from "../../components/PopUpCard/PopUpCard";
import TextField from "../../components/TextField";
import YearSelect from "./YearSelect";
import type { EducationEntry, AcademicDegree } from "../../services/educationService";

interface Props {
    mode: "add" | "edit";
    initial?: EducationEntry;
    academicDegrees: AcademicDegree[];
    onSubmit: (data: Omit<EducationEntry, "id">) => Promise<void>;
    onClose: () => void;
    serverError?: string | null;
    isSubmitting?: boolean;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50",
    body: "flex flex-col gap-4 px-4 sm:px-8 pb-2",
    row: "grid grid-cols-1 sm:grid-cols-2 gap-4",
    field: "flex flex-col gap-1",
    label: "text-[15px] font-nunito text-surface mb-1",
    required: "text-white ml-0.5",
    selectWrapper: "relative w-full",
    select: "w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 text-black font-nunito text-[15px] outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-100",
    selectArrow: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400",
    selectError: "border-red-500 bg-red-50",
    errorText: "text-xs text-red-600 mt-1 text-right",
    checkboxContainer: "flex items-center gap-2 mt-1",
    checkbox: "w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer",
    checkboxLabel: "text-surface font-nunito text-sm cursor-pointer",
    serverError: "mx-4 sm:mx-8 mb-2 p-3 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-nunito text-center",
    buttonsWrapper: "flex gap-3 justify-center mt-4 px-4 sm:px-8 pb-6",
};

const EducationForm = ({
    mode, initial, academicDegrees, onSubmit, onClose, serverError, isSubmitting = false,
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
    const [errors, setErrors] = useState<Record<string, string>>({});

    const selectedDegree = academicDegrees.find((d) => d.id === academicLevelId);

    const hasChanges = () => {
        if (mode === "add") return degree.trim() !== "" || institution.trim() !== "" || startDate !== "";
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

    const validate = () => {
        const next: Record<string, string> = {};
        if (!degree.trim()) next.degree = "El nombre es requerido";
        if (mode === "add" && !academicLevelId) next.academicLevel = "El grado académico es requerido";
        if (!institution.trim()) next.institution = "La institución es requerida";
        if (!startDate) next.startDate = "La Fecha de Inicio es requerida";
        if (!isPresent && !endDate) next.endDate = "La Fecha de Fin es requerida";
        return next;
    };

    const handleSubmit = async () => {
        const next = validate();
        if (Object.keys(next).length > 0) {
            setErrors(next);
            setTimeout(() => setErrors({}), 4000);
            return;
        }
        await onSubmit({
            degree: degree.trim(),
            academicLevel: selectedDegree?.academicdegree ?? initial?.academicLevel ?? "",
            academicLevelId: academicLevelId || resolvedInitialId || 0,
            institution: institution.trim(),
            startDate,
            endDate: isPresent ? undefined : endDate || undefined,
        });
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className="w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
                <PopUpCard title={mode === "add" ? "Registrar Formación Académica" : "Modificar Formación Académica"}>
                    {serverError && <div className={styles.serverError}>{serverError}</div>}
                    <div className={styles.body}>
                        <TextField
                            label="Título/Carrera:*"
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                            placeholder="Ej: Ingeniería Informática"
                            disabled={isSubmitting || mode === "edit"}
                            error={errors.degree}
                        />
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <p className={styles.label}>Grado Académico:<span className={styles.required}>*</span></p>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={academicLevelId}
                                        onChange={(e) => setAcademicLevelId(Number(e.target.value))}
                                        disabled={isSubmitting || mode === "edit"}
                                        className={`${styles.select} ${errors.academicLevel ? styles.selectError : ""}`}
                                    >
                                        <option value={0}>Seleccionar...</option>
                                        {academicDegrees.map((d) => (
                                            <option key={d.id} value={d.id}>{d.academicdegree}</option>
                                        ))}
                                    </select>
                                    <span className={styles.selectArrow}>▼</span>
                                </div>
                                {errors.academicLevel && <p className={styles.errorText}>{errors.academicLevel}</p>}
                            </div>
                            <TextField
                                label="Institución:*"
                                value={institution}
                                onChange={(e) => setInstitution(e.target.value)}
                                placeholder="Ej: Universidad Central"
                                disabled={isSubmitting || mode === "edit"}
                                error={errors.institution}
                            />
                        </div>
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <p className={styles.label}>Año de Inicio:<span className={styles.required}>*</span></p>
                                <YearSelect
                                    value={startDate}
                                    onChange={(val) => {
                                        setStartDate(val);
                                        setErrors((prev) => { const n = { ...prev }; delete n.startDate; return n; });
                                    }}
                                    disabled={isSubmitting}
                                    placeholder="Seleccionar..."
                                    hasError={!!errors.startDate}
                                />
                                {errors.startDate && <p className={styles.errorText}>{errors.startDate}</p>}
                            </div>
                            <div className={styles.field}>
                                <p className={styles.label}>Año de Finalización:</p>
                                <YearSelect
                                    value={isPresent ? "" : endDate}
                                    onChange={(val) => {
                                        setEndDate(val);
                                        setErrors((prev) => { const n = { ...prev }; delete n.endDate; return n; });
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
                        <Button variant="secondary" onClick={onClose} fullWidth disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            fullWidth
                            disabled={isSubmitting || (mode === "edit" && !hasChanges())}
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