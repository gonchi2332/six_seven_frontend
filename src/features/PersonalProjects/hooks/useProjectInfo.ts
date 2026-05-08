// hooks/useProjectInfo.ts
import { useState } from "react";
import type { CreateProjectPayload } from "../services/personalProjectsService";

type FormErrors = Partial<Record<keyof CreateProjectPayload | string, string>>;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_IMAGE_SIZE_MB = 2;

const INITIAL_FORM: CreateProjectPayload = {
    name: "",
    description: "",
    topic: "",
    role: "",
    status: "En proceso",
    links: [{ label: "", url: "" }],
    image: null,
};

export const useProjectForm = (initialData?: Partial<CreateProjectPayload>) => {
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
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleLinkChange = (index: number, field: "label" | "url", value: string) => {
        setFormData((prev) => {
            const updated = [...prev.links];
            if (!updated[index]) {
                updated[index] = { label: "", url: "" };
            }
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, links: updated };
        });
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
        if (!file) {
            setFormData((prev) => ({ ...prev, image: null }));
            setErrors((prev) => ({ ...prev, image: undefined }));
            return;
        }
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setErrors((prev) => ({ ...prev, image: "Solo se permiten archivos .jpg, .jpeg o .png" }));
            return;
        }
        if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, image: `La imagen no puede superar ${MAX_IMAGE_SIZE_MB}MB` }));
            return;
        }
        setErrors((prev) => ({ ...prev, image: undefined }));
        setFormData((prev) => ({ ...prev, image: file }));
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

        if (!formData.image)
            e.image = "La imagen del proyecto es requerida";

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
