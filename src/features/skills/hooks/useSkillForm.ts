import { useState } from "react";

interface UseSkillFormProps {
  initialName?: string;
  initialLevel?: number;
  onSubmit: (name: string, level: number) => void;
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

  const isValid = name.trim().length > 0;

  const handleSubmit = () => {
    setTouched(true);
    if (!isValid) return;
    onSubmit(name.trim(), level);
    onClose();
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
  handleSubmit,
  handleCancel,
};
};