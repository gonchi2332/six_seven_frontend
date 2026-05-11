import { useState, useRef, useEffect } from "react";

interface Props {
    value: string;
    onChange: (val: string) => void;
    disabled?: boolean;
    placeholder?: string;
    hasError?: boolean;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

const YearSelect = ({ value, onChange, disabled = false, placeholder = "Seleccionar...", hasError = false }: Props) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

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
                    ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-pointer hover:border-blue-400"}`}
            >
                <span className={value ? "text-black" : "text-gray-400"}>{value || placeholder}</span>
                <span className="text-gray-400 text-xs ml-2">▼</span>
            </button>

            {open && (
                <div className="absolute z-[9999] left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-xl overflow-hidden">
                    <div className="overflow-y-auto max-h-[160px]">
                        <div
                            className="px-4 py-2 text-gray-400 font-nunito text-[15px] hover:bg-gray-100 cursor-pointer"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => { onChange(""); setOpen(false); }}
                        >
                            {placeholder}
                        </div>
                        {years.map((y) => (
                            <div
                                key={y}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => { onChange(String(y)); setOpen(false); }}
                                className={`px-4 py-2 font-nunito text-[15px] cursor-pointer hover:bg-blue-50
                                    ${String(y) === value ? "bg-blue-100 font-semibold text-blue-700" : "text-black"}`}
                            >
                                {y}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default YearSelect;