import React from 'react';

interface TextFieldProps {
  label?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'date';
  error?: string;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
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
  inputProps = {},
}: TextFieldProps) => {
  const INPUT_BASE_STYLES = "w-full px-4 py-2 border rounded-xl outline-none transition-all duration-200 bg-white font-nunito disabled:cursor-not-allowed";
  const INPUT_NORMAL_STYLES = "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  const INPUT_ERROR_STYLES = "border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400 bg-red-50";
  const MAIN_LABEL_STYLES = "mb-1 text-xl font-inter text-white";

  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className={MAIN_LABEL_STYLES}>{label}</label>}
      <input
        type={type === 'date' && !value ? 'text' : type}
        onFocus={(e) => {
          if (type === 'date') e.target.type = 'date'; // Activa el selector de fecha al enfocar
        }}
        onBlur={(e) => {
          if (type === 'date' && !e.target.value) e.target.type = 'text'; // Vuelve a text si queda vacío
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
      {/* Error bajo el input */}
      {error && (
        <span className="mt-1 text-xs text-red-600 font-medium self-end">
          {error}
        </span>
      )}
    </div>
  );
};

export default TextField;