import { useState } from "react";
import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";
import TextField from "../../../components/TextField";
import YearSelect from "./YearSelect";
import AcademicLevelSelect from "./AcademicLevelSelect";
import type { EducationEntry, AcademicDegree } from "../services/educationService";

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
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50 overflow-y-auto",
    modalContainer: "w-full max-w-xl max-h-[90vh] overflow-y-auto my-4",
    body: "flex flex-col gap-4 px-4 sm:px-8 pb-2",
    row: "grid grid-cols-1 sm:grid-cols-2 gap-4",
    field: "flex flex-col gap-1",
    label: "mb-1 text-xl font-inter text-white",
    required: "text-white ml-0.5",
    errorText: "text-xs text-red-500 mt-1 text-right",
    checkboxContainer: "flex items-center gap-2 mt-1",
    checkbox: "w-4 h-4 accent-[#90DDF0] rounded cursor-pointer",
    checkboxLabel: "text-white/80 font-nunito text-sm cursor-pointer hover:text-white transition-colors",
    serverError: "mx-4 sm:mx-8 mb-2 p-3 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-nunito text-center",
    buttonsWrapper: "flex gap-3 justify-center mt-4 px-4 sm:px-8 pb-6",
    selectWrapper: "w-full",
};

const educationStateOptions = [
    { value: "Cursando", label: "En curso" },
    { value: "Egresado", label: "Egresado" },
];

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
    const [educationState, setEducationState] = useState<string>(initial?.educationState ?? "Cursando");

    const [errors, setErrors] = useState<Record<string, string>>({});

    const selectedDegree = academicDegrees.find((d) => d.id === academicLevelId);

    // Label según el estado
    const yearLabel = educationState === "Cursando" ? "Año de inicio" : "Año de emisión";

    const isFormInvalid = () => {
        if (!degree.trim()) return true;
        if (mode === "add" && !academicLevelId) return true;
        if (!institution.trim()) return true;
        if (!startDate) return true;
        return false;
    };

    const isEditDisabled = () => {
        if (!startDate) return true;
        return !hasChanges();
    };

    const hasChanges = () => {
        if (mode === "add") return true;
        if (!initial) return false;
        return (
            degree.trim() !== initial.degree ||
            academicLevelId !== resolvedInitialId ||
            institution.trim() !== initial.institution ||
            startDate !== initial.startDate ||
            educationState !== initial.educationState
        );
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!degree.trim()) newErrors.degree = "El título es obligatorio";
        if (mode === "add" && !academicLevelId) newErrors.academicLevel = "El grado académico es obligatorio";
        if (!institution.trim()) newErrors.institution = "La institución es obligatoria";
        if (!startDate) newErrors.startDate = "El año es obligatorio";
        if (startDate && !/^\d{4}$/.test(startDate)) newErrors.startDate = "Formato: YYYY (ej: 2020)";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        await onSubmit({
            degree: degree.trim(),
            academicLevelId: academicLevelId,
            institution: institution.trim(),
            startDate,
            educationState,
            visible: initial?.visible ?? true,
            academicLevel: selectedDegree?.academicdegree ?? initial?.academicLevel ?? "",
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
                                if (e.target.value.trim()) {
                                    setErrors((prev) => { const n = { ...prev }; delete n.degree; return n; });
                                } else {
                                    setErrors((prev) => ({ ...prev, degree: "El título es obligatorio" }));
                                }
                            }}
                            placeholder="Ej: Ingeniería Informática"
                            disabled={isSubmitting || mode === "edit"}
                            error={errors.degree}
                            maxLength={100}
                        />

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <p className={styles.label}>Grado académico:<span className={styles.required}>*</span></p>
                                <AcademicLevelSelect
                                    value={academicLevelId}
                                    onChange={(val) => {
                                        setAcademicLevelId(val);
                                        if (val) {
                                            setErrors((prev) => { const n = { ...prev }; delete n.academicLevel; return n; });
                                        } else {
                                            setErrors((prev) => ({ ...prev, academicLevel: "El grado académico es obligatorio" }));
                                        }
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
                                    if (e.target.value.trim()) {
                                        setErrors((prev) => { const n = { ...prev }; delete n.institution; return n; });
                                    } else {
                                        setErrors((prev) => ({ ...prev, institution: "La institución es obligatoria" }));
                                    }
                                }}
                                placeholder="Ej: Universidad Central"
                                disabled={isSubmitting || mode === "edit"}
                                error={errors.institution}
                                maxLength={100}
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <p className={styles.label}>Estado:</p>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={educationState}
                                        onChange={(e) => setEducationState(e.target.value)}
                                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 font-nunito text-[15px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    >
                                        {educationStateOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <p className={styles.label}>{yearLabel}:<span className={styles.required}>*</span></p>
                                <YearSelect
                                    value={startDate}
                                    onChange={(val) => {
                                        setStartDate(val);
                                        if (val) {
                                            setErrors((prev) => { const n = { ...prev }; delete n.startDate; return n; });
                                        } else {
                                            setErrors((prev) => ({ ...prev, startDate: "El año es obligatorio" }));
                                        }
                                    }}
                                    disabled={isSubmitting}
                                    placeholder="Seleccionar..."
                                    hasError={!!errors.startDate}
                                />
                                {errors.startDate && <p className={styles.errorText}>{errors.startDate}</p>}
                            </div>
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
