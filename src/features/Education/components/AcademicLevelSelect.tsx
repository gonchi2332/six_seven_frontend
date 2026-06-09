import { useState, useRef, useEffect } from "react";

interface Props {
    value: number;
    onChange: (val: number) => void;
    disabled?: boolean;
    placeholder?: string;
    hasError?: boolean;
    options: Array<{ id: number; academicdegree: string }>;
}

// Selector de grado académico con dropdown personalizado
const AcademicLevelSelect = ({
    value, onChange, disabled = false, placeholder = "Seleccionar...", hasError = false, options
}: Props) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.id === value);

    // Cierra el dropdown al hacer clic fuera del componente
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative w-full">
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen((o) => !o)}
                className={`w-full bg-white border rounded-xl px-4 py-2 font-nunito text-[15px] outline-none transition-all flex items-center justify-between
                    ${hasError ? "border-red-500 bg-red-50" : "border-gray-300"}
                    ${disabled ? "cursor-not-allowed bg-gray-100" : "cursor-pointer hover:border-blue-400"}`}
            >
                <span className={selectedOption ? "text-black" : "text-gray-400"}>
                    {selectedOption?.academicdegree || placeholder}
                </span>
                <span className="text-gray-400 text-xs ml-2">▼</span>
            </button>
            {open && (
                <div className="absolute z-[9999] left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-xl overflow-hidden">
                    <div className="overflow-y-auto max-h-[240px]">
                        <div
                            className="px-4 py-2 text-gray-400 font-nunito text-[15px] hover:bg-gray-100 cursor-pointer"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => { onChange(0); setOpen(false); }}
                        >
                            {placeholder}
                        </div>
                        {options.map((opt) => (
                            <div
                                key={opt.id}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => { onChange(opt.id); setOpen(false); }}
                                className={`px-4 py-2 font-nunito text-[15px] cursor-pointer hover:bg-blue-50
                                    ${opt.id === value ? "bg-blue-100 font-semibold text-blue-700" : "text-black"}`}
                            >
                                {opt.academicdegree}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AcademicLevelSelect;