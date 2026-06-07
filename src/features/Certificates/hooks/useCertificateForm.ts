import { useState, useRef } from "react";
import type { Certificate } from "../services/certificateService";

/*
  Props del hook useCertificateForm:
  -mode: Modo del formulario - "add" (crear nuevo) o "edit" (modificar existente)
  -initial: Datos iniciales del certificado (solo en modo edit)
  -onSubmit: Función que se ejecuta al enviar el formulario, recibe los datos
*/
interface UseCertificateFormProps {
    mode: "add" | "edit";
    initial?: Certificate;
    onSubmit: (data: any) => Promise<void>;
}

/*
  Características:
  -Hook personalizado que gestiona toda la lógica del formulario de certificados
  -Maneja estado de campos: título, área, descripción, fecha, imagen
  -Validaciones: campos obligatorios (título, área, descripción, fecha, imagen)
  -Validación en tiempo real al escribir y al hacer blur
  -Modo "add": todos los campos son obligatorios, incluyendo imagen
  -Modo "edit": título y área no se pueden modificar (solo descripción, fecha, imagen)
  -isFormValid: valida según modo (add requiere todos los campos, edit solo descripción+fecha+imagen)
  -hasChanges: detecta si hay cambios para habilitar botón en modo edit
  -handleImageChange: crea URL de previsualización de la imagen
  -handleSubmit: prepara los datos y los envía al onSubmit

  @ Ejemplo modo add:
  const form = useCertificateForm({
    mode: "add",
    onSubmit: async (data) => await createCertificate(data)
  });

  @ Ejemplo modo edit:
  const form = useCertificateForm({
    mode: "edit",
    initial: existingCertificate,
    onSubmit: async (data) => await updateCertificate(data)
  });
*/
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

    /*
      Valida si el formulario es válido según el modo:
      -Modo add: título, descripción, área, fecha e imagen obligatorios
      -Modo edit: descripción, fecha e imagen (nueva o existente) obligatorios
      Título y área no se validan en modo edit porque están deshabilitados
    */
    const isFormValid = mode === "add"
        ? title.trim() !== "" &&
        description.trim() !== "" &&
        area.trim() !== "" &&
        issueDate !== "" &&
        coverImage !== null
        : description.trim() !== "" &&
        issueDate !== "" &&
        (coverImage !== null || !!initial?.coverImage);

    /*
      Detecta si hubo cambios en modo edit:
      -Descripción cambió
      -Fecha cambió
      -Se seleccionó una nueva imagen
      En modo add, siempre es true
    */
    const hasChanges = mode === "add"
        ? true : description !== (initial?.description ?? "") || issueDate !== (initial?.issueDate ?? "") || coverImage !== null;
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
        setImagePreview(URL.createObjectURL(file));
        setImageError("");
    };

    /*
      Prepara los datos y envía el formulario
      -En modo add: incluye título
      -En modo edit: no incluye título ni área
      -Si no hay imagen nueva pero existe imagen previa, la convierte de URL a File
    */
    const handleSubmit = async () => {
        if (!isFormValid) return;

        let imageToSend = coverImage;
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
            await onSubmit({
                ...baseData,
                title: title.trim(),

            });
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

