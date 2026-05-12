// hooks/useProjectInfo.ts
import { useState, useEffect } from "react";
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
        links: initialData?.links?.length ? initialData.links : [{ label: "", url: "" }],
        image: initialData?.image !== undefined ? initialData.image : null,
    });
    const [originalData, setOriginalData] = useState<Partial<CreateProjectPayload>>({});
    const [errors, setErrors] = useState<FormErrors>({});

    // Para el ImageUpload - obtener la URL de la imagen si existe
    const imageUrl = typeof formData.image === 'string' ? formData.image : null;

    // Guardar los datos originales cuando initialData cambie
    useEffect(() => {
        if (initialData && isEditing) {
            setOriginalData({
                description: initialData.description,
                topic: initialData.topic,
                role: initialData.role,
                status: initialData.status,
                links: initialData.links ? JSON.parse(JSON.stringify(initialData.links)) : undefined,
                image: initialData.image,
            });
        }
    }, [initialData, isEditing]);

    // Función para verificar si hay cambios
    const hasChanges = (): boolean => {
        if (!isEditing) return true; // En modo creación siempre habilitado

        // Comparar campos
        const descriptionChanged = formData.description !== originalData.description;
        const topicChanged = formData.topic !== originalData.topic;
        const roleChanged = formData.role !== originalData.role;
        const statusChanged = formData.status !== originalData.status;
        const linksChanged = JSON.stringify(formData.links) !== JSON.stringify(originalData.links);
        const imageChanged = formData.image !== originalData.image;

        return descriptionChanged || topicChanged || roleChanged || statusChanged || linksChanged || imageChanged;
    };

    const handleChange = <K extends keyof CreateProjectPayload>(
        field: K,
        value: CreateProjectPayload[K]
    ) => {
        let newValue = value;

        if (field === 'name' && typeof value === 'string') {
            if (value.length > 50) return;
            newValue = value;
            if (value.length > 0 && value.length > 50) {
                setErrors((prev) => ({ ...prev, [field]: "El nombre del proyecto supera el límite de 50 caracteres" }));
            } else if (value.length === 0) {
                setErrors((prev) => ({ ...prev, [field]: "El titulo del proyecto es obligatorio" }));
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
                setErrors((prev) => ({ ...prev, [field]: "La descripción es obligatoria" }));
            } else {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        }

        if (field === 'role' && typeof value === 'string') {
            if (value.length > 30) return;
            newValue = value;
            if (value.length > 0 && value.length > 30) {
                setErrors((prev) => ({ ...prev, [field]: "El rol supera el límite de 50 caracteres" }));
            } else if (value.length === 0) {
                setErrors((prev) => ({ ...prev, [field]: "El rol es obligatorio" }));
            } else {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        }

        if (field === 'topic' && typeof value === 'string') {
            newValue = value;
            if (value.length === 0) {
                setErrors((prev) => ({ ...prev, [field]: "La temática es obligatoria" }));
            } else {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        }

        if (field === 'image') {
            newValue = value;
            setErrors((prev) => ({ ...prev, image: undefined }));
        }

        setFormData((prev) => ({ ...prev, [field]: newValue }));
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
        setFormData((prev) => ({ ...prev, image: file }));
        setErrors((prev) => ({ ...prev, image: undefined }));
    };

    const validateForm = (): boolean => {
        const e: FormErrors = {};

        if (!formData.name.trim())
            e.name = "El titulo del proyecto es obligatorio";
        else if (formData.name.length > 50)
            e.name = "El titulo del proyecto supera el límite de 50 caracteres";

        if (!formData.description.trim())
            e.description = "La descripción es obligatoria";
        else if (formData.description.length > 200)
            e.description = "La descripción supera el límite de 200 caracteres";

        if (!formData.topic.trim())
            e.topic = "La temática es obligatoria";

        if (!formData.role.trim())
            e.role = "El rol es obligatorio";
        else if (formData.role.length > 50)
            e.role = "El rol supera el límite de 50 caracteres";

        if (!formData.status)
            e.status = "Estado del proyecto inválido";

        const validLinks = formData.links.filter(link => link.label.trim() !== "" && link.url.trim() !== "");

        if (validLinks.length === 0) {
            e.link0_label = "Al menos un enlace es obligatorio";
        } else {
            const urlPattern = /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/;
            formData.links.forEach((link, idx) => {
                if (link.label.trim() && !link.url.trim()) {
                    e[`link${idx}_url`] = "La URL es obligatoria";
                } else if (link.url.trim() && !link.label.trim()) {
                    e[`link${idx}_label`] = "El label es obligatorio";
                } else if (link.label.trim() && link.url.trim() && !urlPattern.test(link.url)) {
                    e[`link${idx}_url`] = "Debe ser una URL válida (ej: https://github.com/usuario)";
                }
            });
        }

        // Validación de imagen para creación
        if (!isEditing && !formData.image) {
            e.image = "La imagen del proyecto es obligatoria";
        }

        // Para edición, si no hay imagen (ni File ni URL existente)
        if (isEditing && !formData.image && !imageUrl) {
            e.image = "La imagen del proyecto es obligatoria";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const setInitialData = (data: Partial<CreateProjectPayload>) => {
        setFormData({
            ...INITIAL_FORM,
            ...data,
            links: data.links?.length ? data.links : [{ label: "", url: "" }],
            image: data.image !== undefined ? data.image : null,
        });
        setErrors({});
    };

    const reset = () => {
        setFormData({
            ...INITIAL_FORM,
            ...initialData,
            links: initialData?.links?.length ? initialData.links : [{ label: "", url: "" }],
            image: initialData?.image !== undefined ? initialData.image : null,
        });
        setErrors({});
    };

    return {
        formData,
        imageUrl,
        errors,
        hasChanges: hasChanges(), // Retornar el valor actual de hasChanges
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
