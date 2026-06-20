import { useState, useEffect } from "react";
import type { CreateProjectPayload, UpdateProjectPayload } from "../services/personalProjectsService";
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

export const useProjectForm = (
    onSubmit: (data: CreateProjectPayload | UpdateProjectPayload, id?: string) => Promise<void>,
    isSubmitting: boolean,
    projectId?: string,
    initialData?: Partial<CreateProjectPayload>,
    isEditing: boolean = false,
) => {
    const [formData, setFormData] = useState<CreateProjectPayload>({
        ...INITIAL_FORM,
        ...initialData,
        links: initialData?.links?.length ? initialData.links : [{ label: "", url: "" }],
        image: initialData?.image !== undefined ? initialData.image : null,
    });
    const [originalData, setOriginalData] = useState<Partial<CreateProjectPayload>>({});
    const [errors, setErrors] = useState<FormErrors>({});

    const imageUrl = typeof formData.image === 'string' ? formData.image : null;

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

    const hasChanges = (): boolean => {
        if (!isEditing) return true;

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
            if (value.length === 0) {
                setErrors((prev) => ({ ...prev, [field]: "El título del proyecto es obligatorio" }));
            } else {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        }

        if (field === 'description' && typeof value === 'string') {
            if (value.length > 200) return;
            newValue = value;
            if (value.length === 0) {
                setErrors((prev) => ({ ...prev, [field]: "La descripción es obligatoria" }));
            } else {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        }

        if (field === 'role' && typeof value === 'string') {
            if (value.length > 50) return;
            newValue = value;
            if (value.length === 0) {
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

        if (field === 'status') {
            newValue = value;
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

        const errorKey = `link${index}_${field}`;

        if (field === 'url') {
            if (value.trim() === "") {
                setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
            } else {
                const urlPattern = /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/;
                if (!urlPattern.test(value)) {
                    setErrors((prev) => ({ ...prev, [errorKey]: "Debe ser un enlace valido (ej: https://github.com/usuario)" }));
                } else {
                    setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
                }
            }
        } else {
            setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
        }
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

        if (!formData.name?.trim()) {
            e.name = "El título del proyecto es obligatorio";
        } else if (formData.name.length > 50) {
            e.name = "El título del proyecto supera el límite de 50 caracteres";
        }

        if (!formData.description?.trim()) {
            e.description = "La descripción es obligatoria";
        } else if (formData.description.length > 200) {
            e.description = "La descripción supera el límite de 200 caracteres";
        }

        if (!formData.topic?.trim()) {
            e.topic = "La temática es obligatoria";
        }

        if (!formData.role?.trim()) {
            e.role = "El rol es obligatorio";
        } else if (formData.role.length > 50) {
            e.role = "El rol supera el límite de 50 caracteres";
        }

        const urlPattern = /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/;
        formData.links.forEach((link, idx) => {
            if (link.label?.trim() && !link.url?.trim()) {
                e[`link${idx}_url`] = "La URL es obligatoria";
            } else if (link.url?.trim() && !link.label?.trim()) {
                e[`link${idx}_label`] = "El nombre del enlace es obligatorio";
            } else if (link.label?.trim() && link.url?.trim()) {
                if (!urlPattern.test(link.url)) {
                    e[`link${idx}_url`] = "Debe ser una URL válida (ej: https://github.com/usuario)";
                }
            }
        });

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

    const isFormComplete = () => {
        if (isEditing) return true;

        const hasName = formData.name && formData.name.trim() !== "";
        const hasDescription = formData.description && formData.description.trim() !== "";
        const hasTopic = formData.topic && formData.topic.trim() !== "";
        const hasRole = formData.role && formData.role.trim() !== "";

        const areLinksValid = formData.links.every(link => {
            const hasLabel = link.label && link.label.trim() !== "";
            const hasUrl = link.url && link.url.trim() !== "";
            if (hasLabel && !hasUrl) return false;
            if (!hasLabel && hasUrl) return false;
            return true;
        });

        return hasName && hasDescription && hasTopic && hasRole && areLinksValid;
    };

    const hasCriticalErrors = () => {
        const criticalFields = ['name', 'description', 'topic', 'role'];

        const hasLinkErrors = formData.links.some((_, index) =>
            errors[`link${index}_label`] || errors[`link${index}_url`]
        );

        return criticalFields.some(field => errors[field]) || hasLinkErrors;
    };

    const isSubmitDisabled = () => {
        if (isSubmitting) return true;
        if (isEditing && !hasChanges()) return true;
        if (!isEditing && (!isFormComplete() || hasCriticalErrors())) return true;
        return false;
    };

    const getLinkError = (index: number, field: 'label' | 'url') => {
        const errorKey = `link${index}_${field}`;
        const error = errors[errorKey];
        return typeof error === 'string' ? error : undefined;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const cleanLinks = formData.links.filter(
            link => link.label?.trim() && link.url?.trim()
        );

        if (isEditing && projectId) {
            const updatePayload: UpdateProjectPayload = {
                description: formData.description,
                topic: formData.topic,
                role: formData.role,
                status: formData.status,
                links: cleanLinks,
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
                links: cleanLinks,
                image: formData.image,
            };
            await onSubmit(createPayload);
        }
    };

    return {
        formData,
        imageUrl,
        errors,
        hasChanges: hasChanges(),
        handleChange,
        handleLinkChange,
        addLink,
        removeLink,
        handleImageChange,
        validateForm,
        handleSubmit,
        setInitialData,
        isFormComplete,
        hasCriticalErrors,
        isSubmitDisabled,
        getLinkError,
        reset,
    };
};
