/*
  Props del componente DateField:
  -label: Etiqueta mostrada arriba del campo de fecha
  -required: Si es true, muestra un asterisco (*) indicando campo obligatorio
  -value: Valor actual de la fecha en formato YYYY-MM-DD
  -error: Mensaje de error de validación
  -touched: Indica si el campo ha sido tocado (para mostrar error)
  -disabled: Si es true, deshabilita el input
  -onChange: Función ejecutada al cambiar la fecha, recibe el nuevo valor
  -onBlur: Función ejecutada al salir del campo
*/
interface DateFieldProps {
    label: string;
    required?: boolean;
    value: string;
    error?: string;
    touched?: boolean;
    disabled?: boolean;
    onChange: (value: string) => void;
    onBlur?: () => void;
}

const styles = {
    wrapper: "flex flex-col",
    label: "mb-1 text-xl font-inter text-white",
    required: "text-white ml-0.5",
    inputBase: "w-full px-4 py-2 border rounded-xl outline-none transition-all duration-200 bg-white font-nunito text-black disabled:cursor-not-allowed",
    inputNormal: "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
    inputError: "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50",
    errorText: "mt-1 text-xs text-red-600 font-medium self-end",
};

/*
  Características:
  -Campo de fecha reutilizable para formularios
  -Utiliza input type="date" nativo del navegador
  -Muestra label con asterisco si es requerido
  -Estado normal: borde gris, al focus: borde azul
  -Estado error: borde rojo, fondo rojo claro (solo si touched es true)
  -Muestra mensaje de error debajo del campo si hay error y fue tocado

  @ Ejemplo:
  <DateField
    label="Fecha de Certificación"
    required
    value={issueDate}
    error={dateError}
    touched={dateTouched}
    disabled={isSubmitting}
    onChange={handleDateChange}
    onBlur={handleDateBlur}
  />
*/
const DateField = ({
    label, required = false, value, error, touched = false, disabled = false, onChange, onBlur,
}: DateFieldProps) => {
    return (
        <div className={styles.wrapper}>
            <label className={styles.label}>
                {label}{required && <span className={styles.required}>*</span>}
            </label>
            <input
                type="date"
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                className={`${styles.inputBase} ${touched && error ? styles.inputError : styles.inputNormal}`}
            />
            {touched && error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};

export default DateField;