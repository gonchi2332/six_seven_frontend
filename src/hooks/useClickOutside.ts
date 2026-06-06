// hooks/useClickOutside.ts
import { useEffect, type RefObject } from "react";

// Hook para detectar clics fuera de un elemento referenciado
const useClickOutside = (ref: RefObject<HTMLElement | null>, callback: () => void) => {
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                callback();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref, callback]);
};

export default useClickOutside;