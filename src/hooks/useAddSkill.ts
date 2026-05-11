import { useState, useRef } from "react";
import { postSkill, getUserSkillNames } from "../services/skillsService";
import useClickOutside from "./useClickOutside";

const useAddSkill = (
    onSubmit: (name: string, level: number) => void,
    onClose: () => void,
    catalogSkills: string[] = []
) => {
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedName, setSelectedName] = useState<string | null>(null);
    const [isOther, setIsOther] = useState(false);
    const [otherName, setOtherName] = useState("");
    const [level, setLevel] = useState(1);
    const [topError, setTopError] = useState<string | null>(null);
    const [inlineError, setInlineError] = useState<string | null>(null);
    const [hasFieldError, setHasFieldError] = useState(false);
    const [loading, setLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    useClickOutside(containerRef, () => setShowDropdown(false));

    const clearError = () => {
        setInlineError(null);
        setHasFieldError(false);
        setTopError(null);
    };

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

    const handleSelectSuggestion = (name: string) => {
        setSearch(name);
        setSelectedName(name);
        clearError();
        setShowDropdown(false);
    };

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

    const handleOtherNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtherName(e.target.value.slice(0, 50));
        clearError();
    };

    const handleConfirm = async () => {
        const nameToSubmit = isOther ? otherName.trim() : selectedName;
        if (!nameToSubmit) return;

        setLoading(true);
        clearError();

        try {
            if (!isOther) {
                const userSkills = await getUserSkillNames();
                if (userSkills.includes(nameToSubmit.toLowerCase())) {
                    setInlineError("La habilidad tecnica a insertar ya existe.");
                    setHasFieldError(true);
                    return;
                }
            }

            const outcome = await postSkill(nameToSubmit, level);
            if (outcome === "success") {
                onSubmit(nameToSubmit, level);
                onClose();
            } else {
                // not-found: habilidad no reconocida
                setTopError("La habilidad introducida no corresponde a ninguna habilidad técnica reconocible dentro del campo de la informática, ciencias de la computación y desarrollo de software.");
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "";
            if (msg === "INAPPROPRIATE") {
                setInlineError("Habilidad inválida: el nombre contiene palabras no permitidas.");
                setHasFieldError(true);
            } else if (msg === "ALREADY_EXISTS") {
                setInlineError("La habilidad tecnica a insertar ya existe.");
                setHasFieldError(true);
            } else {
                setTopError("La habilidad introducida no corresponde a ninguna habilidad técnica reconocible dentro del campo de la informática, ciencias de la computación y desarrollo de software.");
            }
        } finally {
            setLoading(false);
        }
    };

    const canConfirm = isOther ? otherName.trim().length > 0 : !!selectedName;
    const isDisabled = loading || !canConfirm;

    return {
        search, suggestions, showDropdown, setShowDropdown, selectedName,
        isOther, otherName, level, setLevel, topError, inlineError, hasFieldError,
        loading, containerRef, canConfirm, isDisabled,
        handleSearchChange, handleSelectSuggestion, handleToggleOther,
        handleOtherNameChange, handleConfirm,
    };
};

export default useAddSkill;