import React from 'react';

/*
  Propiedades del componente Button:
  -children: Contenido interno (texto, íconos, etc.)
  -variant: Define el color de fondo. Valores: primary (default), secondary, tertiary, quaternary
  -size: Tamaño del botón. Valores: sm (pequeño), md (mediano/default), lg (grande)
  -fullWidth: Si es true, el botón ocupa el 100% del ancho del contenedor
  -disabled: Si es true, el botón no es interactivo y se ve deshabilitado
  -onClick: Función que se ejecuta al hacer clic
  -type: Tipo HTML del botón: 'button' (default) o 'submit'
  -className: Clases CSS adicionales para personalización externa
*/
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  onClick?: () => void;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/*
  Caracteristicas:
  -Botón reutilizable para toda la aplicación.
  -Cuenta con 4 variantes de color, 3 tamaños, y soporte para estado deshabilitado.
  -Cuando se encuentra habilitado, tiene una animación de escala al hacer clic y efecto de sombra al pasar el mouse.

  Ejemplo de uso:
  <Button variant="primary" onClick={handleSave}>Guardar</Button>
  <Button variant="secondary" size="sm" fullWidth>Cancelar</Button>
*/
const Button = ({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  fullWidth = false,
  disabled = false,
  className = '',
  size = 'md',
}: ButtonProps) => {

  const BASE_STYLES = "rounded-xl transition-all duration-200 font-nunito font-bold cursor-pointer inline-flex items-center justify-center text-center";
  
  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm",
    md: "px-3.5 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base",
    lg: "px-4 py-2 text-base sm:px-5 sm:py-2.5 sm:text-lg",
  };
  
  const widthStyles = fullWidth ? "w-full" : "w-fit";

  const variantStyles = {
    primary: "bg-secondary text-surface hover:bg-secondary/90",
    secondary: "bg-surface text-primary hover:bg-surface/90",
    tertiary: "bg-tertiary text-surface hover:bg-tertiary/90",
    quaternary: "bg-quaternary text-secondary hover:bg-quaternary/90",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${BASE_STYLES}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${widthStyles}
        ${disabled ? "opacity-40 cursor-not-allowed" : "active:scale-[0.98] hover:shadow-md"}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;