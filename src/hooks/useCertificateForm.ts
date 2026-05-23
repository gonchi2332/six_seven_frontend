import { useState, useRef } from "react";
import type { Certificate } from "../services/certificateService";


const getToday = (): string => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const getMinDate = (): string => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 100);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const TODAY = getToday();
export const MIN_DATE = getMinDate();

export const getDateError = (date: string): string => {
    if (!date) return "La fecha de certificación es obligatoria";
    if (date > TODAY) return "La fecha de certificación no puede ser futura";
    if (date < MIN_DATE) return "La fecha de certificación tiene que estar dentro del rango de hoy y hace 100 años";
    return "";
};

interface UseCertificateFormProps {
    mode: "add" | "edit";
    initial?: Certificate;
    onSubmit: (data: Omit<Certificate, "id" | "coverImage"> & { coverImage: File }) => Promise<void>;
}

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

    const isDateValid = issueDate !== "" && issueDate <= TODAY && issueDate >= MIN_DATE;

    const isFormValid =
        title.trim() !== "" &&
        description.trim() !== "" &&
        area.trim() !== "" &&
        isDateValid &&
        (mode === "edit" ? (coverImage !== null || !!initial?.coverImage) : coverImage !== null);

    const hasChanges =
        mode === "add" ||
        description !== (initial?.description ?? "") ||
        area !== (initial?.area ?? "") ||
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
        setDateError(getDateError(v));
    };
    const handleDateBlur = () => {
        setDateTouched(true);
        setDateError(getDateError(issueDate));
    };

    const handleImageChange = (file: File | null) => {
        setImageTouched(true);
        if (!file) {
            setCoverImage(null);
            setImageError("La imagen de portada es obligatoria");
            return;
        }
        setCoverImage(file);
        setImagePreview(URL.createObjectURL(file));
        setImageError("");
    };

    const handleSubmit = async () => {
        if (!isFormValid) return;

        let imageToSend = coverImage;
        if (!imageToSend && mode === "edit" && initial?.coverImage) {
            const res = await fetch(initial.coverImage);
            const blob = await res.blob();
            imageToSend = new File([blob], "cover.jpg", { type: blob.type || "image/jpeg" });
        }
        if (!imageToSend) return;

        await onSubmit({
            title: title.trim(),
            description: description.trim(),
            area: area.trim(),
            issueDate,
            coverImage: imageToSend,
        });
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