interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  type?: 'button' | 'submit';
}

const Button = ({
  variant = 'primary',
  onClick, 
  type = 'button' 
}: ButtonProps) => {

  const baseStyles = "px-4 py-2 rounded-xl font-medium transition-colors text-surface font-nunito font-bold text-2xl";

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
    </button>
  );
};

export default Button;