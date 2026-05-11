import React from 'react';

interface ButtonProps {
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  onClick?: () => void;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;  // ← Nueva prop para clases adicionales
  size?: 'sm' | 'md' | 'lg';  // ← Nueva prop para tamaños
}

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

  // Base styles responsivos
  const BASE_STYLES = "rounded-xl transition-all duration-200 font-nunito font-bold cursor-pointer";
  
  // Tamaños responsivos
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base",
    md: "px-4 py-2 text-base sm:text-xl md:text-2xl",
    lg: "px-5 py-2.5 text-lg sm:text-2xl md:text-3xl",
  };
  
  // Ancho
  const widthStyles = fullWidth ? "w-full" : "w-fit";

  // Variantes de color
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
        ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-95"} 
        ${className}
      `}
    >
      {children} 
    </button>
  );
};

export default Button;