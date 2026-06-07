import { useRef } from "react";

// Hook para manejar el foco entre inputs individuales del código
export const useVerificationCode = (length: number, value: string[], onChange: (val: string[]) => void) => {
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (val: string, index: number) => {
        if (!/^[0-9]?$/.test(val)) return; // Solo acepta un dígito por campo
        const newValue = [...value];
        newValue[index] = val;
        onChange(newValue);
        if (val && index < length - 1) {
            inputsRef.current[index + 1]?.focus(); // Avanza al siguiente input automáticamente
        }
    };

    return { inputsRef, handleChange };
};