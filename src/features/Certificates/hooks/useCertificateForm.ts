import { useState, useRef } from "react";
import type { Certificate } from "../services/certificateService";

interface UseCertificateFormProps {
    mode: "add" | "edit";
    initial?: Certificate;
    onSubmit: (data: any) => Promise<void>;
}

// Hook para gestionar el formulario de certificados en modo add y edit
const useCertificateForm = ({ mode, initial, onSubmit }: UseCertificateFormProps) => {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [titleError, setTitleError] = useState("");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [descError, setDescError] = useState("");
    const [area, setArea] = useState(initial?.area ?? "");
    const [areaError, setAreaError] = useState("");
    const [issueDate, setIssueDate] = useState(initial?.issueDate ?? "");
    const [dateError, setDateError] = useState("");
    const [dateTouched, setDateTouched] = useState(false);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initial?.coverImage ?? null);
    const [imageError, setImageError] = useState("");
    const [imageTouched, setImageTouched] = useState(false);

    const fileRef = useRef<HTMLInputElement>(null);

    // En modo add requiere imagen nueva; en modo edit acepta la imagen existente
    const isFormValid = mode === "add"
        ? title.trim() !== "" && description.trim() !== "" && area.trim() !== "" && issueDate !== "" && coverImage !== null
        : description.trim() !== "" && issueDate !== "" && (coverImage !== null || !!initial?.coverImage);

    // En modo add siempre hay cambios; en modo edit compara con los datos originales
    const hasChanges = mode === "add"
        ? true
        : description !== (initial?.description ?? "") ||
          issueDate !== (initial?.issueDate ?? "") ||
          coverImage !== null;

    const handleTitleChange = (v: string) => {
        setTitle(v);
        setTitleError(v.trim() ? "" : "El título es obligatorio");
    };
    const handleTitleBlur = () => setTitleError(title.trim() ? "" : "El título es obligatorio");

    const handleDescChange = (v: string) => {
        setDescription(v);
        setDescError(v.trim() ? "" : "La descripción es obligatoria");
    };
    const handleDescBlur = () => setDescError(description.trim() ? "" : "La descripción es obligatoria");

    const handleAreaChange = (v: string) => {
        setArea(v);
        setAreaError(v.trim() ? "" : "El área es obligatoria");
    };
    const handleAreaBlur = () => setAreaError(area.trim() ? "" : "El área es obligatoria");

    const handleDateChange = (v: string) => {
        setIssueDate(v);
        setDateTouched(true);
        setDateError("");
    };
    const handleDateBlur = () => {
        setDateTouched(true);
        if (!issueDate) setDateError("La fecha de certificación es obligatoria");
        else setDateError("");
    };

    const handleImageChange = (file: File | null) => {
        setImageTouched(true);
        if (!file) {
            setCoverImage(null);
            setImageError("La imagen de portada es obligatoria");
            return;
        }
        setCoverImage(file);
        setImagePreview(URL.createObjectURL(file)); // Genera URL temporal para previsualización
        setImageError("");
    };

    const handleSubmit = async () => {
        if (!isFormValid) return;

        let imageToSend = coverImage;
        // En modo edit sin nueva imagen, convierte la imagen existente a File
        if (!imageToSend && mode === "edit" && initial?.coverImage) {
            const res = await fetch(initial.coverImage);
            const blob = await res.blob();
            imageToSend = new File([blob], "cover.jpg", { type: blob.type || "image/jpeg" });
        }
        if (!imageToSend) return;

        const baseData = {
            description: description.trim(),
            area: area.trim(),
            issueDate,
            coverImage: imageToSend,
        };

        if (mode === "add") {
            await onSubmit({ ...baseData, title: title.trim() });
        } else {
            await onSubmit(baseData as any);
        }
    };

    return {
        title, titleError, handleTitleChange, handleTitleBlur,
        description, descError, handleDescChange, handleDescBlur,
        area, areaError, handleAreaChange, handleAreaBlur,
        issueDate, dateError, dateTouched, handleDateChange, handleDateBlur,
        coverImage, imagePreview, imageError, imageTouched, handleImageChange,
        fileRef, isFormValid, hasChanges, handleSubmit,
    };
};

export default useCertificateForm;