import { useState } from "react";

const MAX_NAME_LENGTH = 50;

interface UseSkillFormProps {
  initialName?: string;
  initialLevel?: number;
  onSubmit: (name: string, level: number) => Promise<void>;
  onClose: () => void;
}

export const useSkillForm = ({
  initialName = "",
  initialLevel = 1,
  onSubmit,
  onClose,
}: UseSkillFormProps) => {
  const [name, setName] = useState(initialName);
  const [level, setLevel] = useState(initialLevel);
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTooLong = name.length > MAX_NAME_LENGTH;
  const isEmpty = name.trim().length === 0;
  const isValid = !isEmpty && !isTooLong;

  const nameError = touched
    ? isTooLong
      ? "El máximo es 50 caracteres"
      : isEmpty
      ? "El nombre es requerido"
      : undefined
    : undefined;

  const handleSubmit = async () => {
    setTouched(true);
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      await onSubmit(name.trim(), level);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return {
    name,
    setName,
    level,
    setLevel,
    touched,
    isValid,
    nameError,
    isSubmitting,
    handleSubmit,
    handleCancel,
  };
};