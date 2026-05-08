import { X, Plus, Trash2 } from "lucide-react";
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
    LINKS_SECTION: "flex flex-col gap-3",
    LINK_GROUP: "flex gap-3 items-start",
    LINK_FIELDS: "flex-1 grid grid-cols-2 gap-3",
    REMOVE_BTN: "mt-7 p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors",
    ADD_BTN: "flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#2C666E]/50 text-[#90DDF0] hover:bg-[#2C666E]/70 transition-colors font-nunito text-sm font-semibold mt-2",
    FOOTER: "flex gap-3 mt-10 pt-6 px-8 pb-2",
};

const STATUS_OPTIONS = ["En proceso", "Finalizado", "Cancelado"] as const;

const PersonalProjectsModal = ({ mode, initialData, onClose }: PersonalProjectsModalProps) => {
    const isEditing = mode === "edit";

    const { formData, errors, handleChange, handleLinkChange, addLink, removeLink, handleImageChange, validateForm } =
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
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="max-w-3xl w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-10"
                >
                    <X size={22} />
                </button>
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

                        <div className={STYLES.LINKS_SECTION}>
                            <label className={STYLES.INPUT_LABEL}>Enlaces del proyecto</label>
                            {formData.links.map((link, index) => (
                                <div key={index} className={STYLES.LINK_GROUP}>
                                    <div className={STYLES.LINK_FIELDS}>
                                        <TextField
                                            label="Label"
                                            type="text"
                                            value={link.label}
                                            onChange={(e) => handleLinkChange(index, "label", e.target.value)}
                                            error={errors[`link${index}_label`] as string}
                                            placeholder="Ej: GitHub, Deploy, Demo"
                                        />
                                        <TextField
                                            label="URL"
                                            type="text"
                                            value={link.url}
                                            onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                                            error={errors[`link${index}_url`] as string}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    {formData.links.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeLink(index)}
                                            className={STYLES.REMOVE_BTN}
                                            title="Eliminar enlace"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addLink}
                                className={STYLES.ADD_BTN}
                            >
                                <Plus size={16} />
                                Agregar otro enlace
                            </button>
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
                        <div className="flex-1">
                            <Button variant="secondary" onClick={onClose} disabled={isLoading} fullWidth>
                                Cancelar
                            </Button>
                        </div>
                        <div className="flex-1">
                            <Button variant="primary" onClick={handleSubmit} disabled={isLoading} fullWidth>
                                {isLoading ? "Guardando..." : isEditing ? "Guardar cambios" : "Agregar"}
                            </Button>
                        </div>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default PersonalProjectsModal;
