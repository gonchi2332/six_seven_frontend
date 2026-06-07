import { useRef } from "react";

/*
  Props del componente ImageUploadField:
  -label: Etiqueta mostrada arriba del campo de carga
  -required: Si es true, muestra un asterisco (*) indicando campo obligatorio
  -preview: URL de la imagen para mostrar vista previa (puede ser base64 o URL)
  -error: Mensaje de error de validación
  -touched: Indica si el campo ha sido tocado (para mostrar error)
  -showCurrentHint: Si es true, muestra sugerencia sobre imagen actual cargada
  -disabled: Si es true, deshabilita el input de archivo
  -onChange: Función ejecutada al seleccionar un archivo, recibe el File o null
  -onBlur: Función ejecutada al salir del campo
*/
interface ImageUploadFieldProps {
    label: string;
    required?: boolean;
    preview: string | null;
    error?: string;
    touched?: boolean;
    showCurrentHint?: boolean;
    disabled?: boolean;
    onChange: (file: File | null) => void;
    onBlur?: () => void;
}

const styles = {
    wrapper: "flex flex-col",
    label: "mb-1 text-xl font-inter text-white",
    required: "text-white ml-0.5",
    input: "w-full px-4 py-2 border rounded-xl outline-none transition-all duration-200 bg-white font-nunito cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#07393C] file:text-[#90DDF0] file:font-nunito file:text-sm hover:file:bg-[#2C666E] file:cursor-pointer",
    inputError: "border-red-500",
    inputNormal: "border-gray-300",
    hint: "mt-1 text-xs text-white/50 font-nunito",
    errorText: "mt-1 text-xs text-red-600 font-medium self-end",
    preview: "w-full h-32 object-contain rounded-xl border border-white/10 bg-black/20 mt-2",
};

/*
  Características:
  -Campo de carga de imágenes reutilizable para formularios
  -Acepta solo archivos de imagen (accept="image/*")
  -Muestra label con asterisco si es requerido
  -Botón de archivo estilizado con colores del tema
  -Estado error: borde rojo (solo si touched es true)
  -Muestra mensaje de error debajo del campo si hay error y fue tocado
  -Muestra vista previa de la imagen seleccionada
  -showCurrentHint: útil en modo edición para indicar que hay imagen actual

  @ Ejemplo:
  <ImageUploadField
    label="Foto de Perfil"
    required
    preview={imagePreview}
    error={imageError}
    touched={imageTouched}
    showCurrentHint={isEditMode}
    disabled={isSubmitting}
    onChange={handleImageChange}
    onBlur={handleImageBlur}
  />
*/
const ImageUploadField = ({
    label, required = false, preview, error, touched = false,
    showCurrentHint = false, disabled = false, onChange, onBlur,
}: ImageUploadFieldProps) => {
    const fileRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        onChange(file);
    };

    return (
        <div className={styles.wrapper}>
            <label className={styles.label}>
                {label}{required && <span className={styles.required}>*</span>}
            </label>
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                onBlur={onBlur}
                disabled={disabled}
                className={`${styles.input} ${touched && error ? styles.inputError : styles.inputNormal}`}
            />
            {showCurrentHint && (
                <span className={styles.hint}>Imagen actual cargada. Selecciona una nueva para reemplazarla.</span>
            )}
            {touched && error && <span className={styles.errorText}>{error}</span>}
            {preview && <img src={preview} alt="preview" className={styles.preview} />}
        </div>
    );
};

export default ImageUploadField;