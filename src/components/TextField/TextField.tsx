import React from 'react';

interface TextFieldProps {
  label?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number'; 
  error?: string;
  maxLength?: number;
  className?: string; 
  disabled?: boolean;
}

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
}: TextFieldProps) => {
  
  const inputBaseStyles = "w-full px-4 py-2 border rounded-xl outline-none transition-all duration-200 bg-white font-nunito disabled:cursor-not-allowed";
  const inputNormalStyles = "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  const inputErrorStyles = "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50";
  const mainLabelStyles = "mb-1 text-xl font-inter text-white";
  
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className={mainLabelStyles}>
          {label}
        </label>
      )}
      <input
        type={type}
        className={`${inputBaseStyles} ${error ? inputErrorStyles : inputNormalStyles}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
      />
      
      {error && (
        <span className="mt-1 text-xs text-red-600 font-medium">
          {error}
        </span>
      )}
    </div>
  );
};

export default TextField;