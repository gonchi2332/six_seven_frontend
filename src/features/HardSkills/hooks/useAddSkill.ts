import { useState, useRef } from "react";
import { postSkill, getUserSkillNames } from "../services/skillsService";
import useClickOutside from "../../../hooks/useClickOutside";

/*
  Características:
  -Hook personalizado que gestiona la lógica del formulario de agregar habilidad
  -Maneja dos modos: selección del catálogo (autocompletado) o "otro" (nombre personalizado)
  -Autocompletado: muestra sugerencias mientras escribe, filtradas del catálogo
  -Validaciones: habilidad no puede estar vacía, no puede duplicar existentes (si es del catálogo)
  -Llama al servicio postSkill para registrar la habilidad
  -Maneja errores específicos: INAPPROPRIATE (palabras prohibidas), ALREADY_EXISTS (habilidad duplicada)
  -Cierra el dropdown al hacer clic fuera (useClickOutside)

  @ Parámetros:
  -onSubmit: Función ejecutada al registrar exitosamente (recibe nombre y nivel)
  -onClose: Función ejecutada al cerrar el popup
  -catalogSkills: Lista de habilidades predefinidas del catálogo

  @ Retorna:
  -search, suggestions, showDropdown, isOther, otherName, level, topError, inlineError, etc.
  -handlers: handleSearchChange, handleSelectSuggestion, handleToggleOther, handleConfirm, etc.

  @ Ejemplo:
  const addSkill = useAddSkill(
    (name, level) => addSkillToList(name, level),
    () => setShowPopup(false),
    ["JavaScript", "React", "Python"]
  );
*/
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

    /*
      Valida y envía la habilidad al servidor
      -Verifica si la habilidad ya existe en el catálogo del usuario (solo para selección)
      -Llama a postSkill con el nombre y nivel
      -Maneja errores: INAPPROPRIATE (palabras prohibidas), ALREADY_EXISTS (duplicada)
      -Si es "otro", no valida duplicados en el backend (se permite)
    */
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

