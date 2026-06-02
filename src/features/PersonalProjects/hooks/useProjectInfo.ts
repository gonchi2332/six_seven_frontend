// hooks/useProjectInfo.ts
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
    initialData?: Partial<CreateProjectPayload>,  // Opcional
    isEditing: boolean = false,  // Opcional con valor por defecto
) => {
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
            if (value.length === 0) {
                setErrors((prev) => ({ ...prev, [field]: "El título del proyecto es obligatorio" }));
            } else if (value.length > 50) {
                setErrors((prev) => ({ ...prev, [field]: "El nombre del proyecto supera el límite de 50 caracteres" }));
            } else {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        }

        if (field === 'description' && typeof value === 'string') {
            if (value.length > 200) return;
            newValue = value;
            if (value.length === 0) {
                setErrors((prev) => ({ ...prev, [field]: "La descripción es obligatoria" }));
            } else if (value.length > 200) {
                setErrors((prev) => ({ ...prev, [field]: "La descripción supera el límite de 200 caracteres" }));
            } else {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        }

        if (field === 'role' && typeof value === 'string') {
            if (value.length > 50) return;
            newValue = value;
            if (value.length === 0) {
                setErrors((prev) => ({ ...prev, [field]: "El rol es obligatorio" }));
            } else if (value.length > 50) {
                setErrors((prev) => ({ ...prev, [field]: "El rol supera el límite de 50 caracteres" }));
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

        // Validar el campo cuando el usuario escribe o borra
        const errorKey = `link${index}_${field}`;

        if (field === 'label') {
            if (value.trim() === "") {
                setErrors((prev) => ({ ...prev, [errorKey]: "El nombre del enlace es obligatorio" }));
            } else {
                setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
            }
        }

        if (field === 'url') {
            if (value.trim() === "") {
                setErrors((prev) => ({ ...prev, [errorKey]: "El enlace es obligatorio" }));
            } else {
                // Validar formato de URL si no está vacío
                const urlPattern = /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/;
                if (value.trim() && !urlPattern.test(value)) {
                    setErrors((prev) => ({ ...prev, [errorKey]: "Debe ser un enlace valido (ej: https://github.com/usuario)" }));
                } else {
                    setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
                }
            }
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
        // También renombrar los errores de los índices siguientes
        setErrors(newErrors);
    };

    const handleImageChange = (file: File | null) => {
        setFormData((prev) => ({ ...prev, image: file }));
        setErrors((prev) => ({ ...prev, image: undefined }));
    };

    const validateForm = (): boolean => {
        const e: FormErrors = {};

        // Validar nombre
        if (!formData.name?.trim()) {
            e.name = "El título del proyecto es obligatorio";
        } else if (formData.name.length > 50) {
            e.name = "El título del proyecto supera el límite de 50 caracteres";
        }

        // Validar descripción
        if (!formData.description?.trim()) {
            e.description = "La descripción es obligatoria";
        } else if (formData.description.length > 200) {
            e.description = "La descripción supera el límite de 200 caracteres";
        }

        // Validar temática
        if (!formData.topic?.trim()) {
            e.topic = "La temática es obligatoria";
        }

        // Validar rol
        if (!formData.role?.trim()) {
            e.role = "El rol es obligatorio";
        } else if (formData.role.length > 50) {
            e.role = "El rol supera el límite de 50 caracteres";
        }

        // Validar enlaces
        const urlPattern = /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/;

        // Verificar si hay al menos un enlace válido
        const hasValidLink = formData.links.some(link =>
            link.label?.trim() && link.url?.trim()
        );

        if (!hasValidLink && !isEditing) {
            e.link0_label = "Al menos un enlace es obligatorio";
        }

        // Validar cada enlace individualmente
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

        // Validar imagen
        if (!formData.image && !imageUrl) {
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


    // Función para verificar si todos los campos requeridos están llenos
    const isFormComplete = () => {
        if (isEditing) return true; // Para edición, solo verificamos cambios después

        // Para crear, verificamos que todos los campos requeridos tengan valor
        const hasName = formData.name && formData.name.trim() !== "";
        const hasDescription = formData.description && formData.description.trim() !== "";
        const hasTopic = formData.topic && formData.topic.trim() !== "";
        const hasRole = formData.role && formData.role.trim() !== "";
        const hasImage = formData.image !== null && formData.image !== undefined && formData.image !== "";

        // Verificar que todos los enlaces tengan nombre y URL
        const areLinksValid = formData.links.every(link =>
            link.label && link.label.trim() !== "" &&
            link.url && link.url.trim() !== ""
        );

        return hasName && hasDescription && hasTopic && hasRole && hasImage && areLinksValid;
    };

    const hasCriticalErrors = () => {
        const criticalFields = ['name', 'description', 'topic', 'role', 'image'];

        const hasLinkErrors = formData.links.some((_, index) =>
            errors[`link${index}_label`] || errors[`link${index}_url`]
        );

        return criticalFields.some(field => errors[field]) || hasLinkErrors;
    };

    const isSubmitDisabled = () => {
        if (isSubmitting) return true;
        if (isEditing && !hasChanges) return true;
        // En modo creación, deshabilitar si el formulario no está completo o hay errores críticos
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
