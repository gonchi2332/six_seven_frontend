import { useState } from "react";
import Button from "../../components/Button/Button";
import PopUpCard from "../../components/PopUpCard/PopUpCard";
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

const MAX_DEGREE = 50;

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50",
    body: "flex flex-col gap-4 px-6 sm:px-8 pb-2",
    row: "flex flex-col sm:flex-row gap-4",
    field: "flex flex-col gap-1 flex-1",
    label: "text-[15px] font-nunito text-surface",
    required: "text-white ml-0.5",
    inputBase: "w-full bg-transparent border rounded-xl px-4 py-2.5 text-surface font-nunito text-[15px] outline-none transition-colors placeholder:text-surface/35",
    inputActive: "border-surface/30 focus:border-primary",
    inputError: "border-red-500 focus:border-red-400",
    inputDisabled: "border-surface/10 opacity-40 cursor-not-allowed",
    inlineError: "text-[13px] font-nunito text-red-400 mt-0.5",
    serverError: "mx-6 sm:mx-8 mb-2 p-3 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-nunito text-center",
    selectWrapper: "relative w-full",
    select: "w-full appearance-none bg-[#07393C] border border-surface/30 rounded-xl px-4 py-2.5 pr-10 text-surface font-nunito text-[15px] outline-none transition-colors focus:border-primary cursor-pointer",
    selectArrow: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60",
    presenteBtn: (active: boolean) =>
        `px-4 py-2 rounded-xl border font-nunito text-[14px] font-semibold transition-all mt-1 ${
            active
                ? "bg-[#90DDF0] border-[#90DDF0] text-[#07393C]"
                : "border-white/40 text-white/60 bg-white/5 hover:border-[#90DDF0] hover:text-[#90DDF0]"
        }`,
    buttonsWrapper: "flex gap-4 justify-center mt-2 px-6 sm:px-8 pb-4",
};

const isValidYear = (val: string) =>
    /^\d{4}$/.test(val) && Number(val) >= 1900 && Number(val) <= 2100;

const EducationForm = ({
    mode, initial, academicDegrees, onSubmit, onClose, serverError, isSubmitting = false,
}: Props) => {
    const [degree, setDegree] = useState(initial?.degree ?? "");
    const [academicLevelId, setAcademicLevelId] = useState<number>(initial?.academicLevelId ?? 0);
    const [institution, setInstitution] = useState(initial?.institution ?? "");
    const [startDate, setStartDate] = useState(initial?.startDate ?? "");
    const [endDate, setEndDate] = useState(initial?.endDate ?? "");
    const [isPresent, setIsPresent] = useState(mode === "edit" ? !initial?.endDate : false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const selectedDegree = academicDegrees.find((d) => d.id === academicLevelId);

    const hasChanges = mode === "edit"
        ? academicLevelId !== (initial?.academicLevelId ?? 0) ||
          institution !== (initial?.institution ?? "") ||
          startDate !== (initial?.startDate ?? "") ||
          endDate !== (initial?.endDate ?? "") ||
          isPresent !== !initial?.endDate
        : true;

    const handleYearInput = (val: string) => val.replace(/\D/g, "").slice(0, 4);

    const validate = () => {
        const next: Record<string, string> = {};
        if (!degree.trim()) next.degree = "El nombre es requerido";
        if (mode === "add" && !academicLevelId) next.academicLevel = "El grado académico es requerido";
        if (!institution.trim()) next.institution = "La institución es requerida";
        if (!startDate.trim()) {
            next.startDate = "La fecha de inicio es requerida";
        } else if (!isValidYear(startDate)) {
            next.startDate = "Ingresa un año válido de 4 dígitos";
        }
        if (!isPresent) {
            if (!endDate.trim()) {
                next.endDate = "La fecha de finalización es requerida";
            } else if (!isValidYear(endDate)) {
                next.endDate = "Ingresa un año válido de 4 dígitos";
            } else if (Number(endDate) < Number(startDate)) {
                next.endDate = "La fecha de inicio no puede ser luego de fecha de finalización";
            }
        }
        return next;
    };

    const handleSubmit = async () => {
        const next = validate();
        if (Object.keys(next).length > 0) {
            setErrors(next);
            return;
        }
        await onSubmit({
            degree: degree.trim(),
            academicLevel: selectedDegree?.academicdegree ?? initial?.academicLevel ?? "",
            academicLevelId: academicLevelId || initial?.academicLevelId || 0,
            institution: institution.trim(),
            startDate: startDate.trim(),
            endDate: isPresent ? undefined : endDate.trim() || undefined,
        });
    };

    const inputClass = (field: string) =>
        errors[field] ? `${styles.inputBase} ${styles.inputError}` : `${styles.inputBase} ${styles.inputActive}`;

    const formTitle = mode === "add" ? "Agregar Experiencia Académica" : "Modificar Experiencia Académica";

    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-sm sm:max-w-xl">
                <PopUpCard title={formTitle}>
                    {serverError && <div className={styles.serverError}>{serverError}</div>}

                    <div className={styles.body}>
                        <div className={styles.field}>
                            <p className={styles.label}>Título:<span className={styles.required}>*</span></p>
                            <input
                                type="text"
                                value={degree}
                                onChange={(e) => { setDegree(e.target.value); setErrors((p) => ({ ...p, degree: "" })); }}
                                placeholder="Ej: Ingeniería en Sistemas"
                                maxLength={MAX_DEGREE}
                                disabled={isSubmitting || mode === "edit"}
                                className={mode === "edit" ? `${styles.inputBase} ${styles.inputDisabled}` : inputClass("degree")}
                            />
                            {errors.degree && <p className={styles.inlineError}>{errors.degree}</p>}
                        </div>

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <p className={styles.label}>Grado Académico:<span className={styles.required}>*</span></p>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={academicLevelId}
                                        onChange={(e) => {
                                            setAcademicLevelId(Number(e.target.value));
                                            setErrors((p) => ({ ...p, academicLevel: "" }));
                                        }}
                                        disabled={isSubmitting || mode === "edit"}
                                        className={`${styles.select} ${errors.academicLevel ? "border-red-500" : ""} ${mode === "edit" ? "opacity-40 cursor-not-allowed" : ""}`}
                                    >
                                        <option value={0}>Seleccionar...</option>
                                        {academicDegrees.map((d) => (
                                            <option key={d.id} value={d.id}>{d.academicdegree}</option>
                                        ))}
                                    </select>
                                    <span className={styles.selectArrow}>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </div>
                                {errors.academicLevel && <p className={styles.inlineError}>{errors.academicLevel}</p>}
                            </div>

                            <div className={styles.field}>
                                <p className={styles.label}>Institución:<span className={styles.required}>*</span></p>
                                <input
                                    type="text"
                                    value={institution}
                                    onChange={(e) => { setInstitution(e.target.value); setErrors((p) => ({ ...p, institution: "" })); }}
                                    placeholder="Ej: Universidad Mayor de San Simón"
                                    maxLength={100}
                                    disabled={isSubmitting || mode === "edit"}
                                    className={mode === "edit" ? `${styles.inputBase} ${styles.inputDisabled}` : inputClass("institution")}
                                />
                                {errors.institution && <p className={styles.inlineError}>{errors.institution}</p>}
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <p className={styles.label}>Fecha de Inicio:<span className={styles.required}>*</span></p>
                                <input
                                    type="text"
                                    value={startDate}
                                    onChange={(e) => { setStartDate(handleYearInput(e.target.value)); setErrors((p) => ({ ...p, startDate: "" })); }}
                                    placeholder="2020"
                                    disabled={isSubmitting}
                                    className={inputClass("startDate")}
                                />
                                {errors.startDate && <p className={styles.inlineError}>{errors.startDate}</p>}
                            </div>

                            <div className={styles.field}>
                                <p className={styles.label}>Fecha Fin:</p>
                                <input
                                    type="text"
                                    value={isPresent ? "" : endDate}
                                    onChange={(e) => { setEndDate(handleYearInput(e.target.value)); setErrors((p) => ({ ...p, endDate: "" })); }}
                                    placeholder="2024"
                                    disabled={isSubmitting || isPresent}
                                    className={isPresent ? `${styles.inputBase} ${styles.inputDisabled}` : inputClass("endDate")}
                                />
                                {errors.endDate && <p className={styles.inlineError}>{errors.endDate}</p>}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsPresent((p) => !p);
                                        setEndDate("");
                                        setErrors((p) => ({ ...p, endDate: "" }));
                                    }}
                                    disabled={isSubmitting}
                                    className={styles.presenteBtn(isPresent)}
                                >
                                    Presente
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.buttonsWrapper}>
                        <Button type="button" variant="secondary" onClick={onClose} fullWidth disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleSubmit}
                            fullWidth
                            disabled={isSubmitting || (mode === "edit" && !hasChanges)}
                        >
                            {isSubmitting ? "Guardando..." : mode === "add" ? "Agregar" : "Aceptar"}
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default EducationForm;