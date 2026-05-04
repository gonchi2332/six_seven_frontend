import { useState } from "react";
import Button from "../../components/Button/Button";
import PopUpCard from "../../components/PopUpCard/PopUpCard";
import type { EducationEntry } from "../../services/educationService";

interface Props {
    mode: "add" | "edit";
    initial?: EducationEntry;
    onSubmit: (data: Omit<EducationEntry, "id">) => Promise<void>;
    onClose: () => void;
    serverError?: string | null;
    isSubmitting?: boolean;
}

const DEGREE_OPTIONS = ["Primaria", "Secundaria", "Técnico", "Licenciatura", "PostGrado", "Maestría", "Doctorado"];

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
    inlineError: "text-[13px] font-nunito text-red-400 mt-0.5",
    serverError: "mx-6 sm:mx-8 mb-2 p-3 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-nunito text-center",
    selectWrapper: "relative w-full",
    select: "w-full appearance-none bg-[#07393C] border border-surface/30 rounded-xl px-4 py-2.5 pr-10 text-surface font-nunito text-[15px] outline-none transition-colors focus:border-primary cursor-pointer",
    selectArrow: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60",
    buttonsWrapper: "flex gap-4 justify-center mt-2 px-6 sm:px-8 pb-4",
};

const EducationForm = ({ mode, initial, onSubmit, onClose, serverError, isSubmitting = false }: Props) => {
    const [institution, setInstitution] = useState(initial?.institution ?? "");
    const [degree, setDegree] = useState(initial?.degree ?? "");
    const [title, setTitle] = useState(initial?.title ?? "");
    const [startDate, setStartDate] = useState(initial?.startDate ?? "");
    const [endDate, setEndDate] = useState(initial?.endDate ?? "");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const next: Record<string, string> = {};
        if (!institution.trim()) next.institution = "La institución es requerida";
        if (!degree.trim()) next.degree = "El grado es requerido";
        if (!title.trim()) next.title = "El título es requerido";
        if (!startDate.trim()) next.startDate = "La fecha de inicio es requerida";
        if (endDate && startDate && endDate < startDate) next.endDate = "La fecha fin no puede ser anterior al inicio";
        return next;
    };

    const handleSubmit = async () => {
        const next = validate();
        if (Object.keys(next).length > 0) {
            setErrors(next);
            return;
        }
        await onSubmit({
            institution: institution.trim(),
            degree: degree.trim(),
            title: title.trim(),
            startDate: startDate.trim(),
            endDate: endDate.trim() || undefined,
        });
    };

    const inputClass = (field: string) =>
        errors[field] ? `${styles.inputBase} ${styles.inputError}` : `${styles.inputBase} ${styles.inputActive}`;

    const formTitle = mode === "add" ? "Agregar Educación" : "Modificar Educación";

    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm">
                <PopUpCard title={formTitle}>
                    {serverError && <div className={styles.serverError}>{serverError}</div>}
                    <div className={styles.body}>
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <p className={styles.label}>Institución:<span className={styles.required}>*</span></p>
                                <input
                                    type="text"
                                    value={institution}
                                    onChange={(e) => { setInstitution(e.target.value); setErrors((p) => ({ ...p, institution: "" })); }}
                                    placeholder="Colegio"
                                    disabled={isSubmitting}
                                    className={inputClass("institution")}
                                />
                                {errors.institution && <p className={styles.inlineError}>{errors.institution}</p>}
                            </div>
                            <div className={styles.field}>
                                <p className={styles.label}>Grado:<span className={styles.required}>*</span></p>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={degree}
                                        onChange={(e) => { setDegree(e.target.value); setErrors((p) => ({ ...p, degree: "" })); }}
                                        disabled={isSubmitting}
                                        className={`${styles.select} ${errors.degree ? "border-red-500" : ""}`}
                                    >
                                        <option value="">Seleccionar...</option>
                                        {DEGREE_OPTIONS.map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                    <span className={styles.selectArrow}>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </div>
                                {errors.degree && <p className={styles.inlineError}>{errors.degree}</p>}
                            </div>
                        </div>

                        <div className={styles.field}>
                            <p className={styles.label}>Título:<span className={styles.required}>*</span></p>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: "" })); }}
                                placeholder="Licenciatura en X"
                                disabled={isSubmitting}
                                className={inputClass("title")}
                            />
                            {errors.title && <p className={styles.inlineError}>{errors.title}</p>}
                        </div>

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <p className={styles.label}>Fecha Inicio:<span className={styles.required}>*</span></p>
                                <input
                                    type="number"
                                    value={startDate}
                                    onChange={(e) => { setStartDate(e.target.value); setErrors((p) => ({ ...p, startDate: "" })); }}
                                    placeholder="2020"
                                    min="1900"
                                    max="2100"
                                    disabled={isSubmitting}
                                    className={inputClass("startDate")}
                                />
                                {errors.startDate && <p className={styles.inlineError}>{errors.startDate}</p>}
                            </div>
                            <div className={styles.field}>
                                <p className={styles.label}>Fecha Fin:</p>
                                <input
                                    type="number"
                                    value={endDate}
                                    onChange={(e) => { setEndDate(e.target.value); setErrors((p) => ({ ...p, endDate: "" })); }}
                                    placeholder="2024"
                                    min="1900"
                                    max="2100"
                                    disabled={isSubmitting}
                                    className={inputClass("endDate")}
                                />
                                {errors.endDate && <p className={styles.inlineError}>{errors.endDate}</p>}
                            </div>
                        </div>
                    </div>

                    <div className={styles.buttonsWrapper}>
                        <Button type="button" variant="secondary" onClick={onClose} fullWidth disabled={isSubmitting}>
                            Cerrar
                        </Button>
                        <Button type="button" variant="primary" onClick={handleSubmit} fullWidth disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : mode === "add" ? "Agregar" : "Modificar"}
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default EducationForm;