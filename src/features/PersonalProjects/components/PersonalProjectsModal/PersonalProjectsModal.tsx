// components/PersonalProjectsModal.tsx
import type { CreateProjectPayload } from "../../services/personalProjectsService";
import { useProjectForm } from "../../hooks/useProjectInfo";
import { useCreateProject } from "../../hooks/useCreateProject";
import TextField from "../../../../components/TextField";
import Button from "../../../../components/Button";
import PopUpCard from "../../../../components/PopUpCard";

interface PersonalProjectsModalProps {
    mode: "create" | "edit";
    initialData?: Partial<CreateProjectPayload>;
    onClose: () => void;
}

const STYLES = {
    FORM_WRAPPER: "flex flex-col gap-6 px-8",
    DYNAMIC_GRID: "grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min",
    TITLE: "w-1/2",
    INPUT_LABEL: "mb-1 text-xl font-inter text-white",
    SELECT: "w-full px-4 py-2 border rounded-xl outline-none transition-all duration-200 bg-white font-nunito disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
    SELECT_PLACEHOLDER: "text-gray-400",
    SELECT_VALUE: "text-black",
    IMAGE_WRAPPER: "flex flex-col gap-2",
    FOOTER: "flex flex-row justify-end items-center gap-4 mt-10 pt-6 px-8",
};

const STATUS_OPTIONS = ["En proceso", "Finalizado", "Cancelado"] as const;

const PersonalProjectsModal = ({ mode, initialData, onClose }: PersonalProjectsModalProps) => {
    const isEditing = mode === "edit";

    const { formData, errors, handleChange, handleLinkChange, handleImageChange, validateForm } =
        useProjectForm(initialData);

    const { createProject, isLoading, error: serviceError } = useCreateProject();

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            if (isEditing) {
                // await updateProject(formData);
            } else {
                await createProject(formData as CreateProjectPayload);
            }
            onClose();
        } catch {
            // El error ya está capturado en serviceError
        }
    };

    return (
        <div>
            <PopUpCard title={isEditing ? "Editar Proyecto" : "Agregar Proyecto Personal"}>
                <div className={STYLES.FORM_WRAPPER}>
                    <div className={STYLES.TITLE}>
                        <TextField
                            label="Título"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            error={errors.name}
                        />
                    </div>

                    <TextField
                        label="Descripción"
                        type="text"
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        error={errors.description}
                        className="[&_input]:h-24"
                    />

                    <div className={STYLES.DYNAMIC_GRID}>
                        <div>
                            <label className={STYLES.INPUT_LABEL}>Estado</label>
                            <select
                                className={`${STYLES.SELECT} ${formData.status ? STYLES.SELECT_VALUE : STYLES.SELECT_PLACEHOLDER}`}
                                value={formData.status}
                                onChange={(e) => handleChange("status", e.target.value as CreateProjectPayload["status"])}
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        <TextField
                            label="Temática"
                            type="text"
                            value={formData.topic}
                            onChange={(e) => handleChange("topic", e.target.value)}
                            error={errors.topic}
                        />

                        <TextField
                            label="Rol"
                            type="text"
                            value={formData.role}
                            onChange={(e) => handleChange("role", e.target.value)}
                            error={errors.role}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            label="Enlace 1"
                            type="text"
                            value={formData.links[0]}
                            onChange={(e) => handleLinkChange(0, e.target.value)}
                            error={errors.link0}
                        />
                        <TextField
                            label="Enlace 2 (opcional)"
                            type="text"
                            value={formData.links[1] ?? ""}
                            onChange={(e) => handleLinkChange(1, e.target.value)}
                            error={errors.link1}
                        />
                    </div>

                    <div className={STYLES.IMAGE_WRAPPER}>
                        <label className={STYLES.INPUT_LABEL}>
                            Imagen de portada {isEditing && "(dejar vacío para mantener la actual)"}
                        </label>
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
                        />
                        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                    </div>

                    {serviceError && (
                        <p className="text-red-500 text-sm">{serviceError}</p>
                    )}
                </div>

                <div className={STYLES.FOOTER}>
                    <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Guardando..." : isEditing ? "Guardar cambios" : "Agregar"}
                    </Button>
                </div>
            </PopUpCard>
        </div>
    );
};

export default PersonalProjectsModal;
