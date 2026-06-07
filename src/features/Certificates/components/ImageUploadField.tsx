import { useRef } from "react";

interface ImageUploadFieldProps {
    label: string;
    required?: boolean;
    preview: string | null;
    error?: string;
    touched?: boolean;
    showCurrentHint?: boolean; // Indica si ya hay una imagen cargada previamente
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

// Campo de carga de imagen con previsualización y validación
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
            {/* Aviso cuando ya existe una imagen cargada en modo edición */}
            {showCurrentHint && (
                <span className={styles.hint}>Imagen actual cargada. Selecciona una nueva para reemplazarla.</span>
            )}
            {touched && error && <span className={styles.errorText}>{error}</span>}
            {preview && <img src={preview} alt="preview" className={styles.preview} />}
        </div>
    );
};

export default ImageUploadField;