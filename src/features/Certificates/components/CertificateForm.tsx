import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";
import TextField from "../../../components/TextField";
import TextAreaField from "../../../components/TextAreaField";
import DateField from "../components/DateField";
import ImageUpload from "../../UploadFile/components/uploadFile";
import useCertificateForm from "../hooks/useCertificateForm";
import type { Certificate } from "../services/certificateService";

/*
  Props del componente CertificateForm:
  -mode: Modo del formulario - "add" (crear nuevo) o "edit" (modificar existente)
  -initial: Datos iniciales del certificado (solo en modo edit)
  -onSubmit: Función que se ejecuta al enviar el formulario, recibe los datos del certificado
  -onClose: Función que se ejecuta al cancelar o cerrar
  -serverError: Mensaje de error proveniente del servidor (opcional)
  -isSubmitting: Estado de carga, deshabilita campos y botón mientras es true
*/
interface Props {
    mode: "add" | "edit";
    initial?: Certificate;
    onSubmit: (data: Omit<Certificate, "id" | "coverImage"> & { coverImage: File }) => Promise<void>;
    onClose: () => void;
    serverError?: string | null;
    isSubmitting?: boolean;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 py-4 z-50",
    body: "flex flex-col gap-4 px-4 sm:px-8 pb-2",
    serverError: "mx-4 sm:mx-8 mb-2 p-3 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-nunito text-center",
    buttonsWrapper: "flex gap-3 justify-center mt-4 px-4 sm:px-8 pb-6",
    mainLabel: "mb-1 text-xl font-inter text-white"
};

/*
  Características:
  -Formulario para registrar o modificar certificados
  -Campos: título, área, descripción, fecha de certificación, imagen
  -Todos los campos excepto fecha son obligatorios (*)
  -Validación en tiempo real mediante useCertificateForm
  -Modo "add": todos los campos editables, título y área no pueden modificarse después
  -Modo "edit": título y área deshabilitados (no se pueden cambiar), solo descripción, fecha e imagen
  -Botón enviar: deshabilitado si formulario inválido o sin cambios (modo edit)
  -Muestra error del servidor si ocurre
  -Integra ImageUpload para subir imagen (máximo 2MB)

  @ Ejemplo modo add:
  <CertificateForm
    mode="add"
    onSubmit={handleAddCertificate}
    onClose={() => setShowForm(false)}
    isSubmitting={isLoading}
  />

  @ Ejemplo modo edit:
  <CertificateForm
    mode="edit"
    initial={certificateToEdit}
    onSubmit={handleUpdateCertificate}
    onClose={() => setShowForm(false)}
    serverError={errorMessage}
  />
*/
const CertificateForm = ({ mode, initial, onSubmit, onClose, serverError, isSubmitting = false }: Props) => {
    const { title, titleError, handleTitleChange, handleTitleBlur, description, descError, handleDescChange, handleDescBlur,
        area, areaError, handleAreaChange, handleAreaBlur, issueDate, dateError, dateTouched, handleDateChange, handleDateBlur,
        imagePreview, handleImageChange, isFormValid, hasChanges, handleSubmit,
    } = useCertificateForm({ mode, initial, onSubmit });
    const formTitle = mode === "add" ? "Registrar Certificado" : `Modificar: ${initial?.title ?? ""}`;

    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <PopUpCard title={formTitle}>
                    {serverError && <div className={styles.serverError}>{serverError}</div>}
                    <div className={styles.body}>
                        <TextField
                            label="Título:*"
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Ej: AWS Certified Solutions Architect"
                            maxLength={100}
                            disabled={isSubmitting || mode === "edit"}
                            error={titleError || undefined}
                            inputProps={{ onBlur: handleTitleBlur }}
                        />
                        <TextField
                            label="Área:*"
                            value={area}
                            onChange={(e) => handleAreaChange(e.target.value)}
                            placeholder="Ej: Desarrollo Web, Cloud Computing..."
                            maxLength={100}
                            disabled={isSubmitting || mode === "edit"}
                            error={areaError || undefined}
                            inputProps={{ onBlur: handleAreaBlur }}
                        />
                        <TextAreaField
                            label="Descripción:*"
                            value={description}
                            onChange={(e) => handleDescChange(e.target.value)}
                            placeholder="Describe el contenido o logro del certificado..."
                            maxLength={200}
                            disabled={isSubmitting}
                            error={descError || undefined}
                            textareaProps={{ onBlur: handleDescBlur }}
                            rows={3}
                        />
                        <DateField
                            label="Fecha de Certificación:"
                            required
                            value={issueDate}
                            error={dateError}
                            touched={dateTouched}
                            disabled={isSubmitting}
                            onChange={handleDateChange}
                            onBlur={handleDateBlur}
                        />
                        <div className={styles.mainLabel}>Imagen:*</div>
                        <ImageUpload
                            onImageSelect={handleImageChange}
                            initialImageUrl={imagePreview}
                            maxSizeMB={2}
                        />
                    </div>
                    <div className={styles.buttonsWrapper}>
                        <Button variant="secondary" onClick={onClose} fullWidth disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            fullWidth
                            disabled={isSubmitting || !isFormValid || (mode === "edit" && !hasChanges)}
                        > {isSubmitting ? "Guardando..." : mode === "add" ? "Registrar" : "Modificar"}
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default CertificateForm;

