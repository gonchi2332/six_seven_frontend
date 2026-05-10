import { useState } from "react";
import Button from "../../components/Button/Button";
import PopUpCard from "../../components/PopUpCard/PopUpCard";
import TextField from "../../components/TextField";
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
    body: "flex flex-col gap-4 px-6 sm:px-8 pb-2",
    row: "grid grid-cols-1 sm:grid-cols-2 gap-4",
    field: "flex flex-col gap-1",
    label: "text-[15px] font-nunito text-surface mb-1",
    required: "text-white ml-0.5",
    select: "w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 text-black font-nunito text-[15px] outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-100",
    selectWrapper: "relative w-full",
    selectArrow: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400",
    checkboxContainer: "flex items-center gap-2 mt-1",
    checkbox: "w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer",
    checkboxLabel: "text-surface font-nunito text-sm cursor-pointer",
    serverError: "mx-6 sm:mx-8 mb-2 p-3 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-nunito text-center",
    buttonsWrapper: "flex gap-4 justify-center mt-4 px-6 sm:px-8 pb-6",
};

const isValidYear = (val: string) => /^\d{4}$/.test(val) && Number(val) >= 1900 && Number(val) <= 2100;

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

    const handleYearInput = (val: string) => val.replace(/\D/g, "").slice(0, 4);

    const validate = () => {
        const next: Record<string, string> = {};
        if (!degree.trim()) next.degree = "El nombre es requerido";
        if (mode === "add" && !academicLevelId) next.academicLevel = "El grado es requerido";
        if (!institution.trim()) next.institution = "La institución es requerida";
        if (!startDate.trim()) {
            next.startDate = "Requerido";
        } else if (!isValidYear(startDate)) {
            next.startDate = "Año inválido";
        }
        if (!isPresent) {
            if (!endDate.trim()) {
                next.endDate = "Requerido";
            } else if (!isValidYear(endDate)) {
                next.endDate = "Año inválido";
            } else if (Number(endDate) < Number(startDate)) {
                next.endDate = "Debe ser mayor";
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

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className="w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
                <PopUpCard title={mode === "add" ? "Agregar Educación" : "Editar Educación"}>
                    {serverError && <div className={styles.serverError}>{serverError}</div>}

                    <div className={styles.body}>
                        <TextField
                            label="Título/Carrera:*"
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                            placeholder="Ej: Ingeniería de Sistemas"
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
                                        className={`${styles.select} ${errors.academicLevel ? "border-red-500 bg-red-50" : ""}`}
                                    >
                                        <option value={0}>Seleccionar...</option>
                                        {academicDegrees.map((d) => (
                                            <option key={d.id} value={d.id}>{d.academicdegree}</option>
                                        ))}
                                    </select>
                                    <span className={styles.selectArrow}>▼</span>
                                </div>
                                {errors.academicLevel && <p className="text-xs text-red-600 mt-1">{errors.academicLevel}</p>}
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
                            <TextField
                                label="Año Inicio:*"
                                value={startDate}
                                onChange={(e) => setStartDate(handleYearInput(e.target.value))}
                                placeholder="AAAA"
                                disabled={isSubmitting}
                                error={errors.startDate}
                            />

                            <TextField
                                label="Año Fin:"
                                value={isPresent ? "" : endDate}
                                onChange={(e) => setEndDate(handleYearInput(e.target.value))}
                                placeholder={isPresent ? "Actualidad" : "AAAA"}
                                disabled={isSubmitting || isPresent}
                                error={errors.endDate}
                            />
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
                                        // Limpiamos el error de endDate si el usuario marca "Actualidad"
                                        setErrors(prev => {
                                            const newErrors = { ...prev };
                                            delete newErrors.endDate;
                                            return newErrors;
                                        });
                                    }
                                }}
                                className={styles.checkbox}
                            />
                            <label htmlFor="isPresentEducation" className={styles.checkboxLabel}>
                                Sigo estudiando aquí
                            </label>
                        </div>
                    </div>

                    <div className={styles.buttonsWrapper}>
                        <Button variant="secondary" onClick={onClose} fullWidth disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} fullWidth disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : mode === "add" ? "Agregar" : "Aceptar"}
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default EducationForm;