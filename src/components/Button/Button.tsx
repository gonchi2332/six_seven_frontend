import React from 'react';

interface ButtonProps {
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
  disabled?: boolean;
}

const Button = ({
  children, 
  variant = 'primary',
  onClick, 
  type = 'button', 
  fullWidth = false,
  disabled = false,
}: ButtonProps) => {

  const BASE_STYLES = "px-6 py-2 rounded-xl transition-all duration-200 font-nunito font-bold text-2xl w-fit cursor-pointer";

  const variantStyles = {
    primary: "bg-secondary text-surface" ,
    secondary: "bg-surface text-primary",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled} 
      className={`${BASE_STYLES} ${variantStyles[variant]} ${fullWidth ? "w-full" : "w-fit"} ${
        disabled ? "opacity-50 cursor-not-allowed" : "" 
      }`}
    >
      {children} 
    </button>
  );
};

export default Button;