import { useRef } from "react";

export const useVerificationCode = (length: number, value: string[], onChange: (val: string[]) => void) => {
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (val: string, index: number) => {
        if (!/^[0-9]?$/.test(val)) return;

        const newValue = [...value];
        newValue[index] = val;
        onChange(newValue);

        if (val && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    return { inputsRef, handleChange };
};
