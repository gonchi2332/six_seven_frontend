import { useState } from "react";
import type { CreateProjectPayload } from "../services/personalProjectsService";

type FormErrors = Partial<Record<keyof CreateProjectPayload | string, string>>;

const INITIAL_FORM: CreateProjectPayload = {
    name: "",
    description: "",
    topic: "",
    role: "",
    status: "En proceso",
    links: [{ label: "", url: "" }],
    image: null,
};

export const useProjectForm = (initialData?: Partial<CreateProjectPayload>, isEditing: boolean = false) => {
    const [formData, setFormData] = useState<CreateProjectPayload>({
        ...INITIAL_FORM,
        ...initialData,
        links: initialData?.links || [{ label: "", url: "" }],
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = <K extends keyof CreateProjectPayload>(
        field: K,
        value: CreateProjectPayload[K]
    ) => {
        // Validaciones en tiempo real
        let newValue = value;

        if (field === 'name' && typeof value === 'string') {
            // Bloquear más de 50 caracteres
            if (value.length > 50) return;
            newValue = value;
            // Validación en tiempo real
            if (value.length > 0 && value.length > 50) {
                setErrors((prev) => ({ ...prev, [field]: "El nombre del proyecto supera el límite de 50 caracteres" }));
            } else if (value.length === 0) {
                setErrors((prev) => ({ ...prev, [field]: "El nombre del proyecto es requerido" }));
            } else {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        }

        if (field === 'description' && typeof value === 'string') {
            if (value.length > 200) return;
            newValue = value;
            if (value.length > 0 && value.length > 200) {
                setErrors((prev) => ({ ...prev, [field]: "La descripción supera el límite de 200 caracteres" }));
            } else if (value.length === 0) {
                setErrors((prev) => ({ ...prev, [field]: "La descripción es requerida" }));
            } else {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        }

        if (field === 'role' && typeof value === 'string') {
            if (value.length > 50) return;
            newValue = value;
            if (value.length > 0 && value.length > 50) {
                setErrors((prev) => ({ ...prev, [field]: "El rol supera el límite de 50 caracteres" }));
            } else if (value.length === 0) {
                setErrors((prev) => ({ ...prev, [field]: "El rol es requerido" }));
            } else {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        }

        if (field === 'topic' && typeof value === 'string') {
            // topic no tiene límite específico pero requerido
            newValue = value;
            if (value.length === 0) {
                setErrors((prev) => ({ ...prev, [field]: "El área es requerida" }));
            } else {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        }

        setFormData((prev) => ({ ...prev, [field]: newValue }));
    };

    const handleLinkChange = (index: number, field: "label" | "url", value: string) => {
        // Los labels no tienen límite específico en tu validación
        // Si quieres agregar límite a labels, descomenta:
        // if (field === 'label' && value.length > 50) return;

        setFormData((prev) => {
            const updated = [...prev.links];
            if (!updated[index]) {
                updated[index] = { label: "", url: "" };
            }
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, links: updated };
        });

        // Limpiar error específico
        setErrors((prev) => ({ ...prev, [`link${index}_${field}`]: undefined }));
    };

    const addLink = () => {
        setFormData((prev) => ({
            ...prev,
            links: [...prev.links, { label: "", url: "" }]
        }));
    };

    const removeLink = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            links: prev.links.filter((_, i) => i !== index)
        }));
        const newErrors = { ...errors };
        delete newErrors[`link${index}_label`];
        delete newErrors[`link${index}_url`];
        setErrors(newErrors);
    };

    const handleImageChange = (file: File | null) => {
        setFormData((prev) => ({ ...prev, image: file }));
        setErrors((prev) => ({ ...prev, image: undefined }));
    };

    const validateForm = (): boolean => {
        const e: FormErrors = {};

        if (!formData.name.trim())
            e.name = "El nombre del proyecto es requerido";
        else if (formData.name.length > 50)
            e.name = "El nombre del proyecto supera el límite de 50 caracteres";

        if (!formData.description.trim())
            e.description = "La descripción es requerida";
        else if (formData.description.length > 200)
            e.description = "La descripción supera el límite de 200 caracteres";

        if (!formData.topic.trim())
            e.topic = "El área es requerida";

        if (!formData.role.trim())
            e.role = "El rol es requerido";
        else if (formData.role.length > 50)
            e.role = "El rol supera el límite de 50 caracteres";

        if (!formData.status)
            e.status = "Estado del proyecto inválido";

        const validLinks = formData.links.filter(link => link.label.trim() !== "" && link.url.trim() !== "");

        if (validLinks.length === 0) {
            e.link0_label = "Al menos un enlace es requerido";
        } else {
            const urlPattern = /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/;
            formData.links.forEach((link, idx) => {
                if (link.label.trim() && !link.url.trim()) {
                    e[`link${idx}_url`] = "La URL es requerida";
                } else if (link.url.trim() && !link.label.trim()) {
                    e[`link${idx}_label`] = "El label es requerido";
                } else if (link.label.trim() && link.url.trim() && !urlPattern.test(link.url)) {
                    e[`link${idx}_url`] = "Debe ser una URL válida (ej: https://github.com/usuario)";
                }
            });
        }

        if (!isEditing && !formData.image) {
            e.image = "La imagen del proyecto es requerida";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const setInitialData = (data: Partial<CreateProjectPayload>) => {
        setFormData({
            ...INITIAL_FORM,
            ...data,
            links: data.links?.map(link => ({ label: link.label || "", url: link.url || "" })) || [{ label: "", url: "" }]
        });
        setErrors({});
    };

    const reset = () => {
        setFormData({
            ...INITIAL_FORM,
            ...initialData,
            links: initialData?.links?.map(link => ({ label: link.label || "", url: link.url || "" })) || [{ label: "", url: "" }]
        });
        setErrors({});
    };

    return {
        formData,
        errors,
        handleChange,
        handleLinkChange,
        addLink,
        removeLink,
        handleImageChange,
        validateForm,
        setInitialData,
        reset,
    };
};
