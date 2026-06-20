import React from 'react';

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
    const TEXTAREA_ERROR_STYLES = "border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400 bg-red-50";
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
            {/* Error bajo el textarea */}
            {error && (
                <span className="mt-1 text-xs text-red-600 font-medium self-end">
                    {error}
                </span>
            )}
        </div>
    );
};

export default TextAreaField;