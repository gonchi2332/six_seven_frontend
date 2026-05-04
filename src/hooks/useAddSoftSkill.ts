import { useState, useRef } from "react";
import { getCatalogSoftSkills, postSoftSkill } from "../services/softSkillService";
import useClickOutside from "./useClickOutside";
import type { SoftSkill } from "../services/softSkillService";

export type SoftSkillResultType = "success" | "not-found";

const useAddSoftSkill = (
    onSubmit: (name: string) => void,
    onClose: () => void,
    username: string,
    userSkills: SoftSkill[]
) => {
    const [search, setSearch] = useState("");
    const [allSkills] = useState<string[]>(getCatalogSoftSkills());
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

    const isDuplicate = (name: string): boolean =>
        userSkills.some((s) => s.name.toLowerCase() === name.toLowerCase());

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        setSelectedName(null);
        clearError();
        if (val.trim()) {
            setSuggestions(allSkills.filter((s) => s.toLowerCase().includes(val.toLowerCase())));
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

        await new Promise((resolve) => setTimeout(resolve, 600));

        try {
            if (isDuplicate(nameToSubmit)) {
                setInlineError("Esta habilidad ya ha sido añadida anteriormente.");
                setHasFieldError(true);
                return;
            }

            const outcome = await postSoftSkill(nameToSubmit, username);
            onSubmit(nameToSubmit);
            setResult(outcome);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "";
            if (msg === "INAPPROPRIATE") {
                setInlineError("Habilidad inválida: el nombre contiene palabras no permitidas.");
                setHasFieldError(true);
            } else if (msg === "ALREADY_EXISTS") {
                setInlineError("Esta habilidad ya ha sido añadida anteriormente.");
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
        search,
        suggestions,
        showDropdown,
        setShowDropdown,
        isOther,
        otherName,
        result,
        inlineError,
        hasFieldError,
        loading,
        isDisabled,
        containerRef,
        handleSearchChange,
        handleSelectSuggestion,
        handleToggleOther,
        handleOtherNameChange,
        handleConfirm,
        handleResultClose,
    };
};

export default useAddSoftSkill;