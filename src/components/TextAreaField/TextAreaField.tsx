// components/TextAreaField/index.tsx
import React from 'react';

/*
  Propiedades del componente TextAreaField:
  -label: Etiqueta mostrada arriba del campo de texto
  -value: Valor actual del textarea
  -onChange: Función que se ejecuta al cambiar el contenido
  -placeholder: Texto de ayuda dentro del campo
  -error: Mensaje de error de validación (cambia el borde a rojo y fondo a rojo claro)
  -maxLength: Número máximo de caracteres permitidos
  -className: Clases CSS adicionales para el contenedor
  -disabled: Si es true, deshabilita el textarea
  -rows: Número de filas visibles (por defecto 4)
  -textareaProps: Propiedades HTML adicionales para el textarea
*/
interface TextAreaFieldProps {
    label?: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    error?: string;
    maxLength?: number;
    className?: string;
    disabled?: boolean;
    rows?: number;
    textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}

/*
  Caracteristicas:
  -Campo de texto multilínea reutilizable para formularios.
  -Si se proporciona label, se muestra arriba del textarea.
  -Si hay error, el borde se vuelve rojo y se muestra un mensaje debajo.
  -Cuando no hay valor, el texto se muestra en gris.
  -El textarea es redimensionable verticalmente (resize-vertical).

  Ejemplo de uso básico:
  <TextAreaField 
    label="Descripción"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Escribe tu descripción..."
  />

  Ejemplo con validación:
  <TextAreaField 
    label="Biografía"
    value={bio}
    onChange={handleBioChange}
    error="La biografía es requerida"
    maxLength={500}
  />
*/
const TextAreaField = ({
    label,
    value,
    onChange,
    placeholder,
    error,
    maxLength,
    className = '',
    disabled = false,
    rows = 4,
    textareaProps = {},
}: TextAreaFieldProps) => {

    const TEXTAREA_BASE_STYLES = "w-full px-4 py-2 border rounded-xl outline-none transition-all duration-200 bg-white font-nunito disabled:cursor-not-allowed resize-vertical";
    const TEXTAREA_NORMAL_STYLES = "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
    const TEXTAREA_ERROR_STYLES = "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50";
    const MAIN_LABEL_STYLES = "mb-1 text-xl font-inter text-white";

    return (
        <div className={`flex flex-col ${className}`}>
            {label && <label className={MAIN_LABEL_STYLES}>{label}</label>}

            <textarea
                rows={rows}
                className={`${TEXTAREA_BASE_STYLES} ${error ? TEXTAREA_ERROR_STYLES : TEXTAREA_NORMAL_STYLES
                    } ${!value ? "text-gray-400" : "text-black"}`}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                disabled={disabled}
                {...textareaProps}
            />

            {error && (
                <span className="mt-1 text-xs text-red-600 font-medium self-end">
                    {error}
                </span>
            )}
        </div>
    );
};

export default TextAreaField;