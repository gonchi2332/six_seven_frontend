import { useState } from "react";
import type { CreateProjectPayload } from "../services/personalProjectsService";

type FormErrors = Partial<Record<keyof CreateProjectPayload | "link0" | "link1", string>>;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_IMAGE_SIZE_MB = 2;

const INITIAL_FORM: CreateProjectPayload = {
    name: "",
    description: "",
    topic: "",
    role: "",
    status: "En proceso",
    links: [""],
    image: null,
};

export const useProjectForm = (initialData?: Partial<CreateProjectPayload>) => {
    const [formData, setFormData] = useState<CreateProjectPayload>({
        ...INITIAL_FORM,
        ...initialData,
        links: initialData?.links || [""],
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = <K extends keyof CreateProjectPayload>(
        field: K,
        value: CreateProjectPayload[K]
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleLinkChange = (index: 0 | 1, value: string) => {
        setFormData((prev) => {
            const updated = [...prev.links] as [string] | [string, string];
            updated[index] = value;
            return { ...prev, links: updated };
        });
        setErrors((prev) => ({ ...prev, [`link${index}`]: undefined }));
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

        const validLinks = formData.links.filter(link => link.trim() !== "");

        if (validLinks.length === 0) {
            e.link0 = "Al menos un enlace es requerido";
        } else if (validLinks.length > 2) {
            e.link0 = "Solo se permiten un máximo de 2 enlaces";
        } else {
            const domainPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
            if (validLinks[0] && !domainPattern.test(validLinks[0])) {
                e.link0 = `El enlace '${validLinks[0]}' no cumple con el formato válido (dominio.extension)`;
            }
            if (validLinks[1] && !domainPattern.test(validLinks[1])) {
                e.link1 = `El enlace '${validLinks[1]}' no cumple con el formato válido (dominio.extension)`;
            }
        }

        if (!formData.image)
            e.image = "La imagen del proyecto es requerida";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const setInitialData = (data: Partial<CreateProjectPayload>) => {
        setFormData({ ...INITIAL_FORM, ...data, links: data.links || [""] });
        setErrors({});
    };

    const reset = () => {
        setFormData({ ...INITIAL_FORM, ...initialData, links: initialData?.links || [""] });
        setErrors({});
    };

    return {
        formData,
        errors,
        handleChange,
        handleLinkChange,
        handleImageChange,
        validateForm,
        setInitialData,
        reset,
    };
};
