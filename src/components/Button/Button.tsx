import React from 'react';

interface ButtonProps {
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  type?: 'button' | 'submit';
}

const Button = ({
  children, 
  variant = 'primary',
  onClick, 
  type = 'button' 
}: ButtonProps) => {

  const baseStyles = "px-6 py-2 rounded-xl transition-all duration-200 font-nunito font-bold text-2xl w-fit cursor-pointer";

  const variantStyles = {
    primary: "bg-secondary text-surface" ,
    secondary: "bg-surface text-primary",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {children} 
    </button>
  );
};

export default Button;