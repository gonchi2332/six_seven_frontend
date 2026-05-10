import { X, Plus, Trash2 } from "lucide-react";
import type { CreateProjectPayload, UpdateProjectPayload } from "../../services/personalProjectsService";
import { useProjectForm } from "../../hooks/useProjectInfo";
import TextField from "../../../../components/TextField";
import Button from "../../../../components/Button";
import PopUpCard from "../../../../components/PopUpCard";
import ImageUpload from "../../../UploadFile/components/uploadFile";

interface PersonalProjectsModalProps {
    mode: "create" | "edit";
    projectId?: string;
    initialData?: Partial<CreateProjectPayload>;
    onClose: () => void;
    onSubmit: (data: CreateProjectPayload | UpdateProjectPayload, id?: string) => Promise<void>;
    isSubmitting?: boolean;
    error?: string | null;
}

const STYLES = {
    FORM_WRAPPER: "flex flex-col gap-4 px-6", // Reducido gap y padding
    DYNAMIC_GRID: "grid grid-cols-1 md:grid-cols-3 gap-3 auto-rows-min", // Gap más pequeño
    TITLE: "w-1/2",
    INPUT_LABEL: "mb-0.5 text-sm font-medium text-white", // Reducido tamaño y margen
    SELECT: "w-full px-3 py-1.5 border rounded-lg outline-none text-sm bg-white font-nunito disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
    SELECT_PLACEHOLDER: "text-gray-400",
    SELECT_VALUE: "text-black",
    IMAGE_WRAPPER: "flex flex-col gap-1",
    LINKS_SECTION: "flex flex-col gap-2",
    LINK_GROUP: "flex gap-2 items-start",
    LINK_FIELDS: "flex-1 grid grid-cols-2 gap-2",
    REMOVE_BTN: "mt-6 p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors",
    ADD_BTN: "flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2C666E]/50 text-[#90DDF0] hover:bg-[#2C666E]/70 transition-colors font-nunito text-xs font-semibold mt-1",
    FOOTER: "flex gap-3 mt-6 pt-4 px-6 pb-2",
};

const STATUS_OPTIONS = ["En proceso", "Finalizado", "Cancelado"] as const;

const PersonalProjectsModal = ({
    mode,
    projectId,
    initialData,
    onClose,
    onSubmit,
    isSubmitting = false,
    error: externalError
}: PersonalProjectsModalProps) => {
    const isEditing = mode === "edit";

    const { formData, errors, handleChange, handleLinkChange, addLink, removeLink, handleImageChange, validateForm } =
        useProjectForm(initialData, isEditing);

    const handleSubmit = async () => {
        if (!validateForm()) return;

        if (isEditing && projectId) {
            const updatePayload: UpdateProjectPayload = {
                description: formData.description,
                topic: formData.topic,
                role: formData.role,
                status: formData.status,
                links: formData.links,
                image: formData.image,
            };
            await onSubmit(updatePayload, projectId);
        } else {
            const createPayload: CreateProjectPayload = {
                name: formData.name,
                description: formData.description,
                topic: formData.topic,
                role: formData.role,
                status: formData.status,
                links: formData.links,
                image: formData.image,
            };
            await onSubmit(createPayload);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="max-w-3xl w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors z-10"
                >
                    <X size={18} />
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
                                disabled={isEditing}
                                className="[&_input]:py-1.5 [&_label]:text-sm"
                            />
                            {isEditing && (
                                <p className="text-white/40 text-xs mt-0.5">El título no se puede editar</p>
                            )}
                        </div>

                        <TextField
                            label="Descripción"
                            type="text"
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            error={errors.description}
                            className="[&_input]:h-16 [&_label]:text-sm [&_input]:py-1.5"
                        />

                        <div className={STYLES.DYNAMIC_GRID}>
                            <div>
                                <label className={STYLES.INPUT_LABEL}>Estado</label>
                                <select
                                    className={STYLES.SELECT}
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
                                className="[&_input]:py-1.5 [&_label]:text-sm"
                            />

                            <TextField
                                label="Rol"
                                type="text"
                                value={formData.role}
                                onChange={(e) => handleChange("role", e.target.value)}
                                error={errors.role}
                                className="[&_input]:py-1.5 [&_label]:text-sm"
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
                                            className="[&_input]:py-1.5 [&_label]:text-sm"
                                        />
                                        <TextField
                                            label="URL"
                                            type="text"
                                            value={link.url}
                                            onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                                            error={errors[`link${index}_url`] as string}
                                            placeholder="https://..."
                                            className="[&_input]:py-1.5 [&_label]:text-sm"
                                        />
                                    </div>
                                    {formData.links.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeLink(index)}
                                            className={STYLES.REMOVE_BTN}
                                            title="Eliminar enlace"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addLink}
                                className={STYLES.ADD_BTN}
                            >
                                <Plus size={14} />
                                Agregar otro enlace
                            </button>
                        </div>

                        <div className={STYLES.IMAGE_WRAPPER}>
                            <label className={STYLES.INPUT_LABEL}>
                                Imagen de portada {isEditing && "(dejar vacío para mantener la actual)"}
                            </label>
                            <ImageUpload
                                onImageSelect={(file) => handleImageChange(file)}
                            />
                            {errors.image && <p className="text-red-500 text-xs mt-0.5">{errors.image}</p>}
                        </div>

                        {externalError && (
                            <p className="text-red-500 text-sm">{externalError}</p>
                        )}
                    </div>

                    <div className={STYLES.FOOTER}>
                        <div className="flex-1">
                            <Button variant="secondary" onClick={onClose} disabled={isSubmitting} fullWidth >
                                Cancelar
                            </Button>
                        </div>
                        <div className="flex-1">
                            <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting} fullWidth>
                                {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Agregar"}
                            </Button>
                        </div>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default PersonalProjectsModal;
