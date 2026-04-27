import { useState } from "react";

export interface FormData {
  firstName: string;
  firstSurname: string;
  secondSurname: string;
  city: string;
  email: string;
  phone: string;
  country: string;
  profileImage: File | null;
  profileImageUrl: string | null;
}

export const useProfileForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    firstSurname: "",
    secondSurname: "",
    city: "",
    email: "",
    phone: "",
    country: "",
    profileImage: null,
    profileImageUrl: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const setInitialData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleChange = (field: keyof FormData, value: string | File | null) => {
    const newErrors = { ...errors };
    if (typeof value === "string") {
      if (["firstName", "firstSurname", "secondSurname"].includes(field)) {
        const spanishLettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/;
        if (!spanishLettersRegex.test(value)) {
          newErrors[field] = "Solo se permiten letras y espacios";
        } else {
          delete newErrors[field];
        }
      }
      if (field === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.length > 0 && !emailRegex.test(value)) {
          newErrors[field] = "Formato de correo inválido (ej: usuario@correo.com)";
        } else {
          delete newErrors[field];
        }
      }
      if (field === "phone") {
        const phoneRegex = /^[\+]?[0-9\s]*$/;
        if (!phoneRegex.test(value)) {
          newErrors[field] = "Solo se permiten números, espacios y el signo +";
        } else {
          delete newErrors[field];
        }
      }
    }
    setErrors(newErrors);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => Object.keys(errors).length === 0;

  return { formData, errors, handleChange, validateForm, setInitialData };
};