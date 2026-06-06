// hooks/useAddSoftSkill.ts
import { useState, useRef } from "react";
import { postSoftSkill, getUserSoftSkillNames } from "../services/softSkillService";
import useClickOutside from "../../../hooks/useClickOutside";

export type SoftSkillResultType = "success" | "not-found";

// Hook para agregar una habilidad blanda a un usuario
const useAddSoftSkill = (
    onSubmit: (name: string) => void,
    onClose: () => void,
    username: string,
    catalogSkills: string[] = []
) => {
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedName, setSelectedName] = useState<string | null>(null);
    const [isOther, setIsOther] = useState(false);
    const [otherName, setOtherName] = useState("");
    const [topError, setTopError] = useState<string | null>(null);
    const [inlineError, setInlineError] = useState<string | null>(null);
    const [hasFieldError, setHasFieldError] = useState(false);
    const [loading, setLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    useClickOutside(containerRef, () => setShowDropdown(false));

    // Limpiar todos los errores
    const clearError = () => {
        setInlineError(null);
        setHasFieldError(false);
        setTopError(null);
    };

    // Manejar cambios en el campo de busqueda
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.slice(0, 50);
        setSearch(val);
        setSelectedName(null);
        clearError();
        if (val.trim()) {
            setSuggestions(catalogSkills.filter((s) => s.toLowerCase().includes(val.toLowerCase())));
            setShowDropdown(true);
        } else {
            setSuggestions([]);
            setShowDropdown(false);
        }
    };

    // Seleccionar una sugerencia del dropdown
    const handleSelectSuggestion = (name: string) => {
        setSearch(name);
        setSelectedName(name);
        clearError();
        setShowDropdown(false);
    };

    // Alternar modo "otra habilidad"
    const handleToggleOther = () => {
        setIsOther((prev) => {
            if (!prev) {
                setSearch("");
                setSelectedName(null);
                setSuggestions([]);
                setShowDropdown(false);
            } else {
                setOtherName("");
            }
            clearError();
            return !prev;
        });
    };

    // Manejar cambio en el campo de otra habilidad
    const handleOtherNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtherName(e.target.value.slice(0, 50));
        clearError();
    };

    // Confirmar y enviar la habilidad
    const handleConfirm = async () => {
        const nameToSubmit = isOther ? otherName.trim() : selectedName;
        if (!nameToSubmit) return;

        setLoading(true);
        clearError();

        try {
            if (!isOther) {
                const userSkills = await getUserSoftSkillNames(username);
                if (userSkills.includes(nameToSubmit.toLowerCase())) {
                    setInlineError("El usuario ya tiene registrada esta habilidad blanda");
                    setHasFieldError(true);
                    return;
                }
            }

            const outcome = await postSoftSkill(nameToSubmit);
            if (outcome === "success") {
                onSubmit(nameToSubmit);
                onClose();
            } else {
                // not-found
                setTopError("La habilidad introducida no corresponde a ninguna habilidad blanda reconocible dentro del campo de la informática, ciencias de la computación y desarrollo de software.");
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "";
            if (msg === "INAPPROPRIATE") {
                setInlineError("Habilidad inválida: el nombre contiene palabras no permitidas.");
                setHasFieldError(true);
            } else if (msg === "ALREADY_EXISTS") {
                setInlineError("El usuario ya tiene registrada esta habilidad blanda");
                setHasFieldError(true);
            } else {
                setTopError("La habilidad introducida no corresponde a ninguna habilidad blanda reconocible dentro del campo de la informática, ciencias de la computación y desarrollo de software.");
            }
        } finally {
            setLoading(false);
        }
    };

    const canConfirm = isOther ? otherName.trim().length > 0 : !!selectedName;
    const isDisabled = loading || !canConfirm;

    return {
        search, suggestions, showDropdown, setShowDropdown, selectedName,
        isOther, otherName, topError, inlineError, hasFieldError, loading,
        containerRef, canConfirm, isDisabled,
        handleSearchChange, handleSelectSuggestion, handleToggleOther,
        handleOtherNameChange, handleConfirm,
    };
};

export default useAddSoftSkill;