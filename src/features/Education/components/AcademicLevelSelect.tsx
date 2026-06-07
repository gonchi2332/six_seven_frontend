import { useState, useRef, useEffect } from "react";

/*
  Props del componente AcademicLevelSelect:
  -value: ID del nivel académico seleccionado
  -onChange: Función ejecutada al seleccionar un nivel, recibe el ID
  -disabled: Si es true, deshabilita el select
  -placeholder: Texto mostrado cuando no hay selección
  -hasError: Si es true, muestra borde rojo indicando error
  -options: Lista de opciones (id y nombre del nivel académico)
*/
interface Props {
    value: number;
    onChange: (val: number) => void;
    disabled?: boolean;
    placeholder?: string;
    hasError?: boolean;
    options: Array<{ id: number; academicdegree: string }>;
}

/*
  Características:
  -Select personalizado para nivel académico (reemplaza el nativo)
  -Maneja estado de apertura/cierre del dropdown
  -Cierra automáticamente al hacer clic fuera del componente (detectado con useRef y event listener)
  -Muestra placeholder cuando no hay valor seleccionado (texto gris)
  -Opción adicional para limpiar selección (placeholder al inicio de la lista)
  -Estado error: borde rojo y fondo rojo claro (bg-red-50)
  -Estado disabled: cursor not-allowed y fondo gris
  -Dropdown con scroll si hay muchas opciones (max-h-[240px])
  -Opción seleccionada resaltada en azul (bg-blue-100, font-semibold, text-blue-700)

  @ Ejemplo:
  <AcademicLevelSelect
    value={selectedLevelId}
    onChange={(id) => setSelectedLevelId(id)}
    options={academicLevels}
    placeholder="Selecciona tu nivel académico"
    hasError={!!error}
    disabled={isSubmitting}
  />
*/
const AcademicLevelSelect = ({ 
    value, 
    onChange, 
    disabled = false, 
    placeholder = "Seleccionar...", 
    hasError = false,
    options 
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
                        {/* Opción para limpiar selección */}
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