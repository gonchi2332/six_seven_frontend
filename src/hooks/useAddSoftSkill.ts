import { useState, useRef } from "react";
import { postSoftSkill, getUserSoftSkillNames } from "../services/softSkillService";
import useClickOutside from "./useClickOutside";

export type SoftSkillResultType = "success" | "not-found";

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
    const [result, setResult] = useState<SoftSkillResultType | null>(null);
    const [inlineError, setInlineError] = useState<string | null>(null);
    const [hasFieldError, setHasFieldError] = useState(false);
    const [loading, setLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    useClickOutside(containerRef, () => setShowDropdown(false));

    const clearError = () => {
        setInlineError(null);
        setHasFieldError(false);
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
            }
            setResult(outcome);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "";
            if (msg === "INAPPROPRIATE") {
                setInlineError("Habilidad inválida: el nombre contiene palabras no permitidas.");
                setHasFieldError(true);
            } else if (msg === "ALREADY_EXISTS") {
                setInlineError("El usuario ya tiene registrada esta habilidad blanda");
                setHasFieldError(true);
            } else {
                setResult("not-found");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResultClose = () => {
        setResult(null);
        onClose();
    };

    const canConfirm = isOther ? otherName.trim().length > 0 : !!selectedName;
    const isDisabled = loading || !canConfirm;

    return {
        search, suggestions, showDropdown, setShowDropdown, selectedName,
        isOther, otherName, result, inlineError, hasFieldError, loading,
        containerRef, canConfirm, isDisabled,
        handleSearchChange, handleSelectSuggestion, handleToggleOther,
        handleOtherNameChange, handleConfirm, handleResultClose,
    };
};

export default useAddSoftSkill;