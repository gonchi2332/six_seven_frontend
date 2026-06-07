import React from 'react';

/*
  Propiedades del componente TextField:
  -label: Etiqueta mostrada arriba del campo de texto
  -value: Valor actual del input
  -onChange: Función que se ejecuta al cambiar el contenido
  -placeholder: Texto de ayuda dentro del campo
  -type: Tipo de input (text, password, email, number, date). Por defecto 'text'
  -error: Mensaje de error de validación (cambia el borde a rojo y fondo a rojo claro)
  -maxLength: Número máximo de caracteres permitidos
  -className: Clases CSS adicionales para el contenedor
  -disabled: Si es true, deshabilita el input
  -inputProps: Propiedades HTML adicionales para el input
*/
interface TextFieldProps {
  label?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number'|'date';
  error?: string;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

/*
  Caracteristicas:
  -Campo de texto reutilizable para formularios.
  -Si se proporciona label, se muestra arriba del input.
  -Si hay error, el borde se vuelve rojo y se muestra un mensaje debajo.
  -Cuando no hay valor, el texto se muestra en gris.
  -Soporta el tipo "date" con un comportamiento especial:
    @ Inicialmente se muestra como tipo "text" con placeholder
    @ Al hacer focus, cambia a tipo "date" mostrando el selector
    @ Al hacer blur sin valor, vuelve a tipo "text"

  Ejemplo de uso básico:
  <TextField 
    label="Nombre"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Ingresa tu nombre"
  />

  Ejemplo con validación:
  <TextField 
    label="Email"
    type="email"
    value={email}
    onChange={handleEmailChange}
    error="Correo electrónico inválido"
  />
*/
const TextField = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  maxLength,
  className = '',
  disabled = false,
  inputProps = {},
}: TextFieldProps) => {

  const INPUT_BASE_STYLES = "w-full px-4 py-2 border rounded-xl outline-none transition-all duration-200 bg-white font-nunito disabled:cursor-not-allowed";
  const INPUT_NORMAL_STYLES = "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  const INPUT_ERROR_STYLES = "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50";
  const MAIN_LABEL_STYLES = "mb-1 text-xl font-inter text-white";

  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className={MAIN_LABEL_STYLES}>{label}</label>}
      
      <input
        type={type === 'date' && !value ? 'text' : type}
        onFocus={(e) => {
          if (type === 'date') e.target.type = 'date';
        }}
        onBlur={(e) => {
          if (type === 'date' && !e.target.value) e.target.type = 'text';
        }}
        className={`${INPUT_BASE_STYLES} ${
          error ? INPUT_ERROR_STYLES : INPUT_NORMAL_STYLES
        } ${!value ? "text-gray-400" : "text-black"}`}        
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        {...inputProps}
      />

      {error && (
        <span className="mt-1 text-xs text-red-600 font-medium self-end">
          {error}
        </span>
      )}
    </div>
  );
};

export default TextField;